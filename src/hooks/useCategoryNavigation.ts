import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './useAuth';
import categories from '../data/categories';

interface CategoryBreadcrumb {
  name: string
  path: string
}

// Simple category type matching the data structure
interface SimpleCategory {
  id: number
  name: string
  icon: string
  color: string
  sub: { name: string; image: string }[]
}

interface UseCategoryNavigationReturn {
  activeCategory: SimpleCategory
  handleCategorySelect: (category: SimpleCategory) => void
  getBreadcrumb: () => CategoryBreadcrumb[]
  shouldDisplayCategory: (category: SimpleCategory) => boolean
  getFilteredCategories: () => SimpleCategory[]
}

/**
 * Custom hook for managing category navigation
 * Handles active category state and navigation logic with Swiper
 */
export const useCategoryNavigation = (): UseCategoryNavigationReturn => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState<SimpleCategory>(categories[0]); // Default to "This week"

  // Handle category selection
  const handleCategorySelect = useCallback((category: SimpleCategory) => {
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
  const shouldDisplayCategory = useCallback((category: SimpleCategory): boolean => {
    if (category.name === "For you") {
      return isAuthenticated();
    }
    return true;
  }, [isAuthenticated]);

  // Filter categories based on authentication
  const getFilteredCategories = useCallback((): SimpleCategory[] => {
    return categories.filter(shouldDisplayCategory);
  }, [shouldDisplayCategory]);

  return {
    activeCategory,
    handleCategorySelect,
    getBreadcrumb,
    shouldDisplayCategory,
    getFilteredCategories
  };
};