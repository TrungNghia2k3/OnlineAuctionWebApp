import { useState, useEffect, useCallback } from 'react';
import { Item } from '@/models';
import itemApi from '@/api/item';

/**
 * useItem Hook
 * Manages item data fetching from API
 */
export const useItem = (itemId) => {
    const [item, setItem] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchItem = useCallback(async (id) => {
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
            setError(err.message || 'Failed to fetch item details');
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
        refreshItem
    };
};

export default useItem;
