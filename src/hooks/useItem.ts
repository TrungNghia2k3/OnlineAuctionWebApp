import { useState, useEffect, useCallback } from 'react';
import { Item } from '@/models';
import itemApi from '@/api/item';

interface UseItemReturn {
  item: Item | null
  loading: boolean
  error: string | null
  fetchItem: (id: string | number) => Promise<void>
  refreshItem: () => void
}

/**
 * useItem Hook
 * Manages item data fetching from API
 */
export const useItem = (itemId: string | number): UseItemReturn => {
    const [item, setItem] = useState<Item | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const fetchItem = useCallback(async (id: string | number): Promise<void> => {
        if (!id) return;

        setLoading(true);
        setError(null);

        try {
            const response = await itemApi.getById(id);
            
            if (response) {
                // Convert API response to Item instance
                const itemInstance = Item.fromApiResponse(response.result);
                setItem(itemInstance);
            } else {
                setError('Item not found');
            }
        } catch (err) {
            console.error('Error fetching item:', err);
            const errorMessage = err instanceof Error ? err.message : 'Failed to fetch item details';
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    }, []);

    const refreshItem = useCallback(() => {
        if (itemId) {
            fetchItem(itemId);
        }
    }, [itemId, fetchItem]);

    useEffect(() => {
        fetchItem(itemId);
    }, [itemId, fetchItem]);

    return {
        item,
        loading,
        error,
        fetchItem,
        refreshItem
    };
};

export default useItem;
