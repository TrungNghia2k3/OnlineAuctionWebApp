/**
 * Core WebSocket Service Interfaces
 * Contains the main WebSocket service abstraction (separate from WebSocketInterfaces.ts)
 */

export interface IWebSocketService {
  connect(): Promise<void>
  disconnect(): void
  subscribeToBidUpdates(itemId: string | number, callback: (bidUpdate: any) => void): () => void
  subscribeToBidConfirmations(callback: (confirmation: any) => void): () => void
  placeBid(itemId: string | number, bidAmount: number): void
  onConnectionStatus(callback: (connected: boolean) => void): void
  onError(callback: (error: string) => void): void
  getConnectionStatus(): boolean
}
