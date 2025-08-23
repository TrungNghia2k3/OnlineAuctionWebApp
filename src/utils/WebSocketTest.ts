/**
 * WebSocket Connection Test Utility
 * Simple test to verify WebSocket connectivity with Spring Boot backend
 */

import WebSocketService from '@/services/WebSocketService'

export class WebSocketTest {
  private webSocketService: WebSocketService

  constructor() {
    this.webSocketService = new WebSocketService()
  }

  /**
   * Test WebSocket connection to backend
   */
  async testConnection(): Promise<boolean> {
    return new Promise((resolve) => {
      console.log('🔍 Testing WebSocket connection...')
      
      // Set up connection status callback
      this.webSocketService.onConnectionStatus((connected) => {
        if (connected) {
          console.log('✅ WebSocket connected successfully!')
          resolve(true)
        } else {
          console.log('❌ WebSocket connection failed')
          resolve(false)
        }
      })

      // Set up error callback
      this.webSocketService.onError((error) => {
        console.error('🚨 WebSocket error:', error)
        resolve(false)
      })

      // Attempt connection
      this.webSocketService.connect()
        .then(() => {
          console.log('📡 Connection attempt completed')
        })
        .catch((error) => {
          console.error('💥 Connection failed:', error)
          resolve(false)
        })

      // Timeout after 10 seconds
      setTimeout(() => {
        if (!this.webSocketService.getConnectionStatus()) {
          console.log('⏰ Connection test timed out')
          resolve(false)
        }
      }, 10000)
    })
  }

  /**
   * Test bid subscription for a specific item
   */
  testBidSubscription(itemId: string | number): () => void {
    console.log(`🔔 Testing bid subscription for item ${itemId}...`)
    
    const unsubscribe = this.webSocketService.subscribeToBidUpdates(itemId, (bidUpdate) => {
      console.log('📨 Received bid update:', bidUpdate)
    })

    console.log(`✅ Successfully subscribed to bids for item ${itemId}`)
    return unsubscribe
  }

  /**
   * Test placing a bid
   */
  async testPlaceBid(itemId: string | number, bidAmount: number, buyerId?: string | number): Promise<boolean> {
    console.log(`💰 Testing bid placement: €${bidAmount} for item ${itemId} (buyerId: ${buyerId || 'test-user'})...`)
    
    const result = await this.webSocketService.placeBid(itemId, bidAmount, buyerId || 'test-user')
    
    if (result) {
      console.log('✅ Bid placed successfully!')
    } else {
      console.log('❌ Bid placement failed')
    }
    
    return result
  }

  /**
   * Disconnect from WebSocket
   */
  disconnect(): void {
    console.log('🔌 Disconnecting from WebSocket...')
    this.webSocketService.disconnect()
    console.log('✅ Disconnected')
  }

  /**
   * Get current connection status
   */
  getConnectionStatus(): boolean {
    return this.webSocketService.getConnectionStatus()
  }
}

// Export singleton instance for testing
export const webSocketTest = new WebSocketTest()

// Global testing functions for browser console
declare global {
  interface Window {
    testWebSocket: {
      connect: () => Promise<boolean>
      subscribeToBids: (itemId: string | number) => () => void
      placeBid: (itemId: string | number, amount: number, buyerId?: string | number) => Promise<boolean>
      disconnect: () => void
      getStatus: () => boolean
    }
  }
}

// Make testing functions available globally in development
if (process.env.NODE_ENV === 'development') {
  window.testWebSocket = {
    connect: () => webSocketTest.testConnection(),
    subscribeToBids: (itemId) => webSocketTest.testBidSubscription(itemId),
    placeBid: (itemId, amount, buyerId) => webSocketTest.testPlaceBid(itemId, amount, buyerId),
    disconnect: () => webSocketTest.disconnect(),
    getStatus: () => webSocketTest.getConnectionStatus()
  }
}
