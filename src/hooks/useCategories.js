import { useCallback, useEffect, useState } from 'react'
import CategoriesApi from '../api/categories'

/**
 * Custom hook for category management
 * Follows SRP by handling only category-related logic
 */
export const useCategories = () => {
  const [categories, setCategories] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  const fetchCategories = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await CategoriesApi.getAll()
      setCategories(response || [])
    } catch (error) {
      console.error('Error fetching categories:', error)
      setError(error.message || 'Failed to fetch categories')
      setCategories([])
    } finally {
      setIsLoading(false)
    }
  }, [])

  const getCategoryById = useCallback((id) => {
    return categories.find(category => category.id === id)
  }, [categories])

  const getCategoriesByParentId = useCallback((parentId) => {
    return categories.filter(category => category.parentId === parentId)
  }, [categories])

  useEffect(() => {
    fetchCategories()
  }, [fetchCategories])

  return {
    categories,
    isLoading,
    error,
    fetchCategories,
    getCategoryById,
    getCategoriesByParentId
  }
}
