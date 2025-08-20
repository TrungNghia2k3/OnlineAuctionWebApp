/**
 * Notification-related interfaces and types
 */

import { BaseEntity } from '@/types'
import { IUser } from './User'

export enum NotificationType {
  BID_PLACED = 'BID_PLACED',
  BID_OUTBID = 'BID_OUTBID',
  AUCTION_WON = 'AUCTION_WON',
  AUCTION_LOST = 'AUCTION_LOST',
  AUCTION_ENDING_SOON = 'AUCTION_ENDING_SOON',
  AUCTION_STARTED = 'AUCTION_STARTED',
  AUCTION_CANCELLED = 'AUCTION_CANCELLED',
  PAYMENT_REQUIRED = 'PAYMENT_REQUIRED',
  PAYMENT_RECEIVED = 'PAYMENT_RECEIVED',
  ITEM_SHIPPED = 'ITEM_SHIPPED',
  ITEM_DELIVERED = 'ITEM_DELIVERED',
  FEEDBACK_REQUEST = 'FEEDBACK_REQUEST',
  SYSTEM_ANNOUNCEMENT = 'SYSTEM_ANNOUNCEMENT',
  ACCOUNT_UPDATE = 'ACCOUNT_UPDATE'
}

export enum NotificationPriority {
  LOW = 'LOW',
  NORMAL = 'NORMAL',
  HIGH = 'HIGH',
  URGENT = 'URGENT'
}

export enum NotificationChannel {
  IN_APP = 'IN_APP',
  EMAIL = 'EMAIL',
  SMS = 'SMS',
  PUSH = 'PUSH'
}

export interface INotification extends BaseEntity {
  recipient: IUser
  type: NotificationType
  title: string
  message: string
  priority: NotificationPriority
  isRead: boolean
  isArchived: boolean
  readAt?: Date
  data?: Record<string, any>
  actionUrl?: string
  actionText?: string
  expiresAt?: Date
  channels: NotificationChannel[]
}

export interface INotificationPreferences {
  userId: string | number
  emailNotifications: boolean
  smsNotifications: boolean
  pushNotifications: boolean
  preferences: {
    [key in NotificationType]?: {
      enabled: boolean
      channels: NotificationChannel[]
    }
  }
}

export interface INotificationCreateRequest {
  recipientId: string | number
  type: NotificationType
  title: string
  message: string
  priority?: NotificationPriority
  data?: Record<string, any>
  actionUrl?: string
  actionText?: string
  expiresAt?: Date
  channels?: NotificationChannel[]
}

/**
 * Notification model class with methods
 */
export class Notification implements INotification {
  id: string | number
  recipient: IUser
  type: NotificationType
  title: string
  message: string
  priority: NotificationPriority
  isRead: boolean
  isArchived: boolean
  readAt?: Date
  data?: Record<string, any>
  actionUrl?: string
  actionText?: string
  expiresAt?: Date
  channels: NotificationChannel[]
  createdAt: Date
  updatedAt: Date

  constructor(notificationData: Partial<INotification> & { recipient: IUser }) {
    this.id = notificationData.id || ''
    this.recipient = notificationData.recipient
    this.type = notificationData.type || NotificationType.SYSTEM_ANNOUNCEMENT
    this.title = notificationData.title || ''
    this.message = notificationData.message || ''
    this.priority = notificationData.priority || NotificationPriority.NORMAL
    this.isRead = notificationData.isRead || false
    this.isArchived = notificationData.isArchived || false
    this.readAt = notificationData.readAt
    this.data = notificationData.data
    this.actionUrl = notificationData.actionUrl
    this.actionText = notificationData.actionText
    this.expiresAt = notificationData.expiresAt
    this.channels = notificationData.channels || [NotificationChannel.IN_APP]
    this.createdAt = notificationData.createdAt || new Date()
    this.updatedAt = notificationData.updatedAt || new Date()
  }

  markAsRead(): void {
    this.isRead = true
    this.readAt = new Date()
    this.updatedAt = new Date()
  }

  archive(): void {
    this.isArchived = true
    this.updatedAt = new Date()
  }

  unarchive(): void {
    this.isArchived = false
    this.updatedAt = new Date()
  }

  isExpired(): boolean {
    return this.expiresAt ? new Date() > this.expiresAt : false
  }

  isHighPriority(): boolean {
    return this.priority === NotificationPriority.HIGH || 
           this.priority === NotificationPriority.URGENT
  }

  hasAction(): boolean {
    return !!this.actionUrl && !!this.actionText
  }

  getDisplayTime(): string {
    const now = new Date()
    const created = this.createdAt
    const diffInMs = now.getTime() - created.getTime()
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60))
    const diffInHours = Math.floor(diffInMinutes / 60)
    const diffInDays = Math.floor(diffInHours / 24)

    if (diffInMinutes < 1) return 'Just now'
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`
    if (diffInHours < 24) return `${diffInHours}h ago`
    if (diffInDays < 7) return `${diffInDays}d ago`
    
    return created.toLocaleDateString()
  }

  getTypeIcon(): string {
    const iconMap: Record<NotificationType, string> = {
      [NotificationType.BID_PLACED]: 'bi-hammer',
      [NotificationType.BID_OUTBID]: 'bi-exclamation-triangle',
      [NotificationType.AUCTION_WON]: 'bi-trophy',
      [NotificationType.AUCTION_LOST]: 'bi-x-circle',
      [NotificationType.AUCTION_ENDING_SOON]: 'bi-clock',
      [NotificationType.AUCTION_STARTED]: 'bi-play-circle',
      [NotificationType.AUCTION_CANCELLED]: 'bi-x-octagon',
      [NotificationType.PAYMENT_REQUIRED]: 'bi-credit-card',
      [NotificationType.PAYMENT_RECEIVED]: 'bi-check-circle',
      [NotificationType.ITEM_SHIPPED]: 'bi-truck',
      [NotificationType.ITEM_DELIVERED]: 'bi-box-seam',
      [NotificationType.FEEDBACK_REQUEST]: 'bi-star',
      [NotificationType.SYSTEM_ANNOUNCEMENT]: 'bi-megaphone',
      [NotificationType.ACCOUNT_UPDATE]: 'bi-person-gear'
    }

    return iconMap[this.type] || 'bi-bell'
  }

  getTypeColor(): string {
    const colorMap: Record<NotificationType, string> = {
      [NotificationType.BID_PLACED]: 'primary',
      [NotificationType.BID_OUTBID]: 'warning',
      [NotificationType.AUCTION_WON]: 'success',
      [NotificationType.AUCTION_LOST]: 'danger',
      [NotificationType.AUCTION_ENDING_SOON]: 'warning',
      [NotificationType.AUCTION_STARTED]: 'info',
      [NotificationType.AUCTION_CANCELLED]: 'danger',
      [NotificationType.PAYMENT_REQUIRED]: 'warning',
      [NotificationType.PAYMENT_RECEIVED]: 'success',
      [NotificationType.ITEM_SHIPPED]: 'info',
      [NotificationType.ITEM_DELIVERED]: 'success',
      [NotificationType.FEEDBACK_REQUEST]: 'info',
      [NotificationType.SYSTEM_ANNOUNCEMENT]: 'primary',
      [NotificationType.ACCOUNT_UPDATE]: 'secondary'
    }

    return colorMap[this.type] || 'secondary'
  }

  toJSON(): INotification {
    return {
      id: this.id,
      recipient: this.recipient,
      type: this.type,
      title: this.title,
      message: this.message,
      priority: this.priority,
      isRead: this.isRead,
      isArchived: this.isArchived,
      readAt: this.readAt,
      data: this.data,
      actionUrl: this.actionUrl,
      actionText: this.actionText,
      expiresAt: this.expiresAt,
      channels: this.channels,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    }
  }

  static fromApiResponse(data: any): Notification {
    return new Notification({
      id: data.id,
      recipient: data.recipient,
      type: data.type,
      title: data.title,
      message: data.message,
      priority: data.priority || NotificationPriority.NORMAL,
      isRead: data.isRead || data.is_read || false,
      isArchived: data.isArchived || data.is_archived || false,
      readAt: data.readAt ? new Date(data.readAt) : undefined,
      data: data.data,
      actionUrl: data.actionUrl || data.action_url,
      actionText: data.actionText || data.action_text,
      expiresAt: data.expiresAt ? new Date(data.expiresAt) : undefined,
      channels: data.channels || [NotificationChannel.IN_APP],
      createdAt: data.createdAt ? new Date(data.createdAt) : new Date(),
      updatedAt: data.updatedAt ? new Date(data.updatedAt) : new Date()
    })
  }
}
