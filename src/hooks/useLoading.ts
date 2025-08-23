import { useCallback, useState } from 'react'

interface UseLoadingReturn {
  isLoading: boolean
  showLoading: () => void
  hideLoading: () => void
  withLoading: <T>(asyncOperation: () => Promise<T>) => Promise<T>
}

/**
 * Custom hook for loading state management
 * Follows SRP by handling only loading state logic
 */
export const useLoading = (): UseLoadingReturn => {
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const showLoading = useCallback(() => {
    setIsLoading(true)
  }, [])

  const hideLoading = useCallback(() => {
    setIsLoading(false)
  }, [])

  const withLoading = useCallback(async <T>(asyncOperation: () => Promise<T>): Promise<T> => {
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
