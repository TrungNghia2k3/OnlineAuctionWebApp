/**
 * WebSocket Service for Real-time Bidding
 * Handles STOMP WebSocket connections for auction bidding
 */

import { Client, IStompSocket } from '@stomp/stompjs'
import { AuthUtils } from '@/utils/AuthUtils'
import { IBid } from '@/models/Auction'

// Import SockJS using require to avoid TypeScript module resolution issues
// This is a common pattern with SockJS client library
const SockJS = require('sockjs-client')

export interface BidUpdate {
  itemId: string | number
  bidAmount: number
  bidder: {
    id: string | number
    username: string
  }
  timestamp: Date
  isWinning: boolean
  totalBids: number
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

/**
 * WebSocket Service for real-time auction bidding
 */
export class WebSocketService {
  private client: Client | null = null
  private isConnected: boolean = false
  private subscriptions: Map<string, any> = new Map()
  private bidUpdateCallbacks: Map<string, BidUpdateCallback[]> = new Map()
  private bidConfirmationCallback: BidConfirmationCallback | null = null
  private connectionStatusCallback: ConnectionStatusCallback | null = null
  private errorCallback: ErrorCallback | null = null

  private readonly WS_ENDPOINT = 'http://localhost:8080/ws'
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
      debug: (str) => {
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

  /**
   * Connect to WebSocket
   */
  public connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.isConnected) {
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

      // Update headers with current token
      if (this.client) {
        this.client.connectHeaders = {
          Authorization: `Bearer ${token}`
        }

        this.client.onConnect = () => {
          this.onConnect()
          resolve()
        }

        this.client.activate()
      } else {
        reject(new Error('WebSocket client not initialized'))
      }
    })
  }

  /**
   * Disconnect from WebSocket
   */
  public disconnect(): void {
    if (this.client && this.isConnected) {
      // Unsubscribe from all topics
      this.subscriptions.forEach((subscription) => {
        subscription.unsubscribe()
      })
      this.subscriptions.clear()
      
      this.client.deactivate()
    }
  }

  /**
   * Subscribe to bid updates for a specific item
   */
  public subscribeToBidUpdates(itemId: string | number, callback: BidUpdateCallback): () => void {
    const topic = `/topic/items/${itemId}/bids`
    
    if (!this.bidUpdateCallbacks.has(topic)) {
      this.bidUpdateCallbacks.set(topic, [])
    }
    
    this.bidUpdateCallbacks.get(topic)!.push(callback)

    // Subscribe to topic if not already subscribed
    if (!this.subscriptions.has(topic) && this.client && this.isConnected) {
      const subscription = this.client.subscribe(topic, (message) => {
        try {
          const bidUpdate: BidUpdate = JSON.parse(message.body)
          // Format timestamp
          bidUpdate.timestamp = new Date(bidUpdate.timestamp)
          
          // Notify all callbacks for this topic
          const callbacks = this.bidUpdateCallbacks.get(topic) || []
          callbacks.forEach(cb => cb(bidUpdate))
        } catch (error) {
          console.error('Error parsing bid update:', error)
          this.handleError('Failed to parse bid update')
        }
      })
      
      this.subscriptions.set(topic, subscription)
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
    
    if (!this.subscriptions.has(topic) && this.client && this.isConnected) {
      const subscription = this.client.subscribe(topic, (message) => {
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
   */
  public placeBid(itemId: string | number, bidAmount: number): void {
    if (!this.client || !this.isConnected) {
      this.handleError('WebSocket not connected')
      return
    }

    const bidData = {
      itemId: itemId,
      bidAmount: bidAmount
    }

    try {
      this.client.publish({
        destination: `/app/items/${itemId}/bids`,
        body: JSON.stringify(bidData)
      })
    } catch (error) {
      console.error('Error placing bid:', error)
      this.handleError('Failed to place bid')
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

  /**
   * Get connection status
   */
  public getConnectionStatus(): boolean {
    return this.isConnected
  }

  /**
   * Handle successful connection
   */
  private onConnect(): void {
    console.log('WebSocket connected successfully')
    this.isConnected = true
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
    this.isConnected = false
    
    if (this.connectionStatusCallback) {
      this.connectionStatusCallback(false)
    }
  }

  /**
   * Handle STOMP errors
   */
  private onStompError(frame: any): void {
    console.error('STOMP error:', frame)
    this.handleError(`STOMP error: ${frame.headers?.message || 'Unknown error'}`)
  }

  /**
   * Handle WebSocket errors
   */
  private onWebSocketError(error: any): void {
    console.error('WebSocket error:', error)
    this.handleError('WebSocket connection error')
  }

  /**
   * Re-subscribe to all topics after reconnection
   */
  private resubscribeToTopics(): void {
    if (!this.client || !this.isConnected) return

    // Re-subscribe to bid updates
    this.bidUpdateCallbacks.forEach((callbacks, topic) => {
      if (!this.subscriptions.has(topic)) {
        const subscription = this.client!.subscribe(topic, (message) => {
          try {
            const bidUpdate: BidUpdate = JSON.parse(message.body)
            bidUpdate.timestamp = new Date(bidUpdate.timestamp)
            
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
        const subscription = this.client.subscribe(topic, (message) => {
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
