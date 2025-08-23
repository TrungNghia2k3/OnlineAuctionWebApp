/**
 * Bid API Integration Interfaces
 * Contains all interfaces for the bid API integration hook
 */

export interface BidApiIntegration {
  initialBids: any[]
  isLoading: boolean
  error: string | null
  refreshBids: () => Promise<void>
}
