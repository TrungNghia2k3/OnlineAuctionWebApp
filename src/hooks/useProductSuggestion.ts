import { useState, useEffect, useCallback, useRef } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { STORAGE_KEYS } from '@/common/storage-key';
import { useAuth } from './useAuth';
import { useSendViewedProducts } from './useProductSuggestionsCache';
import { QUERY_KEYS } from '@/config/reactQuery';

interface ViewedProduct {
    productId: string | number;
    viewedAt: number; // timestamp
    category?: string;
    title?: string;
    currentBid?: number;
}

interface ProductSuggestionQueue {
    userId?: string;
    viewedProducts: ViewedProduct[];
    lastSentAt: number; // timestamp
}

interface UseProductSuggestionReturn {
    trackProductView: (productId: string | number, productDetails?: Partial<ViewedProduct>) => void;
    getViewedProducts: () => ViewedProduct[];
    clearViewedProducts: () => void;
    getQueuedSuggestions: () => ProductSuggestionQueue | null;
    isTracking: boolean;
    lastSyncTime: Date | null;
}

/**
 * Custom hook for tracking product views and managing suggestion queue
 * Automatically sends tracked data to server every 10 minutes
 */
export const useProductSuggestion = (): UseProductSuggestionReturn => {
    const { currentUser } = useAuth();
    const queryClient = useQueryClient();
    const sendViewedProductsMutation = useSendViewedProducts();
    const [isTracking, setIsTracking] = useState<boolean>(false);
    const [lastSyncTime, setLastSyncTime] = useState<Date | null>(null);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    // Constants
    const SYNC_INTERVAL = 60 * 1000; // 1 minute in milliseconds
    const MAX_VIEWED_PRODUCTS = 5; // Store only last 5 viewed products

    /**
     * Get viewed products from localStorage
     */
    const getViewedProducts = useCallback((): ViewedProduct[] => {
        try {
            const stored = localStorage.getItem(STORAGE_KEYS.VIEWED_PRODUCTS);
            return stored ? JSON.parse(stored) : [];
        } catch (error) {
            console.error('Error reading viewed products:', error);
            return [];
        }
    }, []);

    /**
     * Save viewed products to localStorage
     */
    const saveViewedProducts = useCallback((products: ViewedProduct[]): void => {
        try {
            // Keep only the most recent 5 products
            const limitedProducts = products.slice(-MAX_VIEWED_PRODUCTS);
            localStorage.setItem(STORAGE_KEYS.VIEWED_PRODUCTS, JSON.stringify(limitedProducts));
        } catch (error) {
            console.error('Error saving viewed products:', error);
        }
    }, []);

    /**
     * Get suggestion queue from localStorage
     */
    const getQueuedSuggestions = useCallback((): ProductSuggestionQueue | null => {
        try {
            const stored = localStorage.getItem(STORAGE_KEYS.PRODUCT_SUGGESTION_QUEUE);
            return stored ? JSON.parse(stored) : null;
        } catch (error) {
            console.error('Error reading suggestion queue:', error);
            return null;
        }
    }, []);

    /**
     * Save suggestion queue to localStorage
     */
    const saveSuggestionQueue = useCallback((queue: ProductSuggestionQueue): void => {
        try {
            localStorage.setItem(STORAGE_KEYS.PRODUCT_SUGGESTION_QUEUE, JSON.stringify(queue));
        } catch (error) {
            console.error('Error saving suggestion queue:', error);
        }
    }, []);

    /**
     * Update suggestion queue with latest viewed products
     */
    const updateSuggestionQueue = useCallback((viewedProducts: ViewedProduct[]): void => {
        try {
            const existingQueue = getQueuedSuggestions();
            const userId = currentUser?.id?.toString() || currentUser?.username || 'anonymous';

            const queue: ProductSuggestionQueue = {
                userId,
                viewedProducts,
                lastSentAt: existingQueue?.lastSentAt || 0,
            };

            saveSuggestionQueue(queue);
        } catch (error) {
            console.error('Error updating suggestion queue:', error);
        }
    }, [currentUser, getQueuedSuggestions, saveSuggestionQueue]);

    /**
     * Track a product view
     */
    const trackProductView = useCallback((
        productId: string | number,
        productDetails?: Partial<ViewedProduct>
    ): void => {
        try {
            const viewedProducts = getViewedProducts();
            const now = Date.now();

            // Create new viewed product entry
            const newViewedProduct: ViewedProduct = {
                productId,
                viewedAt: now,
                category: productDetails?.category,
                title: productDetails?.title,
                currentBid: productDetails?.currentBid,
            };

            // Remove existing entry for the same product (if any) to avoid duplicates
            const filteredProducts = viewedProducts.filter(
                (product) => product.productId !== productId
            );

            // Add new entry at the end
            const updatedProducts = [...filteredProducts, newViewedProduct];

            // Save to localStorage
            saveViewedProducts(updatedProducts);

            // Update queue for server sync
            updateSuggestionQueue(updatedProducts);

            console.log(`Product view tracked: ${productId}`, newViewedProduct);
        } catch (error) {
            console.error('Error tracking product view:', error);
        }
    }, [getViewedProducts, saveViewedProducts, updateSuggestionQueue]);

    /**
     * Send viewed products to server
     */
    const sendToServer = useCallback(async (): Promise<void> => {
        try {
            const queue = getQueuedSuggestions();

            if (!queue || queue.viewedProducts.length === 0) {
                console.log('No viewed products to send to server');
                return;
            }

            console.log('Sending viewed products to server:', queue);

            // Create API call to send suggestion data
            const suggestionData = {
                userId: queue.userId || 'anonymous',
                viewedProducts: queue.viewedProducts,
                timestamp: Date.now(),
            };

            try {
                // Use React Query mutation for better error handling and caching
                await sendViewedProductsMutation.mutateAsync(suggestionData);
                
                console.log('Successfully sent product suggestions to server');

                // Update last sent timestamp
                const updatedQueue: ProductSuggestionQueue = {
                    ...queue,
                    lastSentAt: Date.now(),
                };
                saveSuggestionQueue(updatedQueue);
                setLastSyncTime(new Date());

                // Invalidate suggestion caches to refresh with new data
                const userId = currentUser?.id?.toString() || currentUser?.username;
                if (userId) {
                    queryClient.invalidateQueries({ 
                        queryKey: QUERY_KEYS.USER_SUGGESTIONS(userId) 
                    });
                }

            } catch (apiError) {
                console.warn('Failed to send product suggestions:', apiError);
                // Don't update timestamp on failure, will retry next time
            }

        } catch (error) {
            console.error('Error sending viewed products to server:', error);
        }
    }, [getQueuedSuggestions, saveSuggestionQueue, sendViewedProductsMutation, currentUser, queryClient]);

    /**
     * Clear viewed products from storage
     */
    const clearViewedProducts = useCallback((): void => {
        try {
            localStorage.removeItem(STORAGE_KEYS.VIEWED_PRODUCTS);
            localStorage.removeItem(STORAGE_KEYS.PRODUCT_SUGGESTION_QUEUE);
            console.log('Viewed products cleared');
        } catch (error) {
            console.error('Error clearing viewed products:', error);
        }
    }, []);

    /**
     * Start tracking interval
     */
    const startTracking = useCallback((): void => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
        }

        // Send immediately on start
        sendToServer();

        // Set up interval to send every 10 minutes
        intervalRef.current = setInterval(() => {
            sendToServer();
        }, SYNC_INTERVAL);

        setIsTracking(true);
        console.log('Product suggestion tracking started - syncing every 10 minutes');
    }, [sendToServer, SYNC_INTERVAL]);

    /**
     * Stop tracking interval
     */
    const stopTracking = useCallback((): void => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }
        setIsTracking(false);
        console.log('Product suggestion tracking stopped');
    }, []);

    // Initialize tracking when component mounts
    useEffect(() => {
        startTracking();

        // Cleanup on unmount
        return () => {
            stopTracking();
        };
    }, [startTracking, stopTracking]);

    // Update queue when user changes
    useEffect(() => {
        const viewedProducts = getViewedProducts();
        if (viewedProducts.length > 0) {
            updateSuggestionQueue(viewedProducts);
        }
    }, [currentUser, getViewedProducts, updateSuggestionQueue]);

    return {
        trackProductView,
        getViewedProducts,
        clearViewedProducts,
        getQueuedSuggestions,
        isTracking,
        lastSyncTime,
    };
};

export default useProductSuggestion;
