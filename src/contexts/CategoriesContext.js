import { createContext, useContext } from 'react'

/**
 * Categories Context
 * Follows ISP by providing only category-related functionality
 */
export const CategoriesContext = createContext({
  categories: [],
  isLoading: false,
  error: null,
  fetchCategories: () => {},
  getCategoryById: () => null,
  getCategoriesByParentId: () => []
})

// Custom hook to use categories context with error handling
export const useCategoriesContext = () => {
  const context = useContext(CategoriesContext)
  if (!context) {
    throw new Error('useCategoriesContext must be used within a CategoriesProvider')
  }
  return context
}
