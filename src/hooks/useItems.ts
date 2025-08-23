import { useState, useEffect } from 'react';
import { Item } from '@/models';
import itemApi from '@/api/item';

interface UseItemsReturn {
  items: Item[]
  loading: boolean
  error: string | null
  fetchItems: () => Promise<void>
  refreshItems: () => Promise<void>
}

/**
 * useItems Hook
 * Manages fetching multiple items from API
 */
export const useItems = (): UseItemsReturn => {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchItems = async (): Promise<void> => {
    setLoading(true);
    setError(null);

    try {
      const response = await itemApi.getAllItem();
      
      // Convert API response to Item instances
      const itemInstances = response.result.map((itemData: any) => Item.fromApiResponse(itemData));
      
      setItems(itemInstances);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch items'
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const refreshItems = async (): Promise<void> => {
    await fetchItems();
  };

  useEffect(() => {
    fetchItems();
  }, []);

  return {
    items,
    loading,
    error,
    fetchItems,
    refreshItems
  };
};

export default useItems;
