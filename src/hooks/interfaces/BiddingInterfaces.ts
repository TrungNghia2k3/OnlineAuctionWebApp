/**
 * Bidding Hook Interfaces
 * Contains all interfaces for the bidding hook
 */

import { BidUpdate } from '@/services/interfaces/WebSocketInterfaces'

export interface UseBiddingOptions {
  itemId: string | number
  autoConnect?: boolean
}

export interface BiddingState {
  currentPrice: number
  totalBids: number
  lastBid: BidUpdate | null
  bidHistory: BidUpdate[]
  isConnected: boolean
  isLoading: boolean
  error: string | null
}

export interface BidSubmission {
  isSubmitting: boolean
  success: boolean
  error: string | null
}
