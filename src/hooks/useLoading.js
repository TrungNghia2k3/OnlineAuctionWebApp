import { useCallback, useState } from 'react'

/**
 * Custom hook for loading state management
 * Follows SRP by handling only loading state logic
 */
export const useLoading = () => {
  const [isLoading, setIsLoading] = useState(false)

  const showLoading = useCallback(() => {
    setIsLoading(true)
  }, [])

  const hideLoading = useCallback(() => {
    setIsLoading(false)
  }, [])

  const withLoading = useCallback(async (asyncOperation) => {
    showLoading()
    try {
      const result = await asyncOperation()
      return result
    } finally {
      hideLoading()
    }
  }, [showLoading, hideLoading])

  return {
    isLoading,
    showLoading,
    hideLoading,
    withLoading
  }
}
