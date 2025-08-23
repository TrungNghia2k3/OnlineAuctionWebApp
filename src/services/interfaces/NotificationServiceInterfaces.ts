/**
 * Notification Service Interfaces
 * Contains all notification-related service abstractions
 */

import { BaseResponse, PaginatedResponse, QueryOptions } from '@/types'
import { 
  INotification, 
  INotificationCreateRequest, 
  INotificationPreferences 
} from '@/models'

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
