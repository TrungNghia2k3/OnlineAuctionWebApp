import { useCallback, useEffect, useState } from 'react'
import { jwtDecode } from 'jwt-decode'
import { useNavigate } from 'react-router-dom'
import { USER_ROLES, STORAGE_KEYS } from '@/common'

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
        userId: decoded.userId, // Extract userId from JWT token
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

  const login = useCallback(async (credentials) => {
    console.log('🚀 Login function called with credentials:', {
      username: credentials.username,
      password: credentials.password ? '***' : 'NO PASSWORD',
      hasRememberMe: !!credentials.rememberMe
    })
    
    setIsLoading(true)
    
    try {
      console.log('📡 Making API call to authenticate...')
      
      // Call the authentication API directly
      const response = await fetch('http://localhost:8080/api/v1/auth/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          username: credentials.username, 
          password: credentials.password 
        }),
      })

      console.log('📥 API Response status:', response.status, response.statusText)

      if (!response.ok) {
        console.error('❌ API call failed with status:', response.status)
        throw new Error('Authentication failed')
      }

      const data = await response.json()
      console.log('📦 API Response data:', data)

      // Check if the response has the expected structure
      if (data && data.code === 1000 && data.result && data.result.token) {
        const token = data.result.token
        console.log('🔑 Token extracted successfully:', token ? 'YES' : 'NO')
        console.log('🔑 Token length:', token ? token.length : 0)

        // Decode the token to get user data
        console.log('🔍 Decoding JWT token...')
        const userData = getUserFromToken(token)
        console.log('👤 User data from token:', userData)

        if (userData) {
          console.log('✅ Setting current user:', userData.username)
          setCurrentUser(userData)
          
          // Store token in localStorage
          console.log('💾 Storing token in localStorage...')
          localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(token))
          
          // Also store in sessionStorage
          console.log('💾 Storing token in sessionStorage...')
          sessionStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(token))

          console.log('🎉 Login successful!')
          return { success: true }
        } else {
          console.error('❌ Failed to decode user data from token')
          return { success: false, error: 'Failed to decode user data' }
        }
      } else {
        console.error('❌ Invalid API response structure:', data)
        return { success: false, error: 'Invalid response from server' }
      }
    } catch (error) {
      console.error('💥 Login error:', error)
      return { success: false, error: error.message || 'An unexpected error occurred' }
    } finally {
      console.log('🏁 Setting loading to false')
      setIsLoading(false)
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

  const getDisplayName = useCallback(() => {
    if (!currentUser) return null
    return currentUser.username || null
  }, [currentUser])

  const getUsername = useCallback(() => {
    if (!currentUser) return null
    return currentUser.username || null
  }, [currentUser])

  const getUserRole = useCallback(() => {
    if (!currentUser) return null
    return currentUser.roleString || null
  }, [currentUser])

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
    isUser,
    getDisplayName,
    getUsername,
    getUserRole
  }
}
