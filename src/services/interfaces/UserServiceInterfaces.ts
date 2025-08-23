/**
 * User Service Interfaces
 * Contains all user-related service abstractions
 */

import { BaseResponse, PaginatedResponse, QueryOptions } from '@/types'
import { IUser } from '@/models'

export interface IUserService {
  getUserById(id: string | number): Promise<BaseResponse<IUser>>
  updateUserProfile(id: string | number, userData: Partial<IUser>): Promise<BaseResponse<IUser>>
  uploadAvatar(id: string | number, file: File): Promise<BaseResponse<string>>
  deleteUser(id: string | number): Promise<BaseResponse<void>>
  getAllUsers(options?: QueryOptions): Promise<PaginatedResponse<IUser>>
  searchUsers(query: string, options?: QueryOptions): Promise<PaginatedResponse<IUser>>
  getUserStats(id: string | number): Promise<BaseResponse<any>>
}
