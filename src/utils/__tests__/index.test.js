// Testing AuthUtils - a practical example for your codebase
import { AuthUtils } from '../AuthUtils'
import { STORAGE_KEYS } from '@/common'

// Mock jwt-decode
jest.mock('jwt-decode')
const mockJwtDecode = require('jwt-decode')

describe('AuthUtils', () => {
  beforeEach(() => {
    // Clear localStorage and sessionStorage before each test
    localStorage.clear()
    sessionStorage.clear()
    jest.clearAllMocks()
  })

  describe('getToken', () => {
    test('returns token from sessionStorage when valid', () => {
      const testToken = 'valid-session-token'
      const mockDecodedToken = {
        sub: 'testuser',
        exp: Math.floor(Date.now() / 1000) + 3600 // 1 hour from now
      }
      
      sessionStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(testToken))
      mockJwtDecode.jwtDecode.mockReturnValue(mockDecodedToken)
      
      const result = AuthUtils.getToken()
      
      expect(result).toBe(testToken)
    })

    test('returns token from localStorage when sessionStorage empty', () => {
      const testToken = 'valid-local-token'
      const mockDecodedToken = {
        sub: 'testuser',
        exp: Math.floor(Date.now() / 1000) + 3600 // 1 hour from now
      }
      
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(testToken))
      mockJwtDecode.jwtDecode.mockReturnValue(mockDecodedToken)
      
      const result = AuthUtils.getToken()
      
      expect(result).toBe(testToken)
    })

    test('returns null when no token exists', () => {
      const result = AuthUtils.getToken()
      
      expect(result).toBeNull()
    })

    test('returns null when token is expired', () => {
      const expiredToken = 'expired-token'
      const mockDecodedToken = {
        sub: 'testuser',
        exp: Math.floor(Date.now() / 1000) - 3600 // 1 hour ago
      }
      
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(expiredToken))
      mockJwtDecode.jwtDecode.mockReturnValue(mockDecodedToken)
      
      const result = AuthUtils.getToken()
      
      expect(result).toBeNull()
    })
  })

  describe('isTokenValid', () => {
    test('returns true for valid token', () => {
      const validToken = 'valid-token'
      mockJwtDecode.jwtDecode.mockReturnValue({
        exp: Math.floor(Date.now() / 1000) + 3600 // 1 hour from now
      })
      
      const result = AuthUtils.isTokenValid(validToken)
      
      expect(result).toBe(true)
    })

    test('returns false for expired token', () => {
      const expiredToken = 'expired-token'
      mockJwtDecode.jwtDecode.mockReturnValue({
        exp: Math.floor(Date.now() / 1000) - 3600 // 1 hour ago
      })
      
      const result = AuthUtils.isTokenValid(expiredToken)
      
      expect(result).toBe(false)
    })

    test('returns false for invalid token format', () => {
      const invalidToken = 'invalid-token'
      mockJwtDecode.jwtDecode.mockImplementation(() => {
        throw new Error('Invalid token')
      })
      
      const result = AuthUtils.isTokenValid(invalidToken)
      
      expect(result).toBe(false)
    })
  })

  describe('getAuthHeader', () => {
    test('returns authorization header when token exists', () => {
      const testToken = 'test-token'
      const mockDecodedToken = {
        sub: 'testuser',
        exp: Math.floor(Date.now() / 1000) + 3600
      }
      
      sessionStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(testToken))
      mockJwtDecode.jwtDecode.mockReturnValue(mockDecodedToken)
      
      const result = AuthUtils.getAuthHeader()
      
      expect(result).toEqual({
        'Authorization': `Bearer ${testToken}`
      })
    })

    test('returns empty object when no token exists', () => {
      const result = AuthUtils.getAuthHeader()
      
      expect(result).toEqual({})
    })
  })

  describe('getUsername', () => {
    test('returns username from token', () => {
      const testToken = 'test-token'
      const mockDecodedToken = {
        sub: 'testuser',
        exp: Math.floor(Date.now() / 1000) + 3600
      }
      
      sessionStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(testToken))
      mockJwtDecode.jwtDecode.mockReturnValue(mockDecodedToken)
      
      const result = AuthUtils.getUsername()
      
      expect(result).toBe('testuser')
    })

    test('returns null when no token exists', () => {
      const result = AuthUtils.getUsername()
      
      expect(result).toBeNull()
    })
  })

  describe('clearAuth', () => {
    test('clears authentication data from both storages', () => {
      // Set up some data first
      sessionStorage.setItem(STORAGE_KEYS.CURRENT_USER, 'session-token')
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, 'local-token')
      
      // Verify data exists
      expect(sessionStorage.getItem(STORAGE_KEYS.CURRENT_USER)).not.toBeNull()
      expect(localStorage.getItem(STORAGE_KEYS.CURRENT_USER)).not.toBeNull()
      
      AuthUtils.clearAuth()
      
      // Verify data is cleared
      expect(sessionStorage.getItem(STORAGE_KEYS.CURRENT_USER)).toBeNull()
      expect(localStorage.getItem(STORAGE_KEYS.CURRENT_USER)).toBeNull()
    })
  })
})
