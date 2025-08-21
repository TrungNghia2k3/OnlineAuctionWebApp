import { STORAGE_KEYS } from '@/common'
import { jwtDecode } from 'jwt-decode'

interface DecodedToken {
  sub: string
  scope: string
  iss: string
  jti: string
  iat: number
  exp: number
}

/**
 * Auth Utilities
 * Helper functions for authentication and token management
 */
export class AuthUtils {
  
  /**
   * Get the stored authentication token
   */
  static getToken(): string | null {
    try {
      // Check sessionStorage first
      const sessionToken = sessionStorage.getItem(STORAGE_KEYS.CURRENT_USER)
      if (sessionToken) {
        const token = JSON.parse(sessionToken)
        if (this.isTokenValid(token)) {
          return token
        }
      }

      // Check localStorage
      const localToken = localStorage.getItem(STORAGE_KEYS.CURRENT_USER)
      if (localToken) {
        const token = JSON.parse(localToken)
        if (this.isTokenValid(token)) {
          return token
        }
      }

      return null
    } catch (error) {
      console.error('Error getting token:', error)
      return null
    }
  }

  /**
   * Check if a token is valid (not expired)
   */
  static isTokenValid(token: string): boolean {
    try {
      const decoded = jwtDecode<DecodedToken>(token)
      return decoded.exp * 1000 > Date.now()
    } catch (error) {
      return false
    }
  }

  /**
   * Get authorization header for API calls
   */
  static getAuthHeader(): Record<string, string> {
    const token = this.getToken()
    if (token) {
      return {
        'Authorization': `Bearer ${token}`
      }
    }
    return {}
  }

  /**
   * Decode token and get user information
   */
  static getDecodedToken(token: string): DecodedToken | null {
    try {
      return jwtDecode<DecodedToken>(token)
    } catch (error) {
      console.error('Error decoding token:', error)
      return null
    }
  }

  /**
   * Get username from stored token
   */
  static getUsername(): string | null {
    const token = this.getToken()
    if (token) {
      const decoded = this.getDecodedToken(token)
      return decoded?.sub || null
    }
    return null
  }

  /**
   * Get user role from stored token
   */
  static getUserRole(): string | null {
    const token = this.getToken()
    if (token) {
      const decoded = this.getDecodedToken(token)
      return decoded?.scope || null
    }
    return null
  }

  /**
   * Clear all authentication data
   */
  static clearAuth(): void {
    sessionStorage.removeItem(STORAGE_KEYS.CURRENT_USER)
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER)
  }
}

export default AuthUtils
