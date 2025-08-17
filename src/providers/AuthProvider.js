import { AuthContext } from '../contexts/AuthContext'
import { useAuth } from '../hooks/useAuth'

/**
 * Authentication Provider Component
 * Follows DIP by depending on abstractions (hooks) rather than concrete implementations
 */
export const AuthProvider = ({ children }) => {
  const authValue = useAuth()

  return (
    <AuthContext.Provider value={authValue}>
      {children}
    </AuthContext.Provider>
  )
}
