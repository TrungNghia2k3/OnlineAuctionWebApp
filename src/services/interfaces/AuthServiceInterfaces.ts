/**
 * Authentication Service Interfaces
 * Contains all authentication-related service abstractions
 */

import { BaseResponse } from '@/types'
import { 
  IUser, 
  ILoginCredentials, 
  IRegisterData, 
  IForgotPasswordRequest, 
  IAuthToken 
} from '@/models'

export interface IAuthService {
  login(credentials: ILoginCredentials): Promise<BaseResponse<IAuthToken>>
  logout(): Promise<BaseResponse<void>>
  register(userData: IRegisterData): Promise<BaseResponse<IUser>>
  forgotPassword(request: IForgotPasswordRequest): Promise<BaseResponse<void>>
  resetPassword(token: string, newPassword: string): Promise<BaseResponse<void>>
  refreshToken(token: string): Promise<BaseResponse<IAuthToken>>
  validateToken(token: string): Promise<BaseResponse<IUser>>
  changePassword(userId: string | number, currentPassword: string, newPassword: string): Promise<BaseResponse<void>>
}
