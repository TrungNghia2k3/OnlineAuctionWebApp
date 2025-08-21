import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './useAuth';
import categories from '../data/categories';

/**
 * Custom hook for managing category navigation
 * Handles active category state and navigation logic with Swiper
 */
export const useCategoryNavigation = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState(categories[0]); // Default to "This week"

  // Handle category selection
  const handleCategorySelect = useCallback((category) => {
    // Handle "For you" category - require authentication
    if (category.name === "For you" && !isAuthenticated()) {
      // Navigate to login page
      navigate('/login');
      return;
    }
    
    setActiveCategory(category);
  }, [isAuthenticated, navigate]);

  // Get breadcrumb for active category
  const getBreadcrumb = useCallback(() => {
    if (!activeCategory) return [];
    
    return [
      { name: 'Catawiki', path: '/' },
      { name: activeCategory.name, path: `/category/${activeCategory.id}` }
    ];
  }, [activeCategory]);

  // Check if category should be displayed (For you requires auth)
  const shouldDisplayCategory = useCallback((category) => {
    if (category.name === "For you") {
      return isAuthenticated();
    }
    return true;
  }, [isAuthenticated]);

  // Filter categories based on authentication
  const getFilteredCategories = useCallback(() => {
    return categories.filter(shouldDisplayCategory);
  }, [shouldDisplayCategory]);

  return {
    // State
    activeCategory,
    
    // Computed values
    allCategories: categories,
    filteredCategories: getFilteredCategories(),
    breadcrumb: getBreadcrumb(),
    
    // Actions
    setActiveCategory: handleCategorySelect
  };
};