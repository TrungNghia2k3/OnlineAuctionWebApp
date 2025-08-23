/**
 * Notification and Notification-related interfaces and types
 */

import { BaseEntity } from '../types/common'
import { IUser } from './User'

export enum NotificationType {
  SYSTEM = 'SYSTEM',
  BID_UPDATE = 'BID_UPDATE',
  AUCTION_END = 'AUCTION_END',
  OUTBID = 'OUTBID',
  WIN = 'WIN',
  PAYMENT_REMINDER = 'PAYMENT_REMINDER',
  SHIPPING_UPDATE = 'SHIPPING_UPDATE',
  MESSAGE = 'MESSAGE',
  PROMOTION = 'PROMOTION'
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
  channel: NotificationChannel
  scheduledAt?: Date
  expiresAt?: Date
}

export interface INotificationPreferences extends BaseEntity {
  userId: string | number
  emailNotifications: boolean
  smsNotifications: boolean
  pushNotifications: boolean
  bidUpdates: boolean
  auctionReminders: boolean
  promotionalEmails: boolean
  newsletterSubscription: boolean
  channels: NotificationChannel[]
}

/**
 * Notification Class
 * Represents a user notification with rich content and metadata
 */
export class Notification implements INotification {
  public id: string | number
  public recipient: IUser
  public type: NotificationType
  public title: string
  public message: string
  public priority: NotificationPriority
  public isRead: boolean
  public isArchived: boolean
  public readAt?: Date
  public data?: Record<string, any>
  public actionUrl?: string
  public channel: NotificationChannel
  public scheduledAt?: Date
  public expiresAt?: Date
  public createdAt: Date
  public updatedAt: Date

  constructor(data: Partial<INotification>) {
    this.id = data.id || ''
    this.recipient = data.recipient as IUser
    this.type = data.type || NotificationType.SYSTEM
    this.title = data.title || ''
    this.message = data.message || ''
    this.priority = data.priority || NotificationPriority.NORMAL
    this.isRead = data.isRead || false
    this.isArchived = data.isArchived || false
    this.readAt = data.readAt
    this.data = data.data
    this.actionUrl = data.actionUrl
    this.channel = data.channel || NotificationChannel.IN_APP
    this.scheduledAt = data.scheduledAt
    this.expiresAt = data.expiresAt
    this.createdAt = data.createdAt || new Date()
    this.updatedAt = data.updatedAt || new Date()
  }

  /**
   * Factory method to create Notification from API response
   */
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
      channel: data.channel || NotificationChannel.IN_APP,
      scheduledAt: data.scheduledAt ? new Date(data.scheduledAt) : undefined,
      expiresAt: data.expiresAt ? new Date(data.expiresAt) : undefined,
      createdAt: data.createdAt ? new Date(data.createdAt) : new Date(),
      updatedAt: data.updatedAt ? new Date(data.updatedAt) : new Date()
    })
  }

  /**
   * Factory method to create multiple Notifications from API response array
   */
  static fromApiResponseArray(dataArray: any[]): Notification[] {
    return dataArray.map(data => Notification.fromApiResponse(data))
  }

  /**
   * Mark notification as read
   */
  markAsRead(): void {
    if (!this.isRead) {
      this.isRead = true
      this.readAt = new Date()
      this.updatedAt = new Date()
    }
  }

  /**
   * Mark notification as unread
   */
  markAsUnread(): void {
    if (this.isRead) {
      this.isRead = false
      this.readAt = undefined
      this.updatedAt = new Date()
    }
  }

  /**
   * Archive notification
   */
  archive(): void {
    if (!this.isArchived) {
      this.isArchived = true
      this.updatedAt = new Date()
    }
  }

  /**
   * Unarchive notification
   */
  unarchive(): void {
    if (this.isArchived) {
      this.isArchived = false
      this.updatedAt = new Date()
    }
  }

  /**
   * Check if notification is expired
   */
  isExpired(): boolean {
    if (!this.expiresAt) return false
    return new Date() > this.expiresAt
  }

  /**
   * Check if notification is scheduled for future
   */
  isScheduled(): boolean {
    if (!this.scheduledAt) return false
    return new Date() < this.scheduledAt
  }

  /**
   * Check if notification is high priority
   */
  isHighPriority(): boolean {
    return this.priority === NotificationPriority.HIGH || this.priority === NotificationPriority.URGENT
  }

  /**
   * Get formatted timestamp
   */
  getFormattedTimestamp(): string {
    return this.createdAt.toLocaleString()
  }

  /**
   * Get relative time (e.g., "2 hours ago")
   */
  getRelativeTime(): string {
    const now = new Date()
    const diff = now.getTime() - this.createdAt.getTime()
    
    const minutes = Math.floor(diff / (1000 * 60))
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    
    if (days > 0) {
      return `${days} day${days > 1 ? 's' : ''} ago`
    } else if (hours > 0) {
      return `${hours} hour${hours > 1 ? 's' : ''} ago`
    } else if (minutes > 0) {
      return `${minutes} minute${minutes > 1 ? 's' : ''} ago`
    } else {
      return 'Just now'
    }
  }

  /**
   * Convert to API format
   */
  toApiFormat(): Record<string, any> {
    return {
      id: this.id,
      recipient_id: this.recipient.id,
      type: this.type,
      title: this.title,
      message: this.message,
      priority: this.priority,
      is_read: this.isRead,
      is_archived: this.isArchived,
      read_at: this.readAt?.toISOString(),
      data: this.data,
      action_url: this.actionUrl,
      channel: this.channel,
      scheduled_at: this.scheduledAt?.toISOString(),
      expires_at: this.expiresAt?.toISOString(),
      created_at: this.createdAt.toISOString(),
      updated_at: this.updatedAt.toISOString()
    }
  }

  /**
   * Clone the notification
   */
  clone(): Notification {
    return new Notification(this)
  }
}
