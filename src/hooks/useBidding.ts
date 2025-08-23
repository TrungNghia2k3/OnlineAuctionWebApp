/**
 * Custom hook for real-time bidding functionality
 * Handles WebSocket connections and bid management for auction items
 */

import { useState, useEffect, useCallback, useRef } from 'react'
import { getWebSocketService } from '@/services/WebSocketService'
import { UseBiddingOptions, BiddingState, BidSubmission } from '@/models'
import { useAuth } from './useAuth'
import { BidUpdate, BidConfirmation } from '@/services/WebSocketService'

/**
 * Custom hook for real-time bidding on auction items
 */
export const useBidding = ({ itemId, autoConnect = true }: UseBiddingOptions) => {
  const { currentUser } = useAuth()
  const webSocketService = useRef(getWebSocketService())

  // Bidding state
  const [biddingState, setBiddingState] = useState<BiddingState>({
    currentPrice: 0,
    totalBids: 0,
    lastBid: null,
    bidHistory: [],
    isConnected: false,
    isLoading: true,
    error: null
  })

  // Bid submission state
  const [bidSubmission, setBidSubmission] = useState<BidSubmission>({
    isSubmitting: false,
    success: false,
    error: null
  })

  // Cleanup functions
  const unsubscribeFunctions = useRef<(() => void)[]>([])

  /**
   * Handle bid updates from WebSocket
   */
  const handleBidUpdate = useCallback((bidUpdate: BidUpdate) => {
    setBiddingState(prev => ({
      ...prev,
      currentPrice: bidUpdate.bidAmount,
      totalBids: bidUpdate.totalBids || prev.totalBids + 1, // Use provided value or increment
      lastBid: bidUpdate,
      bidHistory: [bidUpdate, ...prev.bidHistory.slice(0, 19)], // Keep last 20 bids
      error: null
    }))
  }, [])

  /**
   * Handle bid confirmation from WebSocket
   */
  const handleBidConfirmation = useCallback((confirmation: BidConfirmation) => {
    setBidSubmission(prev => ({
      ...prev,
      isSubmitting: false,
      success: confirmation.success,
      error: confirmation.success ? null : confirmation.error || 'Bid failed'
    }))

    // If bid was successful, clear success state after 3 seconds
    if (confirmation.success) {
      setTimeout(() => {
        setBidSubmission(prev => ({
          ...prev,
          success: false
        }))
      }, 3000)
    }
  }, [])

  /**
   * Handle connection status changes
   */
  const handleConnectionStatus = useCallback((connected: boolean) => {
    setBiddingState(prev => ({
      ...prev,
      isConnected: connected,
      isLoading: false,
      error: connected ? null : 'WebSocket disconnected'
    }))
  }, [])

  /**
   * Handle WebSocket errors
   */
  const handleError = useCallback((error: string) => {
    setBiddingState(prev => ({
      ...prev,
      error: error,
      isLoading: false
    }))
  }, [])

  /**
   * Connect to WebSocket and subscribe to bid updates
   */
  const connect = useCallback(async () => {
    try {
      setBiddingState(prev => ({ ...prev, isLoading: true, error: null }))

      // Set up callbacks
      webSocketService.current.onConnectionStatus(handleConnectionStatus)
      webSocketService.current.onError(handleError)

      // Connect to WebSocket
      await webSocketService.current.connect()

      // Subscribe to bid updates for this item
      const unsubscribeBidUpdates = webSocketService.current.subscribeToBidUpdates(
        itemId,
        handleBidUpdate
      )
      unsubscribeFunctions.current.push(unsubscribeBidUpdates)

      // Subscribe to bid confirmations
      const unsubscribeBidConfirmations = webSocketService.current.subscribeToBidConfirmations(
        handleBidConfirmation
      )
      unsubscribeFunctions.current.push(unsubscribeBidConfirmations)

    } catch (error) {
      console.error('Failed to connect to WebSocket:', error)
      setBiddingState(prev => ({
        ...prev,
        error: 'Failed to connect to real-time bidding service',
        isLoading: false
      }))
    }
  }, [itemId, handleBidUpdate, handleBidConfirmation, handleConnectionStatus, handleError])

  /**
   * Disconnect from WebSocket
   */
  const disconnect = useCallback(() => {
    // Unsubscribe from all topics
    unsubscribeFunctions.current.forEach(unsubscribe => unsubscribe())
    unsubscribeFunctions.current = []

    // Disconnect WebSocket
    webSocketService.current.disconnect()

    setBiddingState(prev => ({
      ...prev,
      isConnected: false,
      isLoading: false
    }))
  }, [])

  /**
   * Place a bid on the item
   */
  const placeBid = useCallback(async (amount: number): Promise<boolean> => {
    if (!currentUser) {
      setBidSubmission(prev => ({
        ...prev,
        error: 'You must be logged in to place a bid'
      }))
      return false
    }

    if (!biddingState.isConnected) {
      setBidSubmission(prev => ({
        ...prev,
        error: 'Real-time bidding service is not connected'
      }))
      return false
    }

    try {
      setBidSubmission({
        isSubmitting: true,
        success: false,
        error: null
      })

      // Send bid through WebSocket (with REST API fallback)
      // Extract userId from JWT token - this is the correct buyerId for the backend
      const buyerId = (currentUser as any)?.userId || (currentUser as any)?.id || (currentUser as any)?.username
      console.log('Placing bid with buyerId:', buyerId, 'from currentUser:', currentUser)
      const success = await webSocketService.current.placeBid(itemId, amount, buyerId)

      if (!success) {
        setBidSubmission({
          isSubmitting: false,
          success: false,
          error: 'Failed to place bid'
        })
        return false
      }

      // The result will be handled by handleBidConfirmation
      return true

    } catch (error) {
      console.error('Error placing bid:', error)
      setBidSubmission({
        isSubmitting: false,
        success: false,
        error: 'Failed to place bid'
      })
      return false
    }
  }, [currentUser, biddingState.isConnected, itemId])

  /**
   * Update current price (for initial load or manual updates)
   */
  const updateCurrentPrice = useCallback((price: number, totalBids: number = 0) => {
    setBiddingState(prev => ({
      ...prev,
      currentPrice: price,
      totalBids: totalBids
    }))
  }, [])

  /**
   * Clear bid submission state
   */
  const clearBidSubmission = useCallback(() => {
    setBidSubmission({
      isSubmitting: false,
      success: false,
      error: null
    })
  }, [])

  /**
   * Retry connection
   */
  const retry = useCallback(() => {
    disconnect()
    connect()
  }, [connect, disconnect])

  // Auto-connect on mount if enabled
  useEffect(() => {
    if (autoConnect && currentUser) {
      connect()
    }

    // Cleanup on unmount
    return () => {
      disconnect()
    }
  }, [autoConnect, currentUser, connect, disconnect])

  // Reconnect when user logs in
  useEffect(() => {
    if (currentUser && !biddingState.isConnected && !biddingState.isLoading) {
      connect()
    }
  }, [currentUser, biddingState.isConnected, biddingState.isLoading, connect])

  return {
    // State
    ...biddingState,
    bidSubmission,

    // Actions
    connect,
    disconnect,
    placeBid,
    updateCurrentPrice,
    clearBidSubmission,
    retry,

    // Computed values
    canBid: !!(currentUser && biddingState.isConnected && !bidSubmission.isSubmitting),
    isAuthenticated: !!currentUser
  }
}
