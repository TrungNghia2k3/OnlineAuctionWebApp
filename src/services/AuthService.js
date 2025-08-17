import { AuthService } from './interfaces'
import AuthenticationApi from '../api/authentication'

/**
 * Concrete implementation of AuthService
 * Follows DIP by implementing the abstract interface
 */
export class ApiAuthService extends AuthService {
  async login(credentials) {
    try {
      const response = await AuthenticationApi.login(credentials)
      return {
        success: true,
        data: response,
        message: 'Login successful'
      }
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Login failed',
        data: null
      }
    }
  }

  async logout() {
    try {
      // If there's a logout API endpoint
      // await AuthenticationApi.logout()
      return {
        success: true,
        message: 'Logout successful'
      }
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Logout failed'
      }
    }
  }

  async register(userData) {
    try {
      const response = await AuthenticationApi.register(userData)
      return {
        success: true,
        data: response,
        message: 'Registration successful'
      }
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Registration failed',
        data: null
      }
    }
  }

  async forgotPassword(email) {
    try {
      const response = await AuthenticationApi.forgotPassword(email)
      return {
        success: true,
        data: response,
        message: 'Password reset email sent'
      }
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Password reset failed',
        data: null
      }
    }
  }

  async refreshToken(token) {
    try {
      const response = await AuthenticationApi.refreshToken(token)
      return {
        success: true,
        data: response,
        message: 'Token refreshed successfully'
      }
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Token refresh failed',
        data: null
      }
    }
  }
}
