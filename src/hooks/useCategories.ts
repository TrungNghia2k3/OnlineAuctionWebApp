import { useCallback, useEffect, useState } from 'react'
import categoryService, { type Category } from '@/services/categoryService'

interface UseCategoriesReturn {
  categories: Category[]
  isLoading: boolean
  error: string | null
  fetchCategories: () => Promise<void>
  getCategoryById: (id: string | number) => Category | undefined
  getSpecialCategories: () => Category[]
  getApiCategories: () => Category[]
  refreshCategories: () => Promise<void>
}

/**
 * Custom hook for category management with API integration
 * Combines special categories (This week, For you, Trending) with API categories
 */
export const useCategories = (activeOnly: boolean = false): UseCategoriesReturn => {
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  const fetchCategories = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const response = activeOnly 
        ? await categoryService.getAllActiveCategories()
        : await categoryService.getAllCategories()
      setCategories(response)
    } catch (error) {
      console.error('Error fetching categories:', error)
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch categories'
      setError(errorMessage)
      // Fallback to special categories only
      setCategories(categoryService.SPECIAL_CATEGORIES)
    } finally {
      setIsLoading(false)
    }
  }, [activeOnly])

  const getCategoryById = useCallback((id: string | number): Category | undefined => {
    return categories.find(category => category.id === id)
  }, [categories])

  const getSpecialCategories = useCallback((): Category[] => {
    return categories.filter(category => 
      typeof category.id === 'string' && category.id.includes('-')
    )
  }, [categories])

  const getApiCategories = useCallback((): Category[] => {
    return categories.filter(category => 
      typeof category.id === 'number'
    )
  }, [categories])

  const refreshCategories = useCallback(async () => {
    await fetchCategories()
  }, [fetchCategories])

  useEffect(() => {
    fetchCategories()
  }, [fetchCategories])

  return {
    categories,
    isLoading,
    error,
    fetchCategories,
    getCategoryById,
    getSpecialCategories,
    getApiCategories,
    refreshCategories
  }
}
