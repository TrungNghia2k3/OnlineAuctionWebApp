/**
 * Service Layer Interfaces (TypeScript)
 * Follows DIP by providing abstractions for services
 */

import { 
  BaseResponse, 
  PaginatedResponse, 
  QueryOptions 
} from '../types'
import { 
  IUser, 
  ILoginCredentials, 
  IRegisterData, 
  IForgotPasswordRequest, 
  IAuthToken 
} from '../models'
import { 
  ICategory, 
  ICategoryCreateRequest, 
  ICategoryUpdateRequest 
} from '../models'
import { 
  IAuctionItem, 
  IBid, 
  IAuctionCreateRequest, 
  IBidRequest, 
  IAuctionSearch 
} from '../models'
import { 
  INotification, 
  INotificationCreateRequest, 
  INotificationPreferences 
} from '../models'

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

export interface ICategoryService {
  getAllCategories(options?: QueryOptions): Promise<PaginatedResponse<ICategory>>
  getCategoryById(id: string | number): Promise<BaseResponse<ICategory>>
  getCategoryTree(): Promise<BaseResponse<ICategory[]>>
  createCategory(categoryData: ICategoryCreateRequest): Promise<BaseResponse<ICategory>>
  updateCategory(id: string | number, categoryData: ICategoryUpdateRequest): Promise<BaseResponse<ICategory>>
  deleteCategory(id: string | number): Promise<BaseResponse<void>>
  getCategoryBreadcrumbs(id: string | number): Promise<BaseResponse<ICategory[]>>
}

export interface IAuctionService {
  getAllAuctions(options?: QueryOptions): Promise<PaginatedResponse<IAuctionItem>>
  getAuctionById(id: string | number): Promise<BaseResponse<IAuctionItem>>
  searchAuctions(searchParams: IAuctionSearch, options?: QueryOptions): Promise<PaginatedResponse<IAuctionItem>>
  createAuction(auctionData: IAuctionCreateRequest): Promise<BaseResponse<IAuctionItem>>
  updateAuction(id: string | number, auctionData: Partial<IAuctionCreateRequest>): Promise<BaseResponse<IAuctionItem>>
  deleteAuction(id: string | number): Promise<BaseResponse<void>>
  getAuctionsByUser(userId: string | number, options?: QueryOptions): Promise<PaginatedResponse<IAuctionItem>>
  getWatchedAuctions(userId: string | number, options?: QueryOptions): Promise<PaginatedResponse<IAuctionItem>>
  addToWatchlist(userId: string | number, auctionId: string | number): Promise<BaseResponse<void>>
  removeFromWatchlist(userId: string | number, auctionId: string | number): Promise<BaseResponse<void>>
}

export interface IBidService {
  placeBid(bidData: IBidRequest): Promise<BaseResponse<IBid>>
  getBidsByAuction(auctionId: string | number, options?: QueryOptions): Promise<PaginatedResponse<IBid>>
  getBidsByUser(userId: string | number, options?: QueryOptions): Promise<PaginatedResponse<IBid>>
  getWinningBids(userId: string | number, options?: QueryOptions): Promise<PaginatedResponse<IBid>>
  cancelBid(bidId: string | number): Promise<BaseResponse<void>>
  getMaxBid(auctionId: string | number, userId: string | number): Promise<BaseResponse<IBid>>
}

export interface INotificationService {
  getNotifications(userId: string | number, options?: QueryOptions): Promise<PaginatedResponse<INotification>>
  markAsRead(notificationId: string | number): Promise<BaseResponse<void>>
  markAllAsRead(userId: string | number): Promise<BaseResponse<void>>
  createNotification(notificationData: INotificationCreateRequest): Promise<BaseResponse<INotification>>
  deleteNotification(notificationId: string | number): Promise<BaseResponse<void>>
  getUnreadCount(userId: string | number): Promise<BaseResponse<number>>
  getNotificationPreferences(userId: string | number): Promise<BaseResponse<INotificationPreferences>>
  updateNotificationPreferences(userId: string | number, preferences: Partial<INotificationPreferences>): Promise<BaseResponse<INotificationPreferences>>
}

export interface IUserService {
  getUserById(id: string | number): Promise<BaseResponse<IUser>>
  updateUserProfile(id: string | number, userData: Partial<IUser>): Promise<BaseResponse<IUser>>
  uploadAvatar(id: string | number, file: File): Promise<BaseResponse<string>>
  deleteUser(id: string | number): Promise<BaseResponse<void>>
  getAllUsers(options?: QueryOptions): Promise<PaginatedResponse<IUser>>
  searchUsers(query: string, options?: QueryOptions): Promise<PaginatedResponse<IUser>>
  getUserStats(id: string | number): Promise<BaseResponse<any>>
}

export interface IFileService {
  uploadFile(file: File, folder?: string): Promise<BaseResponse<string>>
  uploadFiles(files: File[], folder?: string): Promise<BaseResponse<string[]>>
  deleteFile(url: string): Promise<BaseResponse<void>>
  getFileInfo(url: string): Promise<BaseResponse<any>>
}

export interface IWebSocketService {
  connect(): Promise<void>
  disconnect(): void
  subscribeToBidUpdates(itemId: string | number, callback: (bidUpdate: any) => void): () => void
  subscribeToBidConfirmations(callback: (confirmation: any) => void): () => void
  placeBid(itemId: string | number, bidAmount: number): void
  onConnectionStatus(callback: (connected: boolean) => void): void
  onError(callback: (error: string) => void): void
  getConnectionStatus(): boolean
}
