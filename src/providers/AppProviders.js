import { AuthProvider } from './AuthProvider'
import { CategoriesProvider } from './CategoriesProvider'
import { LoadingProvider } from './LoadingProvider'
import { ModalProvider } from './ModalProvider'
import { ReactQueryProvider } from './ReactQueryProvider'

/**
 * Combined Provider Component
 * Follows Composition pattern to combine multiple providers
 * Makes it easy to add/remove providers without changing App.js
 */
export const AppProviders = ({ children }) => {
  return (
    <ReactQueryProvider>
      <AuthProvider>
        <CategoriesProvider>
          <LoadingProvider>
            <ModalProvider>
              {children}
            </ModalProvider>
          </LoadingProvider>
        </CategoriesProvider>
      </AuthProvider>
    </ReactQueryProvider>
  )
}
