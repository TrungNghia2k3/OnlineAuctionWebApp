import { createContext, useContext } from 'react'

/**
 * Authentication Context
 * Follows ISP by providing only authentication-related functionality
 */
export const AuthContext = createContext({
  currentUser: null,
  isLoading: false,
  login: () => {},
  logout: () => {},
  checkAuthStatus: () => {},
  isAuthenticated: () => false,
  hasRole: () => false,
  isAdmin: () => false,
  isUser: () => false,
  getDisplayName: () => null, // New method to get user display name
  getUsername: () => null,    // New method to get username
  getUserRole: () => null     // New method to get user role
})

// Custom hook to use auth context with error handling
export const useAuthContext = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuthContext must be used within an AuthProvider')
  }
  return context
}
