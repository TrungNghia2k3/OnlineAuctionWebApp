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
import AuthenticationApi from '../api/authentication'

/**
 * Concrete implementation of IAuthService
 * Follows DIP by implementing the abstract interface
 */
export class ApiAuthService implements IAuthService {
  async login(credentials: ILoginCredentials): Promise<BaseResponse<IAuthToken>> {
    try {
      const response = await AuthenticationApi.login(credentials)
      return {
        success: true,
        data: response,
        message: 'Login successful'
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
    try {
      // If there's a logout API endpoint
      // await AuthenticationApi.logout()
      return {
        success: true,
        message: 'Logout successful'
      }
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Logout failed'
      }
    }
  }

  async register(userData: IRegisterData): Promise<BaseResponse<IUser>> {
    try {
      const response = await AuthenticationApi.register(userData)
      const user = User.fromApiResponse(response)
      return {
        success: true,
        data: user.toJSON(),
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
      const response = await AuthenticationApi.forgotPassword(request.email)
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
      const response = await AuthenticationApi.resetPassword({ token, newPassword, confirmPassword: newPassword })
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
      const response = await AuthenticationApi.refreshToken(token)
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
      const response = await AuthenticationApi.validateToken(token)
      const user = User.fromApiResponse(response)
      return {
        success: true,
        data: user.toJSON(),
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
      const response = await AuthenticationApi.changePassword({
        currentPassword,
        newPassword,
        confirmPassword: newPassword
      })
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
