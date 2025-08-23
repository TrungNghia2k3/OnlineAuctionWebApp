import { IAuthService } from './interfaces'
import { BaseResponse } from '@/types'
import { 
  IUser, 
  ILoginCredentials, 
  IRegisterData, 
  IForgotPasswordRequest, 
  IAuthToken,
  User 
} from '@/models'
import authentication from '../api/authentication'

/**
 * Concrete implementation of IAuthService
 * Follows DIP by implementing the abstract interface
 */
export class AuthService implements IAuthService {
  async login(credentials: ILoginCredentials): Promise<BaseResponse<IAuthToken>> {
    try {
      const response = await authentication.authenticate(credentials.username, credentials.password)

      console.log('API response:', response)

      // Handle the new API response format
      if (response && response.code === 1000 && response.result) {
        const authToken: IAuthToken = {
          accessToken: response.result.token,
          tokenType: 'Bearer',
          expiresIn: 3600, // Default to 1 hour, could be extracted from JWT
          expiresAt: new Date(Date.now() + 3600 * 1000),
          scope: ['USER'] // Default scope, could be extracted from JWT
        }
        
        return {
          success: true,
          data: authToken,
          message: 'Login successful'
        }
      } else {
        return {
          success: false,
          error: 'Invalid credentials',
          data: undefined
        }
      }
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Login failed',
        data: undefined
      }
    }
  }

  async logout(): Promise<BaseResponse<void>> {
    // If there's a logout API endpoint
    // await authentication.logout()
    return {
      success: true,
      message: 'Logout successful'
    }
  }

  async register(userData: IRegisterData): Promise<BaseResponse<IUser>> {
    try {
      const response = await authentication.register(userData.username, userData.password)
      const user = User.fromApiResponse(response)
      return {
        success: true,
        data: user,
        message: 'Registration successful'
      }
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Registration failed',
        data: undefined
      }
    }
  }

  async forgotPassword(request: IForgotPasswordRequest): Promise<BaseResponse<void>> {
    try {
      const response = await authentication.forgotPassword(request.email)
      return {
        success: true,
        data: response,
        message: 'Password reset email sent'
      }
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Password reset failed',
        data: undefined
      }
    }
  }

  async resetPassword(token: string, newPassword: string): Promise<BaseResponse<void>> {
    try {
      const response = await authentication.resetPassword(token, newPassword)
      return {
        success: true,
        data: response,
        message: 'Password reset successful'
      }
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Password reset failed',
        data: undefined
      }
    }
  }

  async refreshToken(token: string): Promise<BaseResponse<IAuthToken>> {
    try {
      const response = await authentication.refreshToken(token)
      return {
        success: true,
        data: response,
        message: 'Token refreshed successfully'
      }
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Token refresh failed',
        data: undefined
      }
    }
  }

  async validateToken(token: string): Promise<BaseResponse<IUser>> {
    try {
      const response = await authentication.validateToken(token)
      const user = User.fromApiResponse(response)
      return {
        success: true,
        data: user,
        message: 'Token is valid'
      }
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Token validation failed',
        data: undefined
      }
    }
  }

  async changePassword(userId: string | number, currentPassword: string, newPassword: string): Promise<BaseResponse<void>> {
    try {
      const response = await authentication.changePassword('', currentPassword, newPassword)
      return {
        success: true,
        data: response,
        message: 'Password changed successfully'
      }
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Password change failed',
        data: undefined
      }
    }
  }
}
