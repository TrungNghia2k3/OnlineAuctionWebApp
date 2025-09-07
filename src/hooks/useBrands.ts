import { useState, useEffect, useCallback } from 'react';
import brandService from '@/services/brandService';
import { Brand, CreateBrandData, UpdateBrandData } from '@/models/Brand';

interface UseBrandsReturn {
  brands: Brand[];
  isLoading: boolean;
  error: string | null;
  refreshBrands: () => Promise<void>;
  createBrand: (data: CreateBrandData) => Promise<Brand | null>;
  updateBrand: (id: number, data: UpdateBrandData) => Promise<Brand | null>;
  deleteBrand: (id: number) => Promise<boolean>;
  searchBrands: (query: string) => Promise<Brand[]>;
  getBrandStats: () => Promise<{ totalBrands: number; activeBrands: number; totalItems: number }>;
}

/**
 * Custom hook for managing brands
 * Provides state management and operations for brand data
 */
export const useBrands = (activeOnly: boolean = true): UseBrandsReturn => {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch brands from API
  const fetchBrands = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const fetchedBrands = activeOnly
        ? await brandService.getAllBrands()
        : await brandService.getAllActiveBrands();

      setBrands(fetchedBrands);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch brands';
      setError(errorMessage);
      console.error('Error fetching brands:', err);
      setBrands([]);
    } finally {
      setIsLoading(false);
    }
  }, [activeOnly]);

  // Load brands on mount
  useEffect(() => {
    fetchBrands();
  }, [fetchBrands]);

  // Refresh brands
  const refreshBrands = useCallback(async () => {
    await fetchBrands();
  }, [fetchBrands]);

  // Create new brand
  const createBrand = useCallback(async (data: CreateBrandData): Promise<Brand | null> => {
    try {
      const newBrand = await brandService.createBrand(data);
      setBrands(prev => [...prev, newBrand]);
      return newBrand;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create brand';
      setError(errorMessage);
      console.error('Error creating brand:', err);
      return null;
    }
  }, []);

  // Update existing brand
  const updateBrand = useCallback(async (id: number, data: UpdateBrandData): Promise<Brand | null> => {
    try {
      const updatedBrand = await brandService.updateBrand(id, data);
      setBrands(prev => prev.map(brand => 
        brand.id === id ? updatedBrand : brand
      ));
      return updatedBrand;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update brand';
      setError(errorMessage);
      console.error('Error updating brand:', err);
      return null;
    }
  }, []);

  // Delete brand
  const deleteBrand = useCallback(async (id: number): Promise<boolean> => {
    try {
      const success = await brandService.deleteBrand(id);
      if (success) {
        setBrands(prev => prev.filter(brand => brand.id !== id));
      }
      return success;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete brand';
      setError(errorMessage);
      console.error('Error deleting brand:', err);
      return false;
    }
  }, []);

  // Search brands
  const searchBrands = useCallback(async (query: string): Promise<Brand[]> => {
    try {
      const searchResults = await brandService.searchBrands(query);
      return searchResults;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to search brands';
      setError(errorMessage);
      console.error('Error searching brands:', err);
      return [];
    }
  }, []);

  // Get brand statistics
  const getBrandStats = useCallback(async (): Promise<{ totalBrands: number; activeBrands: number; totalItems: number }> => {
    try {
      const stats = await brandService.getBrandStats();
      return stats;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to get brand statistics';
      setError(errorMessage);
      console.error('Error getting brand statistics:', err);
      return { totalBrands: 0, activeBrands: 0, totalItems: 0 };
    }
  }, []);

  return {
    brands,
    isLoading,
    error,
    refreshBrands,
    createBrand,
    updateBrand,
    deleteBrand,
    searchBrands,
    getBrandStats
  };
};

interface UseBrandReturn {
  brand: Brand | null;
  isLoading: boolean;
  error: string | null;
  refreshBrand: () => Promise<void>;
}

/**
 * Custom hook for managing a single brand
 */
export const useBrand = (id: number): UseBrandReturn => {
  const [brand, setBrand] = useState<Brand | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch brand by ID
  const fetchBrand = useCallback(async () => {
    if (!id) return;
    
    try {
      setIsLoading(true);
      setError(null);
      
      const fetchedBrand = await brandService.getBrandById(id);
      setBrand(fetchedBrand);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch brand';
      setError(errorMessage);
      console.error('Error fetching brand:', err);
      setBrand(null);
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  // Load brand on mount or ID change
  useEffect(() => {
    fetchBrand();
  }, [fetchBrand]);

  // Refresh brand
  const refreshBrand = useCallback(async () => {
    await fetchBrand();
  }, [fetchBrand]);

  return {
    brand,
    isLoading,
    error,
    refreshBrand
  };
};
