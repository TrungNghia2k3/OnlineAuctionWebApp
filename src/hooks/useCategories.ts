import { useCallback, useEffect, useState } from 'react'
import categoryApi from '@/api/category'
import { ICategory } from '@/models'

interface UseCategoriesReturn {
  categories: ICategory[]
  isLoading: boolean
  error: string | null
  fetchCategories: () => Promise<void>
  getCategoryById: (id: number) => ICategory | undefined
  getCategoriesByParentId: (parentId: number) => ICategory[]
  refreshCategories: () => Promise<void>
}

/**
 * Custom hook for category management
 * Follows SRP by handling only category-related logic
 */
export const useCategories = (): UseCategoriesReturn => {
  const [categories, setCategories] = useState<ICategory[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  const fetchCategories = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await categoryApi.getAllCategory()
      setCategories(response.result || [])
    } catch (error) {
      console.error('Error fetching categories:', error)
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch categories'
      setError(errorMessage)
      setCategories([])
    } finally {
      setIsLoading(false)
    }
  }, [])

  const getCategoryById = useCallback((id: number): ICategory | undefined => {
    return categories.find(category => category.id === id)
  }, [categories])

  const getCategoriesByParentId = useCallback((parentId: number): ICategory[] => {
    return categories.filter(category => category.parentId === parentId)
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
    getCategoriesByParentId,
    refreshCategories
  }
}
