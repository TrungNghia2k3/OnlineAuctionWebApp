import { useCallback, useEffect, useState } from 'react'
import { jwtDecode } from 'jwt-decode'
import { useNavigate } from 'react-router-dom'
import { STORAGE_KEYS } from '../common/storage-names'
import { USER_ROLES } from '../common/constant'

/**
 * Custom hook for authentication management
 * Follows SRP by handling only authentication logic
 */
export const useAuth = () => {
  const navigate = useNavigate()
  const [currentUser, setCurrentUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  // Helper function to convert string roles to numeric roles for backward compatibility
  const getRoleNumber = useCallback((roleString) => {
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
  const getUserFromToken = useCallback((token) => {
    try {
      const decoded = jwtDecode(token)
      const roleString = decoded.scope
      return {
        username: decoded.sub,
        role: getRoleNumber(roleString),
        roleString: roleString,
        issuer: decoded.iss,
        tokenId: decoded.jti,
        issuedAt: decoded.iat,
        expiresAt: decoded.exp,
        token: token
      }
    } catch (error) {
      console.error('Invalid token:', error)
      return null
    }
  }, [getRoleNumber])

  const login = useCallback(async (tokenOrUserData) => {
    if (!tokenOrUserData) {
      setCurrentUser(null)
      return
    }
    
    let token
    if (typeof tokenOrUserData === 'string') {
      token = tokenOrUserData
    } else if (tokenOrUserData.token) {
      token = tokenOrUserData.token
    } else {
      return
    }

    const userData = getUserFromToken(token)
    if (userData) {
      setCurrentUser(userData)
      sessionStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(token))
    }
  }, [getUserFromToken])

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
        if (userData && userData.expiresAt * 1000 > Date.now()) {
          setCurrentUser(userData)
          setIsLoading(false)
          return
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
        if (userData && userData.expiresAt * 1000 > Date.now()) {
          sessionStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(token))
          setCurrentUser(userData)
          setIsLoading(false)
          return
        }
      } catch (error) {
        console.error('Error parsing local storage:', error)
        localStorage.removeItem(STORAGE_KEYS.CURRENT_USER)
      }
    }

    setCurrentUser(null)
    setIsLoading(false)
  }, [getUserFromToken])

  const isAuthenticated = useCallback(() => {
    return currentUser !== null
  }, [currentUser])

  const hasRole = useCallback((requiredRole) => {
    if (!currentUser) return false
    return currentUser.role >= requiredRole
  }, [currentUser])

  const isAdmin = useCallback(() => {
    return hasRole(USER_ROLES.ADMIN)
  }, [hasRole])

  const isUser = useCallback(() => {
    return hasRole(USER_ROLES.USER)
  }, [hasRole])

  useEffect(() => {
    checkAuthStatus()
  }, [checkAuthStatus])

  return {
    currentUser,
    isLoading,
    login,
    logout,
    checkAuthStatus,
    isAuthenticated,
    hasRole,
    isAdmin,
    isUser
  }
}
