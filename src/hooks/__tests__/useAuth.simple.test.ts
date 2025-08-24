import { renderHook } from '@testing-library/react'
import { useAuth } from '../useAuth'

// Mock ServiceFactory
jest.mock('@/services/ServiceFactory', () => ({
  ServiceFactory: {
    getAuthService: jest.fn(() => ({
      login: jest.fn(),
      logout: jest.fn(),
      register: jest.fn(),
      forgotPassword: jest.fn(),
      resetPassword: jest.fn(),
      changePassword: jest.fn(),
      refreshToken: jest.fn(),
      validateToken: jest.fn(),
    }))
  }
}))

// Mock react-router-dom
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => jest.fn(),
}))

// Mock jwt-decode
jest.mock('jwt-decode', () => ({
  jwtDecode: jest.fn()
}))

describe('useAuth Hook - Simple Tests', () => {
  beforeEach(() => {
    localStorage.clear()
    sessionStorage.clear()
  })

  test('should initialize with no user', () => {
    const { result } = renderHook(() => useAuth())

    expect(result.current.currentUser).toBeNull()
    expect(result.current.isLoading).toBe(false)
    expect(result.current.isAuthenticated()).toBe(false)
  })

  test('should have required methods', () => {
    const { result } = renderHook(() => useAuth())

    expect(typeof result.current.login).toBe('function')
    expect(typeof result.current.logout).toBe('function')
    expect(typeof result.current.hasRole).toBe('function')
    expect(typeof result.current.isAdmin).toBe('function')
    expect(typeof result.current.isUser).toBe('function')
    expect(typeof result.current.getDisplayName).toBe('function')
    expect(typeof result.current.getUsername).toBe('function')
    expect(typeof result.current.getUserRole).toBe('function')
    expect(typeof result.current.checkAuthStatus).toBe('function')
  })
})
