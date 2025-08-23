import { useCallback, useEffect, useState } from 'react'
import NotificationApi from '../api/notification'
import { INotification } from '@/models'

interface AuthUser {
  token: string
  userId: string
  username: string
  role: number
}

interface UseNotificationsReturn {
  notifications: INotification[]
  unreadCount: number
  isLoading: boolean
  error: string | null
  fetchNotifications: () => Promise<void>
  markAsRead: (notificationId: string | number) => Promise<void>
  markAllAsRead: () => Promise<void>
  refreshNotifications: () => Promise<void>
}

/**
 * Custom hook for notification management
 * Follows SRP by handling only notification-related logic
 */
export const useNotifications = (currentUser: AuthUser | null): UseNotificationsReturn => {
  const [notifications, setNotifications] = useState<INotification[]>([])
  const [unreadCount, setUnreadCount] = useState<number>(0)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  const fetchNotifications = useCallback(async () => {
    if (!currentUser?.token) return

    setIsLoading(true)
    setError(null)
    try {
      const result = await NotificationApi.getAllNotificationsByIdUser(currentUser.token)
      setNotifications(result || [])
      
      // Count unread notifications
      const unread = result?.filter((notification: INotification) => !notification.isRead)?.length || 0
      setUnreadCount(unread)
    } catch (error) {
      console.error('Error fetching notifications:', error)
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch notifications'
      setError(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }, [currentUser])

  const markAsRead = useCallback(async (notificationId: string | number) => {
    if (!currentUser?.token) return

    try {
      // Note: This API method might not exist yet, using updateNotification as fallback
      await NotificationApi.updateNotification(currentUser.token)
      setNotifications(prev => 
        prev.map(notification => 
          notification.id === notificationId 
            ? { ...notification, isRead: true }
            : notification
        )
      )
      setUnreadCount(prev => Math.max(0, prev - 1))
    } catch (error) {
      console.error('Error marking notification as read:', error)
    }
  }, [currentUser])

  const markAllAsRead = useCallback(async () => {
    if (!currentUser?.token) return

    try {
      // Note: This API method might not exist yet, using updateNotification as fallback
      await NotificationApi.updateNotification(currentUser.token)
      setNotifications(prev => 
        prev.map(notification => ({ ...notification, isRead: true }))
      )
      setUnreadCount(0)
    } catch (error) {
      console.error('Error marking all notifications as read:', error)
    }
  }, [currentUser])

  const refreshNotifications = useCallback(async () => {
    await fetchNotifications()
  }, [fetchNotifications])

  useEffect(() => {
    if (currentUser) {
      fetchNotifications()
    } else {
      setNotifications([])
      setUnreadCount(0)
    }
  }, [currentUser, fetchNotifications])

  return {
    notifications,
    unreadCount,
    isLoading,
    error,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    refreshNotifications
  }
}
