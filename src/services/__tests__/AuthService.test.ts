import { AuthService } from '../AuthService'
import { ILoginCredentials, IRegisterData } from '../interfaces'
import authentication from '@/api/authentication'

// Mock the authentication API
jest.mock('@/api/authentication')
const mockAuthentication = authentication as jest.Mocked<typeof authentication>

describe('AuthService', () => {
  let authService: AuthService

  beforeEach(() => {
    authService = new AuthService()
    jest.clearAllMocks()
  })

  describe('login', () => {
    const mockCredentials: ILoginCredentials = {
      username: 'testuser',
      password: 'password123'
    }

    test('should return success response for valid credentials', async () => {
      // Arrange
      const mockApiResponse = {
        code: 1000,
        message: 'Success',
        result: {
          token: 'mock-jwt-token-12345'
        }
      }

      mockAuthentication.authenticate.mockResolvedValue(mockApiResponse)

      // Act
      const result = await authService.login(mockCredentials)

      // Assert
      expect(mockAuthentication.authenticate).toHaveBeenCalledWith(
        mockCredentials.username,
        mockCredentials.password
      )

      expect(result.success).toBe(true)
      expect(result.data).toEqual({
        accessToken: 'mock-jwt-token-12345',
        tokenType: 'Bearer',
        expiresIn: 3600,
        expiresAt: expect.any(Date),
        scope: ['USER']
      })
      expect(result.message).toBe('Login successful')
    })

    test('should return error response for invalid credentials', async () => {
      // Arrange
      const mockApiResponse = {
        code: 1001,
        message: 'Invalid credentials',
        result: null
      }

      mockAuthentication.authenticate.mockResolvedValue(mockApiResponse)

      // Act
      const result = await authService.login(mockCredentials)

      // Assert
      expect(result.success).toBe(false)
      expect(result.error).toBe('Invalid credentials')
      expect(result.data).toBeUndefined()
    })

    test('should handle network errors gracefully', async () => {
      // Arrange
      const networkError = new Error('Network connection failed')
      mockAuthentication.authenticate.mockRejectedValue(networkError)

      // Act
      const result = await authService.login(mockCredentials)

      // Assert
      expect(result.success).toBe(false)
      expect(result.error).toBe('Network connection failed')
      expect(result.data).toBeUndefined()
    })

    test('should handle API response without result field', async () => {
      // Arrange
      const mockApiResponse = {
        code: 1000,
        message: 'Success',
        // Missing result field
      }

      mockAuthentication.authenticate.mockResolvedValue(mockApiResponse)

      // Act
      const result = await authService.login(mockCredentials)

      // Assert
      expect(result.success).toBe(false)
      expect(result.error).toBe('Invalid credentials')
    })

    test('should handle malformed API response', async () => {
      // Arrange
      mockAuthentication.authenticate.mockResolvedValue(null as any)

      // Act
      const result = await authService.login(mockCredentials)

      // Assert
      expect(result.success).toBe(false)
      expect(result.error).toBe('Invalid credentials')
    })
  })

  describe('register', () => {
    const mockRegisterData: IRegisterData = {
      username: 'newuser',
      email: 'newuser@example.com',
      password: 'securepassword123',
      confirmPassword: 'securepassword123',
      firstName: 'John',
      lastName: 'Doe',
      agreeToTerms: true
    }

    test('should return success response for valid registration', async () => {
      // Arrange
      const mockApiResponse = {
        code: 1000,
        message: 'Registration successful',
        result: {
          id: '1',
          username: 'newuser',
          email: 'newuser@example.com',
          role: 1,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      }

      mockAuthentication.register.mockResolvedValue(mockApiResponse)

      // Act
      const result = await authService.register(mockRegisterData)

      // Assert
      expect(mockAuthentication.register).toHaveBeenCalledWith(
        mockRegisterData.username,
        mockRegisterData.password
      )
      expect(result.success).toBe(true)
      expect(result.message).toBe('Registration successful')
    })

    test('should return error response when username already exists', async () => {
      // Arrange
      const mockApiResponse = {
        code: 1002,
        message: 'Username already exists',
        result: null
      }

      mockAuthentication.register.mockResolvedValue(mockApiResponse)

      // Act
      const result = await authService.register(mockRegisterData)

      // Assert
      expect(result.success).toBe(false)
      expect(result.error).toBe('Username already exists')
    })

    test('should handle registration network errors', async () => {
      // Arrange
      const networkError = new Error('Registration service unavailable')
      mockAuthentication.register.mockRejectedValue(networkError)

      // Act
      const result = await authService.register(mockRegisterData)

      // Assert
      expect(result.success).toBe(false)
      expect(result.error).toBe('Registration service unavailable')
    })
  })

  describe('forgotPassword', () => {
    test('should return success response for valid email', async () => {
      // Arrange
      const mockEmail = { email: 'user@example.com' }
      mockAuthentication.forgotPassword.mockResolvedValue({
        code: 1000,
        message: 'Password reset email sent'
      })

      // Act
      const result = await authService.forgotPassword(mockEmail)

      // Assert
      expect(mockAuthentication.forgotPassword).toHaveBeenCalledWith(mockEmail.email)
      expect(result.success).toBe(true)
      expect(result.message).toBe('Password reset email sent')
    })

    test('should return error response for invalid email', async () => {
      // Arrange
      const mockEmail = { email: 'nonexistent@example.com' }
      mockAuthentication.forgotPassword.mockResolvedValue({
        code: 1003,
        message: 'Email not found'
      })

      // Act
      const result = await authService.forgotPassword(mockEmail)

      // Assert
      expect(result.success).toBe(false)
      expect(result.error).toBe('Email not found')
    })
  })
})
