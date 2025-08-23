/**
 * Service Interfaces
 * Contains all service abstractions and contracts
 */

import { BaseResponse } from '@/types'
import { 
  IUser, 
  ILoginCredentials, 
  IRegisterData,
  IAuthToken,
  ICategory,
  IAuctionItem,
  IAuctionSearch,
  INotification,
  INotificationPreferences
} from '@/models'

// =============================================================================
// Authentication Service Interfaces
// =============================================================================

export interface IForgotPasswordRequest {
  email: string
}

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

// =============================================================================
// Category Service Interfaces
// =============================================================================

export interface ICategoryService {
  getAll(): Promise<BaseResponse<ICategory[]>>
  getById(id: string | number): Promise<BaseResponse<ICategory>>
  getBySlug(slug: string): Promise<BaseResponse<ICategory>>
  getChildren(parentId: string | number): Promise<BaseResponse<ICategory[]>>
  create(category: Partial<ICategory>): Promise<BaseResponse<ICategory>>
  update(id: string | number, updates: Partial<ICategory>): Promise<BaseResponse<ICategory>>
  delete(id: string | number): Promise<BaseResponse<void>>
  search(query: string): Promise<BaseResponse<ICategory[]>>
}

// =============================================================================
// User Service Interfaces
// =============================================================================

export interface IUserService {
  getCurrentUser(): Promise<BaseResponse<IUser>>
  getUserById(id: string | number): Promise<BaseResponse<IUser>>
  updateProfile(userId: string | number, updates: Partial<IUser>): Promise<BaseResponse<IUser>>
  uploadAvatar(userId: string | number, file: File): Promise<BaseResponse<string>>
  getUsers(filters?: any): Promise<BaseResponse<IUser[]>>
  deleteUser(id: string | number): Promise<BaseResponse<void>>
  banUser(id: string | number, reason?: string): Promise<BaseResponse<void>>
  unbanUser(id: string | number): Promise<BaseResponse<void>>
}

// =============================================================================
// Auction Service Interfaces
// =============================================================================

export interface IAuctionService {
  getAll(filters?: IAuctionSearch): Promise<BaseResponse<IAuctionItem[]>>
  getById(id: string | number): Promise<BaseResponse<IAuctionItem>>
  create(auction: Partial<IAuctionItem>): Promise<BaseResponse<IAuctionItem>>
  update(id: string | number, updates: Partial<IAuctionItem>): Promise<BaseResponse<IAuctionItem>>
  delete(id: string | number): Promise<BaseResponse<void>>
  search(criteria: IAuctionSearch): Promise<BaseResponse<IAuctionItem[]>>
  getByCategory(categoryId: string | number): Promise<BaseResponse<IAuctionItem[]>>
  getFeatured(): Promise<BaseResponse<IAuctionItem[]>>
  getEnding(): Promise<BaseResponse<IAuctionItem[]>>
}

// =============================================================================
// Bid Service Interfaces
// =============================================================================

export interface IBid {
  id: string | number
  auctionId: string | number
  bidderId: string | number
  amount: number
  timestamp: Date
  isWinning: boolean
  status: string
}

export interface IBidHistory {
  auctionId: string | number
  bids: IBid[]
  totalBids: number
  highestBid?: IBid
  currentPrice: number
}

export interface IBidRequest {
  auctionId: string | number
  amount: number
  maxBid?: number
  timestamp?: Date
}

export interface IBidService {
  placeBid(bid: IBidRequest): Promise<BaseResponse<IBid>>
  getBidHistory(auctionId: string | number): Promise<BaseResponse<IBidHistory>>
  getUserBids(userId: string | number): Promise<BaseResponse<IBid[]>>
  getItemBids(itemId: string | number): Promise<BaseResponse<any>>
  cancelBid(bidId: string | number): Promise<BaseResponse<void>>
  getWinningBids(userId: string | number): Promise<BaseResponse<IBid[]>>
}

// =============================================================================
// Notification Service Interfaces
// =============================================================================

export interface INotificationService {
  getAll(userId: string | number): Promise<BaseResponse<INotification[]>>
  getUnread(userId: string | number): Promise<BaseResponse<INotification[]>>
  markAsRead(notificationId: string | number): Promise<BaseResponse<void>>
  markAllAsRead(userId: string | number): Promise<BaseResponse<void>>
  create(notification: Partial<INotification>): Promise<BaseResponse<INotification>>
  delete(notificationId: string | number): Promise<BaseResponse<void>>
  getPreferences(userId: string | number): Promise<BaseResponse<INotificationPreferences>>
  updatePreferences(userId: string | number, preferences: Partial<INotificationPreferences>): Promise<BaseResponse<INotificationPreferences>>
  subscribe(userId: string | number, type: string): Promise<BaseResponse<void>>
  unsubscribe(userId: string | number, type: string): Promise<BaseResponse<void>>
}

// =============================================================================
// File Service Interfaces
// =============================================================================

export interface IFileService {
  upload(file: File, folder?: string): Promise<BaseResponse<string>>
  uploadMultiple(files: File[], folder?: string): Promise<BaseResponse<string[]>>
  delete(fileUrl: string): Promise<BaseResponse<void>>
  getUploadUrl(fileName: string, folder?: string): Promise<BaseResponse<string>>
  validateFile(file: File): Promise<BaseResponse<boolean>>
}

// =============================================================================
// WebSocket Service Interfaces
// =============================================================================

export interface IWebSocketService {
  connect(): Promise<void>
  disconnect(): void
  subscribe(topic: string, callback: (message: any) => void): void
  unsubscribe(topic: string): void
  send(destination: string, message: any): void
  isConnected(): boolean
  getConnectionStatus(): 'connecting' | 'connected' | 'disconnected' | 'error'
}

// =============================================================================
// Shared Response Types
// =============================================================================

export interface IBidServiceResponse<T = any> {
  success: boolean
  data?: T
  message?: string
  error?: string
  timestamp?: Date
}

// =============================================================================
// Service Factory Interface
// =============================================================================

export interface IServiceFactory {
  createAuthService(): IAuthService
  createBidService(): IBidService
  createUserService(): IUserService
  createCategoryService(): ICategoryService
  createAuctionService(): IAuctionService
  createNotificationService(): INotificationService
  createFileService(): IFileService
  createWebSocketService(): IWebSocketService
}
