import { LoadingContext } from '@/contexts'
import { useLoading } from '@/hooks'

/**
 * Loading Provider Component
 * Follows DIP by depending on abstractions (hooks) rather than concrete implementations
 */
export const LoadingProvider = ({ children }) => {
  const loadingValue = useLoading()

  return (
    <LoadingContext.Provider value={loadingValue}>
      {children}
    </LoadingContext.Provider>
  )
}
