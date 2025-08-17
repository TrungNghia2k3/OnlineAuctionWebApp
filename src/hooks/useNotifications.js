import { useCallback, useEffect, useState } from 'react'
import NotificationApi from '../api/notification'

/**
 * Custom hook for notification management
 * Follows SRP by handling only notification-related logic
 */
export const useNotifications = (currentUser) => {
  const [notifications, setNotifications] = useState([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  const fetchNotifications = useCallback(async () => {
    if (!currentUser?.token) return

    setIsLoading(true)
    setError(null)
    try {
      const result = await NotificationApi.getAllNotificationsByIdUser(currentUser.token)
      setNotifications(result || [])
      
      // Count unread notifications
      const unread = result?.filter(notification => !notification.isRead)?.length || 0
      setUnreadCount(unread)
    } catch (error) {
      console.error('Error fetching notifications:', error)
      setError(error.message || 'Failed to fetch notifications')
    } finally {
      setIsLoading(false)
    }
  }, [currentUser])

  const markAsRead = useCallback(async (notificationId) => {
    if (!currentUser?.token) return

    try {
      await NotificationApi.markAsRead(notificationId, currentUser.token)
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
      await NotificationApi.markAllAsRead(currentUser.token)
      setNotifications(prev => 
        prev.map(notification => ({ ...notification, isRead: true }))
      )
      setUnreadCount(0)
    } catch (error) {
      console.error('Error marking all notifications as read:', error)
    }
  }, [currentUser])

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
    markAllAsRead
  }
}
