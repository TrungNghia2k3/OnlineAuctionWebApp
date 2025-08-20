import { useCallback } from 'react'
import { useNavigate } from 'react-router-dom'

/**
 * useNavigation Hook
 * Single Responsibility: Handle navigation logic
 * Separated from UI components
 */
export const useNavigation = () => {
  const navigate = useNavigate()

  const navigateTo = useCallback((path, options = {}) => {
    navigate(path, options)
  }, [navigate])

  const navigateToCategory = useCallback((category) => {
    navigate(`/category/${category.slug}`)
  }, [navigate])

  const navigateToSearch = useCallback((query) => {
    const searchParams = new URLSearchParams({ q: query })
    navigate(`/search?${searchParams.toString()}`)
  }, [navigate])

  const navigateToProfile = useCallback(() => {
    navigate('/profile')
  }, [navigate])

  const navigateToFavorites = useCallback(() => {
    navigate('/favorites')
  }, [navigate])

  return {
    navigateTo,
    navigateToCategory,
    navigateToSearch,
    navigateToProfile,
    navigateToFavorites
  }
}
