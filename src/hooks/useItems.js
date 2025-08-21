import { useState, useEffect } from 'react';
import { Item } from '@/models';
import itemApi from '@/api/item';

/**
 * useItems Hook
 * Manages fetching multiple items from API
 */
export const useItems = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchItems = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await itemApi.getAllItem();
      
      // Convert API response to Item instances
      const itemInstances = response.result.map(itemData => Item.fromApiResponse(itemData));
      
      setItems(itemInstances);
    } catch (err) {
      setError(err.message || 'Failed to fetch items');
    } finally {
      setLoading(false);
    }
  };

  const refreshItems = () => {
    fetchItems();
  };

  useEffect(() => {
    fetchItems();
  }, []);

  return {
    items,
    loading,
    error,
    refreshItems
  };
};

export default useItems;
