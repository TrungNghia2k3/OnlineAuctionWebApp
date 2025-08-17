import { createContext, useContext } from 'react'

/**
 * Loading Context
 * Follows ISP by providing only loading-related functionality
 */
export const LoadingContext = createContext({
  isLoading: false,
  showLoading: () => {},
  hideLoading: () => {},
  withLoading: () => {}
})

// Custom hook to use loading context with error handling
export const useLoadingContext = () => {
  const context = useContext(LoadingContext)
  if (!context) {
    throw new Error('useLoadingContext must be used within a LoadingProvider')
  }
  return context
}
