import { useState, useEffect, useCallback } from 'react';
import expertService from '@/services/expertService';
import { Expert, CreateExpertData, UpdateExpertData, ExpertiseArea } from '@/models/Expert';

interface UseExpertsReturn {
  experts: Expert[];
  isLoading: boolean;
  error: string | null;
  expertiseAreas: ExpertiseArea[];
  categoryNames: string[];
  refreshExperts: () => Promise<void>;
  createExpert: (data: CreateExpertData) => Promise<Expert | null>;
  updateExpert: (id: number, data: UpdateExpertData) => Promise<Expert | null>;
  deleteExpert: (id: number) => Promise<boolean>;
  searchExperts: (query: string) => Promise<Expert[]>;
  getExpertsByExpertise: (expertise: string) => Promise<Expert[]>;
  getExpertsByCategoryName: (categoryName: string) => Promise<Expert[]>;
  getExpertsBySubCategoryId: (subCategoryId: number) => Promise<Expert[]>;
  getExpertStats: () => Promise<{ totalExperts: number; activeExperts: number; expertiseAreas: ExpertiseArea[] }>;
}

/**
 * Custom hook for managing experts
 * Provides state management and operations for expert data
 */
export const useExperts = (activeOnly: boolean = true): UseExpertsReturn => {
  const [experts, setExperts] = useState<Expert[]>([]);
  const [expertiseAreas, setExpertiseAreas] = useState<ExpertiseArea[]>([]);
  const [categoryNames, setCategoryNames] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch experts from API
  const fetchExperts = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const [fetchedExperts, areas, categories] = await Promise.all([
        activeOnly 
          ? expertService.getAllExperts()
          : expertService.getAllActiveExperts(),
        expertService.getExpertiseAreas(),
        expertService.getCategoryNames()
      ]);
      
      setExperts(fetchedExperts);
      setExpertiseAreas(areas);
      setCategoryNames(categories);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch experts';
      setError(errorMessage);
      console.error('Error fetching experts:', err);
      setExperts([]);
      setExpertiseAreas([]);
      setCategoryNames([]);
    } finally {
      setIsLoading(false);
    }
  }, [activeOnly]);

  // Load experts on mount
  useEffect(() => {
    fetchExperts();
  }, [fetchExperts]);

  // Refresh experts
  const refreshExperts = useCallback(async () => {
    await fetchExperts();
  }, [fetchExperts]);

  // Create new expert
  const createExpert = useCallback(async (data: CreateExpertData): Promise<Expert | null> => {
    try {
      const newExpert = await expertService.createExpert(data);
      setExperts(prev => [...prev, newExpert]);
      
      // Refresh expertise areas after adding new expert
      const updatedAreas = await expertService.getExpertiseAreas();
      setExpertiseAreas(updatedAreas);
      
      return newExpert;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create expert';
      setError(errorMessage);
      console.error('Error creating expert:', err);
      return null;
    }
  }, []);

  // Update existing expert
  const updateExpert = useCallback(async (id: number, data: UpdateExpertData): Promise<Expert | null> => {
    try {
      const updatedExpert = await expertService.updateExpert(id, data);
      setExperts(prev => prev.map(expert => 
        expert.id === id ? updatedExpert : expert
      ));
      
      // Refresh expertise areas after updating expert
      const updatedAreas = await expertService.getExpertiseAreas();
      setExpertiseAreas(updatedAreas);
      
      return updatedExpert;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update expert';
      setError(errorMessage);
      console.error('Error updating expert:', err);
      return null;
    }
  }, []);

  // Delete expert
  const deleteExpert = useCallback(async (id: number): Promise<boolean> => {
    try {
      const success = await expertService.deleteExpert(id);
      if (success) {
        setExperts(prev => prev.filter(expert => expert.id !== id));
        
        // Refresh expertise areas after deleting expert
        const updatedAreas = await expertService.getExpertiseAreas();
        setExpertiseAreas(updatedAreas);
      }
      return success;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete expert';
      setError(errorMessage);
      console.error('Error deleting expert:', err);
      return false;
    }
  }, []);

  // Search experts
  const searchExperts = useCallback(async (query: string): Promise<Expert[]> => {
    try {
      const searchResults = await expertService.searchExperts(query);
      return searchResults;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to search experts';
      setError(errorMessage);
      console.error('Error searching experts:', err);
      return [];
    }
  }, []);

  // Get experts by expertise
  const getExpertsByExpertise = useCallback(async (expertise: string): Promise<Expert[]> => {
    try {
      const expertResults = await expertService.getExpertsByExpertise(expertise);
      return expertResults;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to get experts by expertise';
      setError(errorMessage);
      console.error('Error getting experts by expertise:', err);
      return [];
    }
  }, []);

  // Get experts by category name
  const getExpertsByCategoryName = useCallback(async (categoryName: string): Promise<Expert[]> => {
    try {
      const expertResults = await expertService.getExpertsByCategoryName(categoryName);
      return expertResults;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to get experts by category';
      setError(errorMessage);
      console.error('Error getting experts by category:', err);
      return [];
    }
  }, []);

  // Get experts by subcategory ID
  const getExpertsBySubCategoryId = useCallback(async (subCategoryId: number): Promise<Expert[]> => {
    try {
      const expertResults = await expertService.getExpertsBySubCategoryId(subCategoryId);
      return expertResults;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to get experts by subcategory';
      setError(errorMessage);
      console.error('Error getting experts by subcategory:', err);
      return [];
    }
  }, []);

  // Get expert statistics
  const getExpertStats = useCallback(async (): Promise<{ totalExperts: number; activeExperts: number; expertiseAreas: ExpertiseArea[] }> => {
    try {
      const stats = await expertService.getExpertStats();
      return stats;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to get expert statistics';
      setError(errorMessage);
      console.error('Error getting expert statistics:', err);
      return { totalExperts: 0, activeExperts: 0, expertiseAreas: [] };
    }
  }, []);

  return {
    experts,
    isLoading,
    error,
    expertiseAreas,
    categoryNames,
    refreshExperts,
    createExpert,
    updateExpert,
    deleteExpert,
    searchExperts,
    getExpertsByExpertise,
    getExpertsByCategoryName,
    getExpertsBySubCategoryId,
    getExpertStats
  };
};

interface UseExpertReturn {
  expert: Expert | null;
  isLoading: boolean;
  error: string | null;
  refreshExpert: () => Promise<void>;
}

/**
 * Custom hook for managing a single expert
 */
export const useExpert = (id: number): UseExpertReturn => {
  const [expert, setExpert] = useState<Expert | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch expert by ID
  const fetchExpert = useCallback(async () => {
    if (!id) return;
    
    try {
      setIsLoading(true);
      setError(null);
      
      const fetchedExpert = await expertService.getExpertById(id);
      setExpert(fetchedExpert);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch expert';
      setError(errorMessage);
      console.error('Error fetching expert:', err);
      setExpert(null);
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  // Load expert on mount or ID change
  useEffect(() => {
    fetchExpert();
  }, [fetchExpert]);

  // Refresh expert
  const refreshExpert = useCallback(async () => {
    await fetchExpert();
  }, [fetchExpert]);

  return {
    expert,
    isLoading,
    error,
    refreshExpert
  };
};
