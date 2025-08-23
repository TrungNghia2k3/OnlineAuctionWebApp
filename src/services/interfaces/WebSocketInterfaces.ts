/**
 * WebSocket Service Interfaces
 * Contains all WebSocket-related types and interfaces
 */

import { IBid } from '@/models/Auction'

export interface BidUpdate {
  itemId: string | number
  bidAmount: number
  buyerId: string | number
  timestamp?: Date
  bidder?: {
    id: string | number
    username: string
  }
  isWinning?: boolean
  totalBids?: number
}

export interface BidConfirmation {
  success: boolean
  message: string
  bid?: IBid
  error?: string
}

export type BidUpdateCallback = (bidUpdate: BidUpdate) => void
export type BidConfirmationCallback = (confirmation: BidConfirmation) => void
export type ConnectionStatusCallback = (connected: boolean) => void
export type ErrorCallback = (error: string) => void
