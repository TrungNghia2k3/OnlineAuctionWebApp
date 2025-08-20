import { useCallback, useEffect, useState } from 'react'
import { jwtDecode } from 'jwt-decode'
import { useNavigate } from 'react-router-dom'
import { STORAGE_KEYS } from '@/common/storage-names'
import { USER_ROLES } from '@/common/constant'
import { IUser, User, UserRole, ILoginCredentials, IRegisterData } from '@/models'
import { ServiceFactory } from '@/services/ServiceFactory'

interface DecodedToken {
  sub: string
  scope: string
  iss: string
  jti: string
  iat: number
  exp: number
}

interface UseAuthReturn {
  currentUser: IUser | null
  isLoading: boolean
  login: (credentials: ILoginCredentials) => Promise<{ success: boolean; error?: string }>
  register: (userData: IRegisterData) => Promise<{ success: boolean; error?: string }>
  logout: () => void
  checkAuthStatus: () => void
  isAuthenticated: () => boolean
  hasRole: (requiredRole: UserRole) => boolean
  isAdmin: () => boolean
  isUser: () => boolean
}

/**
 * Custom hook for authentication management
 * Follows SRP by handling only authentication logic
 */
export const useAuth = (): UseAuthReturn => {
  const navigate = useNavigate()
  const [currentUser, setCurrentUser] = useState<IUser | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const authService = ServiceFactory.getAuthService()

  // Helper function to convert string roles to numeric roles for backward compatibility
  const getRoleNumber = useCallback((roleString: string): UserRole => {
    switch (roleString) {
      case 'ROLE_ADMIN':
        return USER_ROLES.ADMIN
      case 'ROLE_USER':
        return USER_ROLES.USER
      default:
        return USER_ROLES.GUEST
    }
  }, [])

  // Helper function to decode user data from token
  const getUserFromToken = useCallback((token: string): IUser | null => {
    try {
      const decoded = jwtDecode<DecodedToken>(token)
      const roleString = decoded.scope
      
      const userData: Partial<IUser> = {
        username: decoded.sub,
        role: getRoleNumber(roleString),
        roleString: roleString,
        // Add other token fields as needed
        id: decoded.jti, // Using token ID as user ID temporarily
        email: '', // This would come from a separate API call
        createdAt: new Date(decoded.iat * 1000),
        updatedAt: new Date()
      }
      
      return new User(userData).toJSON()
    } catch (error) {
      console.error('Invalid token:', error)
      return null
    }
  }, [getRoleNumber])

  const login = useCallback(async (credentials: ILoginCredentials): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true)
    try {
      const result = await authService.login(credentials)
      
      if (result.success && result.data) {
        const userData = getUserFromToken(result.data.accessToken)
        if (userData) {
          setCurrentUser(userData)
          const tokenToStore = result.data.accessToken
          sessionStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(tokenToStore))
          
          if (credentials.rememberMe) {
            localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(tokenToStore))
          }
          
          return { success: true }
        }
      }
      
      return { success: false, error: result.error || 'Login failed' }
    } catch (error: any) {
      return { success: false, error: error.message || 'An unexpected error occurred' }
    } finally {
      setIsLoading(false)
    }
  }, [authService, getUserFromToken])

  const register = useCallback(async (userData: IRegisterData): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true)
    try {
      const result = await authService.register(userData)
      
      if (result.success) {
        return { success: true }
      }
      
      return { success: false, error: result.error || 'Registration failed' }
    } catch (error: any) {
      return { success: false, error: error.message || 'An unexpected error occurred' }
    } finally {
      setIsLoading(false)
    }
  }, [authService])

  const logout = useCallback(() => {
    setCurrentUser(null)
    sessionStorage.removeItem(STORAGE_KEYS.CURRENT_USER)
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER)
    navigate('/login')
  }, [navigate])

  const checkAuthStatus = useCallback(() => {
    setIsLoading(true)
    
    // Check session storage first
    const sessionToken = sessionStorage.getItem(STORAGE_KEYS.CURRENT_USER)
    if (sessionToken) {
      try {
        const token = JSON.parse(sessionToken)
        const userData = getUserFromToken(token)
        if (userData) {
          // Check if token is not expired
          const decoded = jwtDecode<DecodedToken>(token)
          if (decoded.exp * 1000 > Date.now()) {
            setCurrentUser(userData)
            setIsLoading(false)
            return
          }
        }
      } catch (error) {
        console.error('Error parsing session storage:', error)
        sessionStorage.removeItem(STORAGE_KEYS.CURRENT_USER)
      }
    }
    
    // Check local storage
    const localToken = localStorage.getItem(STORAGE_KEYS.CURRENT_USER)
    if (localToken) {
      try {
        const token = JSON.parse(localToken)
        const userData = getUserFromToken(token)
        if (userData) {
          // Check if token is not expired
          const decoded = jwtDecode<DecodedToken>(token)
          if (decoded.exp * 1000 > Date.now()) {
            sessionStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(token))
            setCurrentUser(userData)
            setIsLoading(false)
            return
          }
        }
      } catch (error) {
        console.error('Error parsing local storage:', error)
        localStorage.removeItem(STORAGE_KEYS.CURRENT_USER)
      }
    }

    setCurrentUser(null)
    setIsLoading(false)
  }, [getUserFromToken])

  const isAuthenticated = useCallback((): boolean => {
    return currentUser !== null
  }, [currentUser])

  const hasRole = useCallback((requiredRole: UserRole): boolean => {
    if (!currentUser) return false
    return currentUser.role >= requiredRole
  }, [currentUser])

  const isAdmin = useCallback((): boolean => {
    return hasRole(USER_ROLES.ADMIN)
  }, [hasRole])

  const isUser = useCallback((): boolean => {
    return hasRole(USER_ROLES.USER)
  }, [hasRole])

  useEffect(() => {
    checkAuthStatus()
  }, [checkAuthStatus])

  return {
    currentUser,
    isLoading,
    login,
    register,
    logout,
    checkAuthStatus,
    isAuthenticated,
    hasRole,
    isAdmin,
    isUser
  }
}
