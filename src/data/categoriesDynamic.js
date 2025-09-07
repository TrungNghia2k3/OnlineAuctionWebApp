/**
 * Dynamic categories provider that replaces static categories.js
 * This maintains the same interface but fetches data from the API
 */

import categoryService from '@/services/categoryService';

// Export the getAllCategories function that can be used to get categories
export const getCategories = async () => {
  try {
    return await categoryService.getAllCategories();
  } catch (error) {
    console.error('Error fetching categories:', error);
    return categoryService.SPECIAL_CATEGORIES;
  }
};

// Export the getActiveCategories function
export const getActiveCategories = async () => {
  try {
    return await categoryService.getAllActiveCategories();
  } catch (error) {
    console.error('Error fetching active categories:', error);
    return categoryService.SPECIAL_CATEGORIES;
  }
};

// For backward compatibility, export a default that returns a promise
// This allows existing code that imports categories to still work
const categories = getCategories();

export default categories;
