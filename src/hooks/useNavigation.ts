import { useCallback } from 'react'
import { useNavigate, NavigateOptions } from 'react-router-dom'
import { ICategory } from '@/models'

interface UseNavigationReturn {
  navigateTo: (path: string, options?: NavigateOptions) => void
  navigateToCategory: (category: ICategory) => void
  navigateToSearch: (query: string) => void
  navigateToProfile: () => void
  navigateToFavorites: () => void
  navigateToBidDetail: (itemId: string | number) => void
}

/**
 * useNavigation Hook
 * Single Responsibility: Handle navigation logic
 * Separated from UI components
 */
export const useNavigation = (): UseNavigationReturn => {
  const navigate = useNavigate()

  const navigateTo = useCallback((path: string, options: NavigateOptions = {}) => {
    navigate(path, options)
  }, [navigate])

  const navigateToCategory = useCallback((category: ICategory) => {
    navigate(`/category/${category.slug}`)
  }, [navigate])

  const navigateToSearch = useCallback((query: string) => {
    const searchParams = new URLSearchParams({ q: query })
    navigate(`/search?${searchParams.toString()}`)
  }, [navigate])

  const navigateToProfile = useCallback(() => {
    navigate('/profile')
  }, [navigate])

  const navigateToFavorites = useCallback(() => {
    navigate('/favorites')
  }, [navigate])

  const navigateToBidDetail = useCallback((itemId: string | number) => {
    navigate(`/bid-detail/${itemId}`)
  }, [navigate])

  return {
    navigateTo,
    navigateToCategory,
    navigateToSearch,
    navigateToProfile,
    navigateToFavorites,
    navigateToBidDetail
  }
}
