/**
 * Hook for managing bid history logic
 * Handles history filtering, user identification, and timestamp formatting
 */

import { useMemo } from 'react'
import { BidUpdate } from '@/services/WebSocketService'

interface UseBidHistoryProps {
  bidHistory: BidUpdate[]
  currentUserId?: string | number
  maxItems?: number
}

interface UseBidHistoryReturn {
  displayedBids: BidUpdate[]
  totalBids: number
  currentHighBid: number
  uniqueBidders: number
  formatTimestamp: (timestamp?: Date) => string
  isCurrentUserBid: (bidder: { id: string | number } | undefined) => boolean
}

export const useBidHistory = ({
  bidHistory,
  currentUserId,
  maxItems = 10
}: UseBidHistoryProps): UseBidHistoryReturn => {
  
  const displayedBids = useMemo(() => {
    return bidHistory.slice(0, maxItems)
  }, [bidHistory, maxItems])

  /**
   * Format timestamp for display
   */
  const formatTimestamp = (timestamp?: Date): string => {
    if (!timestamp) {
      return 'Just now'
    }
    
    const now = new Date()
    const diff = now.getTime() - timestamp.getTime()
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)

    if (days > 0) {
      return `${days}d ago`
    } else if (hours > 0) {
      return `${hours}h ago`
    } else if (minutes > 0) {
      return `${minutes}m ago`
    } else {
      return 'Just now'
    }
  }

  /**
   * Check if bid is from current user
   */
  const isCurrentUserBid = (bidder: { id: string | number } | undefined): boolean => {
    if (!bidder || currentUserId === undefined) {
      return false
    }
    return bidder.id.toString() === currentUserId.toString()
  }

  // Calculate statistics
  const totalBids = bidHistory.length
  const currentHighBid = displayedBids[0]?.bidAmount || 0
  const uniqueBidders = useMemo(() => {
    return new Set(bidHistory.map(bid => bid.bidder?.id).filter(id => id !== undefined)).size
  }, [bidHistory])

  return {
    displayedBids,
    totalBids,
    currentHighBid,
    uniqueBidders,
    formatTimestamp,
    isCurrentUserBid
  }
}
