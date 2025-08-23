/**
 * WebSocket Service for Real-time Bidding
 * Handles STOMP WebSocket connections for auction bidding
 */

import { AuthUtils } from '@/utils/AuthUtils'
import { Client, IStompSocket } from '@stomp/stompjs'
import BidService from './BidService'
import { IWebSocketService } from './interfaces'

// Define missing callback types
export type ConnectionStatusCallback = (connected: boolean) => void
export type ErrorCallback = (error: string) => void
export interface BidUpdate {
  itemId: string | number
  bidAmount: number
  buyerId: string | number
  bidder: {
    id: string | number
    username: string
  }
  timestamp: Date
  isWinning: boolean
  totalBids: number
}

export type BidConfirmationCallback = (confirmation: BidConfirmation) => void

export interface BidConfirmation {
  success: boolean
  message: string
  error?: string
  bid?: any
}
export type BidUpdateCallback = (bidUpdate: BidUpdate) => void

// Import SockJS using require to avoid TypeScript module resolution issues
// This is a common pattern with SockJS client library
const SockJS = require('sockjs-client')

/**
 * WebSocket Service for real-time auction bidding
 */
export class WebSocketService implements IWebSocketService {
  private client: Client | null = null
  private connected: boolean = false
  private connectionStatus: 'connecting' | 'connected' | 'disconnected' | 'error' = 'disconnected'
  private subscriptions: Map<string, any> = new Map()
  private genericSubscriptions: Map<string, (message: any) => void> = new Map()
  private bidUpdateCallbacks: Map<string, BidUpdateCallback[]> = new Map()
  private bidConfirmationCallback: BidConfirmationCallback | null = null
  private connectionStatusCallback: ConnectionStatusCallback | null = null
  private errorCallback: ErrorCallback | null = null

  private readonly WS_ENDPOINT = 'http://localhost:8080/api/v1/ws'
  private readonly RECONNECT_DELAY = 3000
  private reconnectAttempts = 0
  private maxReconnectAttempts = 5

  constructor() {
    this.setupClient()
  }

  /**
   * Set up STOMP client with authentication
   */
  private setupClient(): void {
    const token = AuthUtils.getToken()

    this.client = new Client({
      webSocketFactory: () => new SockJS(this.WS_ENDPOINT) as IStompSocket,
      connectHeaders: {
        Authorization: `Bearer ${token}`
      },
      debug: (str: string) => {
        console.log('STOMP Debug:', str)
      },
      reconnectDelay: this.RECONNECT_DELAY,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
      onConnect: this.onConnect.bind(this),
      onDisconnect: this.onDisconnect.bind(this),
      onStompError: this.onStompError.bind(this),
      onWebSocketError: this.onWebSocketError.bind(this)
    })
  }

  // =============================================================================
  // IWebSocketService Interface Implementation
  // =============================================================================

  /**
   * Connect to WebSocket
   */
  public async connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.connected) {
        resolve()
        return
      }

      const token = AuthUtils.getToken()
      if (!token) {
        const error = 'No authentication token available'
        this.handleError(error)
        reject(new Error(error))
        return
      }

      this.connectionStatus = 'connecting'

      // Set up one-time connection handlers
      if (this.client) {
        this.client.onConnect = () => {
          this.onConnect()
          resolve()
        }

        this.client.onStompError = (frame: any) => {
          this.onStompError(frame)
          reject(new Error(`Connection failed: ${frame.headers?.message || 'Unknown error'}`))
        }

        this.client.onWebSocketError = (error: any) => {
          this.onWebSocketError(error)
          reject(new Error('WebSocket connection error'))
        }

        this.client.activate()
      } else {
        reject(new Error('Client not initialized'))
      }
    })
  }

  /**
   * Disconnect from WebSocket
   */
  public disconnect(): void {
    if (this.client && this.connected) {
      this.client.deactivate()
      this.connected = false
      this.connectionStatus = 'disconnected'
      this.subscriptions.clear()
      this.genericSubscriptions.clear()
    }
  }

  /**
   * Generic subscribe method for IWebSocketService interface
   */
  public subscribe(topic: string, callback: (message: any) => void): void {
    if (!this.client || !this.connected) {
      console.warn('Cannot subscribe: WebSocket not connected')
      return
    }

    if (!this.subscriptions.has(topic)) {
      const subscription = this.client.subscribe(topic, (message: any) => {
        try {
          const data = JSON.parse(message.body)
          callback(data)
        } catch (error) {
          console.error('Error parsing message:', error)
          callback(message.body)
        }
      })
      this.subscriptions.set(topic, subscription)
    }

    this.genericSubscriptions.set(topic, callback)
  }

  /**
   * Generic unsubscribe method for IWebSocketService interface
   */
  public unsubscribe(topic: string): void {
    const subscription = this.subscriptions.get(topic)
    if (subscription) {
      subscription.unsubscribe()
      this.subscriptions.delete(topic)
      this.genericSubscriptions.delete(topic)
    }
  }

  /**
   * Generic send method for IWebSocketService interface
   */
  public send(destination: string, message: any): void {
    if (!this.client || !this.connected) {
      console.warn('Cannot send message: WebSocket not connected')
      return
    }

    this.client.publish({
      destination,
      body: JSON.stringify(message)
    })
  }

  /**
   * Check if WebSocket is connected
   */
  public isConnected(): boolean {
    return this.connected
  }

  /**
   * Get connection status
   */
  public getConnectionStatus(): 'connecting' | 'connected' | 'disconnected' | 'error' {
    return this.connectionStatus
  }

  // =============================================================================
  // Bidding-Specific Methods (Legacy Support)
  // =============================================================================

  /**
   * Subscribe to bid updates for a specific item
   */
  public subscribeToBidUpdates(itemId: string | number, callback: BidUpdateCallback): () => void {
    const topic = `/topic/items/${itemId}/bids`

    if (!this.bidUpdateCallbacks.has(topic)) {
      this.bidUpdateCallbacks.set(topic, [])
    }

    this.bidUpdateCallbacks.get(topic)!.push(callback)

    // Subscribe to the topic if not already subscribed
    if (!this.subscriptions.has(topic) && this.client && this.connected) {
      const subscription = this.client.subscribe(topic, (message: any) => {
        try {
          const rawData = JSON.parse(message.body)

          let bidUpdate: BidUpdate

          if (rawData && typeof rawData === 'object' && rawData.itemId) {
            // Handle the simplified BidUpdateResponse from Java backend
            bidUpdate = {
              itemId: rawData.itemId,
              bidAmount: rawData.bidAmount,
              buyerId: rawData.buyerId,
              timestamp: new Date(),
              bidder: {
                id: rawData.buyerId,
                username: `User ${rawData.buyerId.toString().slice(0, 8)}`
              },
              isWinning: true,
              totalBids: 1
            }
          } else {
            // Create a mock BidUpdate object for plain string responses
            bidUpdate = {
              itemId: itemId,
              bidAmount: 0,
              buyerId: 'unknown',
              timestamp: new Date(),
              bidder: {
                id: 'unknown',
                username: 'Unknown User'
              },
              isWinning: false,
              totalBids: 1
            }

            console.log('Created mock bid update for plain string response:', bidUpdate)
          }

          const callbacks = this.bidUpdateCallbacks.get(topic) || []
          callbacks.forEach(cb => cb(bidUpdate))
        } catch (error) {
          console.error('Error parsing bid update:', error)
          this.handleError('Failed to parse bid update')
        }
      })

      this.subscriptions.set(topic, subscription)

      // Also subscribe to user-specific confirmation queue
      const confirmationTopic = '/user/queue/bid/confirmation'
      if (!this.subscriptions.has(confirmationTopic)) {
        const confirmationSubscription = this.client.subscribe(confirmationTopic, (message: any) => {
          try {
            console.log('Received bid confirmation:', message.body)
            // Handle confirmation message from your Java controller
          } catch (error) {
            console.error('Error handling bid confirmation:', error)
          }
        })
        this.subscriptions.set(confirmationTopic, confirmationSubscription)
      }
    }

    // Return unsubscribe function
    return () => {
      const callbacks = this.bidUpdateCallbacks.get(topic) || []
      const index = callbacks.indexOf(callback)
      if (index > -1) {
        callbacks.splice(index, 1)
      }

      // If no more callbacks for this topic, unsubscribe
      if (callbacks.length === 0) {
        const subscription = this.subscriptions.get(topic)
        if (subscription) {
          subscription.unsubscribe()
          this.subscriptions.delete(topic)
          this.bidUpdateCallbacks.delete(topic)
        }
      }
    }
  }

  /**
   * Subscribe to bid confirmations
   */
  public subscribeToBidConfirmations(callback: BidConfirmationCallback): () => void {
    this.bidConfirmationCallback = callback

    const topic = '/user/queue/bid/confirmation'

    if (!this.subscriptions.has(topic) && this.client && this.connected) {
      const subscription = this.client.subscribe(topic, (message: any) => {
        try {
          const confirmation: BidConfirmation = JSON.parse(message.body)

          if (this.bidConfirmationCallback) {
            this.bidConfirmationCallback(confirmation)
          }
        } catch (error) {
          console.error('Error parsing bid confirmation:', error)
          this.handleError('Failed to parse bid confirmation')
        }
      })

      this.subscriptions.set(topic, subscription)
    }

    // Return unsubscribe function
    return () => {
      this.bidConfirmationCallback = null
      const subscription = this.subscriptions.get(topic)
      if (subscription) {
        subscription.unsubscribe()
        this.subscriptions.delete(topic)
      }
    }
  }

  /**
   * Place a bid on an item
   * Falls back to REST API if WebSocket is not connected
   */
  public async placeBid(itemId: string | number, bidAmount: number, buyerId?: string | number): Promise<boolean> {
    // Try WebSocket first if connected
    if (this.client && this.connected) {
      try {
        const bidData = {
          bidAmount: bidAmount,
          itemId: itemId,
          buyerId: buyerId
        }

        console.log(`Placing bid via WebSocket for item ${itemId}: €${bidAmount}`)
        this.client.publish({
          destination: `/app/items/${itemId}/bids`,
          body: JSON.stringify(bidData)
        })
        return true
      } catch (error) {
        console.error('Error placing bid via WebSocket:', error)
        // Fall through to REST API fallback
      }
    }

    // Fallback to REST API
    try {
      const result = await BidService.placeBid(itemId, bidAmount, buyerId)
      if (result.success) {
        // Simulate bid confirmation callback for consistency
        if (this.bidConfirmationCallback) {
          this.bidConfirmationCallback({
            success: true,
            message: result.message || 'Bid placed successfully',
            bid: result.data
          })
        }
        return true
      } else {
        if (this.bidConfirmationCallback) {
          this.bidConfirmationCallback({
            success: false,
            message: result.error || 'Failed to place bid'
          })
        }
        return false
      }
    } catch (error) {
      console.error('Error placing bid via REST API:', error)
      this.handleError('Failed to place bid')
      return false
    }
  }

  /**
   * Set connection status callback
   */
  public onConnectionStatus(callback: ConnectionStatusCallback): void {
    this.connectionStatusCallback = callback
  }

  /**
   * Set error callback
   */
  public onError(callback: ErrorCallback): void {
    this.errorCallback = callback
  }

  // =============================================================================
  // Private Methods
  // =============================================================================

  /**
   * Handle successful connection
   */
  private onConnect(): void {
    console.log('WebSocket connected successfully')
    this.connected = true
    this.connectionStatus = 'connected'
    this.reconnectAttempts = 0

    if (this.connectionStatusCallback) {
      this.connectionStatusCallback(true)
    }

    // Re-subscribe to all topics
    this.resubscribeToTopics()
  }

  /**
   * Handle disconnection
   */
  private onDisconnect(): void {
    console.log('WebSocket disconnected')
    this.connected = false
    this.connectionStatus = 'disconnected'

    if (this.connectionStatusCallback) {
      this.connectionStatusCallback(false)
    }
  }

  /**
   * Handle STOMP errors
   */
  private onStompError(frame: any): void {
    console.error('STOMP error:', frame)
    this.connectionStatus = 'error'
    this.handleError(`STOMP error: ${frame.headers?.message || 'Unknown error'}`)
  }

  /**
   * Handle WebSocket errors
   */
  private onWebSocketError(error: any): void {
    console.error('WebSocket error:', error)
    this.connectionStatus = 'error'
    this.handleError('WebSocket connection error')
  }

  /**
   * Re-subscribe to all topics after reconnection
   */
  private resubscribeToTopics(): void {
    if (!this.client || !this.connected) return

    // Re-subscribe to bid updates
    this.bidUpdateCallbacks.forEach((callbacks, topic) => {
      if (!this.subscriptions.has(topic)) {
        const subscription = this.client!.subscribe(topic, (message: any) => {
          try {
            const rawData = JSON.parse(message.body)

            // Handle the simplified BidUpdateResponse from Java backend
            const bidUpdate: BidUpdate = {
              itemId: rawData.itemId,
              bidAmount: rawData.bidAmount,
              buyerId: rawData.buyerId,
              timestamp: new Date(), // Use current time
              bidder: {
                id: rawData.buyerId,
                username: `User ${rawData.buyerId.slice(0, 8)}`
              },
              isWinning: true,
              totalBids: 1
            }

            callbacks.forEach(cb => cb(bidUpdate))
          } catch (error) {
            console.error('Error parsing bid update:', error)
            this.handleError('Failed to parse bid update')
          }
        })

        this.subscriptions.set(topic, subscription)
      }
    })

    // Re-subscribe to bid confirmations
    if (this.bidConfirmationCallback) {
      const topic = '/user/queue/bid/confirmation'
      if (!this.subscriptions.has(topic)) {
        const subscription = this.client.subscribe(topic, (message: any) => {
          try {
            const confirmation: BidConfirmation = JSON.parse(message.body)

            if (this.bidConfirmationCallback) {
              this.bidConfirmationCallback(confirmation)
            }
          } catch (error) {
            console.error('Error parsing bid confirmation:', error)
            this.handleError('Failed to parse bid confirmation')
          }
        })

        this.subscriptions.set(topic, subscription)
      }
    }

    // Re-subscribe to generic subscriptions
    this.genericSubscriptions.forEach((callback, topic) => {
      if (!this.subscriptions.has(topic)) {
        const subscription = this.client!.subscribe(topic, (message: any) => {
          try {
            const data = JSON.parse(message.body)
            callback(data)
          } catch (error) {
            console.error('Error parsing message:', error)
            callback(message.body)
          }
        })
        this.subscriptions.set(topic, subscription)
      }
    })
  }

  /**
   * Handle errors
   */
  private handleError(error: string): void {
    console.error('WebSocket Service Error:', error)

    if (this.errorCallback) {
      this.errorCallback(error)
    }
  }
}

// Singleton instance
let webSocketServiceInstance: WebSocketService | null = null

/**
 * Get WebSocket service singleton instance
 */
export const getWebSocketService = (): WebSocketService => {
  if (!webSocketServiceInstance) {
    webSocketServiceInstance = new WebSocketService()
  }
  return webSocketServiceInstance
}

export default WebSocketService
