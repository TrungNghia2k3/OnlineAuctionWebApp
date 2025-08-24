import { renderHook, act } from '@testing-library/react'
import { useAuth } from '../useAuth'
import { USER_ROLES } from '@/common'

// Mock ServiceFactory
const mockAuthService = {
  login: jest.fn(),
  logout: jest.fn(),
  register: jest.fn(),
  forgotPassword: jest.fn(),
  resetPassword: jest.fn(),
  changePassword: jest.fn(),
  refreshToken: jest.fn(),
  validateToken: jest.fn(),
}

jest.mock('@/services/ServiceFactory', () => ({
  ServiceFactory: {
    getAuthService: jest.fn(() => mockAuthService)
  }
}))

// Mock react-router-dom
const mockNavigate = jest.fn()
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}))

// Mock jwt-decode
const mockJwtDecode = jest.fn()
jest.mock('jwt-decode', () => ({
  jwtDecode: mockJwtDecode
}))

describe('useAuth Hook', () => {
  beforeEach(() => {
    localStorage.clear()
    sessionStorage.clear()
    jest.clearAllMocks()
    mockNavigate.mockClear()
  })

  describe('initialization', () => {
    test('should initialize with no user and not loading', () => {
      const { result } = renderHook(() => useAuth())

      expect(result.current.currentUser).toBeNull()
      expect(result.current.isLoading).toBe(false)
      expect(result.current.isAuthenticated()).toBe(false)
    })
  })

  describe('login functionality', () => {
    test('should handle successful login', async () => {
      // Arrange
      const mockCredentials = {
        username: 'testuser',
        password: 'password123'
      }

      const mockAuthResponse = {
        success: true,
        data: {
          accessToken: 'mock-jwt-token',
          tokenType: 'Bearer',
          expiresIn: 3600,
          expiresAt: new Date(Date.now() + 3600000),
          scope: ['USER']
        }
      }

      const mockDecodedToken = {
        sub: 'testuser',
        userId: '123',
        scope: 'USER',
        exp: Math.floor(Date.now() / 1000) + 3600
      }

      mockAuthService.login.mockResolvedValue(mockAuthResponse)
      mockJwtDecode.mockReturnValue(mockDecodedToken)

      const { result } = renderHook(() => useAuth())

      // Act
      let loginResult: any
      await act(async () => {
        loginResult = await result.current.login(mockCredentials)
      })

      // Assert
      expect(mockAuthService.login).toHaveBeenCalledWith(mockCredentials)
      expect(loginResult.success).toBe(true)
      expect(result.current.isAuthenticated()).toBe(true)
    })

    test('should handle login failure', async () => {
      // Arrange
      const mockCredentials = {
        username: 'testuser',
        password: 'wrongpassword'
      }

      const mockAuthResponse = {
        success: false,
        error: 'Invalid credentials'
      }

      mockAuthService.login.mockResolvedValue(mockAuthResponse)

      const { result } = renderHook(() => useAuth())

      // Act
      let loginResult: any
      await act(async () => {
        loginResult = await result.current.login(mockCredentials)
      })

      // Assert
      expect(loginResult.success).toBe(false)
      expect(loginResult.error).toBe('Invalid credentials')
      expect(result.current.currentUser).toBeNull()
      expect(result.current.isAuthenticated()).toBe(false)
    })
  })

  describe('logout functionality', () => {
    test('should clear user data and navigate to login', async () => {
      // Arrange
      mockAuthService.logout.mockResolvedValue({ success: true })

      const { result } = renderHook(() => useAuth())

      // Act
      await act(async () => {
        await result.current.logout()
      })

      // Assert
      expect(mockAuthService.logout).toHaveBeenCalled()
      expect(result.current.currentUser).toBeNull()
      expect(result.current.isAuthenticated()).toBe(false)
      expect(mockNavigate).toHaveBeenCalledWith('/login')
    })
  })

  describe('role checking', () => {
    test('should return false for role checks when not authenticated', () => {
      const { result } = renderHook(() => useAuth())

      expect(result.current.hasRole(USER_ROLES.USER)).toBe(false)
      expect(result.current.hasRole(USER_ROLES.ADMIN)).toBe(false)
      expect(result.current.isUser()).toBe(false)
      expect(result.current.isAdmin()).toBe(false)
    })
  })

  describe('user information getters', () => {
    test('should return null when user is not authenticated', () => {
      const { result } = renderHook(() => useAuth())

      expect(result.current.getDisplayName()).toBeNull()
      expect(result.current.getUsername()).toBeNull()
      expect(result.current.getUserRole()).toBeNull()
    })
  })

  describe('authentication status', () => {
    test('should correctly report authentication status', () => {
      const { result } = renderHook(() => useAuth())

      // Initially not authenticated
      expect(result.current.isAuthenticated()).toBe(false)

      // Check that all required methods exist
      expect(typeof result.current.isAuthenticated).toBe('function')
      expect(typeof result.current.checkAuthStatus).toBe('function')
      expect(typeof result.current.hasRole).toBe('function')
      expect(typeof result.current.isAdmin).toBe('function')
      expect(typeof result.current.isUser).toBe('function')
    })
  })

  describe('loading state', () => {
    test('should manage loading state correctly', async () => {
      const { result } = renderHook(() => useAuth())

      // Initially not loading
      expect(result.current.isLoading).toBe(false)

      // Test that loading state exists and is boolean
      expect(typeof result.current.isLoading).toBe('boolean')
    })
  })
})
