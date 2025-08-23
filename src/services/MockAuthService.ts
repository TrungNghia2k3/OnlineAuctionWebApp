/**
 * Mock Authentication Service for UI Development
 * Simulates API responses without making actual HTTP requests
 */

import { IAuthService } from './interfaces/AuthServiceInterfaces'
import { BaseResponse } from '@/types'
import { 
  IUser, 
  ILoginCredentials, 
  IRegisterData, 
  IForgotPasswordRequest, 
  IAuthToken,
  UserStatus
} from '@/models'

export class MockAuthService implements IAuthService {
  private mockUsers = [
    {
      id: '1',
      username: 'admin',
      email: 'admin@auction.com',
      role: 2, // ADMIN
      roleString: 'ROLE_ADMIN',
      status: UserStatus.ACTIVE,
      emailVerified: true,
      phoneVerified: true,
      profileCompleteness: 100,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: '2', 
      username: 'user',
      email: 'user@auction.com',
      role: 1, // USER
      roleString: 'ROLE_USER',
      status: UserStatus.ACTIVE,
      emailVerified: true,
      phoneVerified: false,
      profileCompleteness: 75,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ]

  private generateMockToken(user: any): string {
    // Create a mock JWT-like token for development
    const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }))
    const payload = btoa(JSON.stringify({
      sub: user.username,
      scope: user.roleString,
      jti: user.id,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60) // 24 hours
    }))
    const signature = btoa('mock-signature')
    return `${header}.${payload}.${signature}`
  }

  async login(credentials: ILoginCredentials): Promise<BaseResponse<IAuthToken>> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500))

    const user = this.mockUsers.find(u => u.username === credentials.username)
    
    if (!user || credentials.password !== 'password') {
      return {
        success: false,
        error: 'Invalid username or password',
        data: undefined
      }
    }

    const token = this.generateMockToken(user)

    return {
      success: true,
      data: {
        accessToken: token,
        refreshToken: token,
        tokenType: 'Bearer',
        expiresIn: 86400,
        expiresAt: new Date(Date.now() + 86400 * 1000),
        scope: [user.roleString]
      },
      message: 'Login successful'
    }
  }

  async logout(): Promise<BaseResponse<void>> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 200))
    
    return {
      success: true,
      message: 'Logout successful'
    }
  }

  async register(userData: IRegisterData): Promise<BaseResponse<IUser>> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800))

    const newUser = {
      id: String(this.mockUsers.length + 1),
      username: userData.username,
      email: userData.email,
      role: 1, // USER
      roleString: 'ROLE_USER',
      status: UserStatus.ACTIVE,
      emailVerified: false,
      phoneVerified: false,
      profileCompleteness: 50,
      createdAt: new Date(),
      updatedAt: new Date()
    }

    this.mockUsers.push(newUser)

    return {
      success: true,
      data: newUser,
      message: 'Registration successful'
    }
  }

  async forgotPassword(request: IForgotPasswordRequest): Promise<BaseResponse<void>> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300))

    return {
      success: true,
      message: 'Password reset email sent'
    }
  }

  async resetPassword(token: string, newPassword: string): Promise<BaseResponse<void>> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 400))

    return {
      success: true,
      message: 'Password reset successful'
    }
  }

  async refreshToken(token: string): Promise<BaseResponse<IAuthToken>> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 200))

    // In a real implementation, you'd validate the refresh token
    const newToken = this.generateMockToken(this.mockUsers[0])

    return {
      success: true,
      data: {
        accessToken: newToken,
        refreshToken: newToken,
        tokenType: 'Bearer',
        expiresIn: 86400,
        expiresAt: new Date(Date.now() + 86400 * 1000),
        scope: ['ROLE_USER']
      },
      message: 'Token refreshed successfully'
    }
  }

  async validateToken(token: string): Promise<BaseResponse<IUser>> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 100))

    try {
      // Decode the mock token
      const parts = token.split('.')
      if (parts.length !== 3) {
        throw new Error('Invalid token format')
      }

      const payload = JSON.parse(atob(parts[1]))
      
      // Check if token is expired
      if (payload.exp * 1000 <= Date.now()) {
        return {
          success: false,
          error: 'Token has expired',
          data: undefined
        }
      }

      const user = this.mockUsers.find(u => u.username === payload.sub)
      if (!user) {
        return {
          success: false,
          error: 'User not found',
          data: undefined
        }
      }

      return {
        success: true,
        data: user,
        message: 'Token is valid'
      }
    } catch (error) {
      return {
        success: false,
        error: 'Invalid token',
        data: undefined
      }
    }
  }

  async changePassword(userId: string | number, currentPassword: string, newPassword: string): Promise<BaseResponse<void>> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500))

    return {
      success: true,
      message: 'Password changed successfully'
    }
  }
}
