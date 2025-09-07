import { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './useAuth';
import categoryService, { type Category } from '@/services/categoryService';

interface CategoryBreadcrumb {
  name: string
  path: string
}

interface UseCategoryNavigationReturn {
  activeCategory: Category | null
  categories: Category[]
  isLoading: boolean
  error: string | null
  handleCategorySelect: (category: Category) => void
  getBreadcrumb: () => CategoryBreadcrumb[]
  shouldDisplayCategory: (category: Category) => boolean
  getFilteredCategories: () => Category[]
  refreshCategories: () => Promise<void>
}

/**
 * Custom hook for managing category navigation
 * Handles active category state and navigation logic with dynamic API data
 */
export const useCategoryNavigation = (): UseCategoryNavigationReturn => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  // State for categories and loading
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<Category | null>(null);

  // Fetch categories from API
  const fetchCategories = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const fetchedCategories = await categoryService.getAllCategories();
      setCategories(fetchedCategories);
      
      // Set default active category to "This week" if available
      if (fetchedCategories.length > 0 && !activeCategory) {
        const defaultCategory = fetchedCategories.find(cat => cat.name === "This week") || fetchedCategories[0];
        setActiveCategory(defaultCategory);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch categories';
      setError(errorMessage);
      console.error('Error fetching categories:', err);
      // Fallback to special categories
      setCategories(categoryService.SPECIAL_CATEGORIES);
      setActiveCategory(categoryService.SPECIAL_CATEGORIES[0]);
    } finally {
      setIsLoading(false);
    }
  }, [activeCategory]);

  // Load categories on mount
  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  // Handle category selection
  const handleCategorySelect = useCallback((category: Category) => {
    // Handle "For you" category - require authentication
    if (category.name === "For you" && !isAuthenticated()) {
      // Navigate to login page
      navigate('/login');
      return;
    }
    
    setActiveCategory(category);
  }, [isAuthenticated, navigate]);

  // Get breadcrumb for active category
  const getBreadcrumb = useCallback((): CategoryBreadcrumb[] => {
    if (!activeCategory) return [];
    
    return [
      { name: 'Catawiki', path: '/' },
      { name: activeCategory.name, path: `/category/${activeCategory.id}` }
    ];
  }, [activeCategory]);

  // Check if category should be displayed (For you requires auth)
  const shouldDisplayCategory = useCallback((category: Category): boolean => {
    if (category.name === "For you") {
      return isAuthenticated();
    }
    return true;
  }, [isAuthenticated]);

  // Filter categories based on authentication
  const getFilteredCategories = useCallback((): Category[] => {
    return categories.filter(shouldDisplayCategory);
  }, [categories, shouldDisplayCategory]);

  // Refresh categories
  const refreshCategories = useCallback(async () => {
    await fetchCategories();
  }, [fetchCategories]);

  return {
    activeCategory,
    categories,
    isLoading,
    error,
    handleCategorySelect,
    getBreadcrumb,
    shouldDisplayCategory,
    getFilteredCategories,
    refreshCategories
  };
};