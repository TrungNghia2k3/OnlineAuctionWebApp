/**
 * Hook for integrating with existing bid API
 * Provides initial bid history and integrates with real-time updates
 */

import { useState, useEffect, useCallback } from 'react'
import BidService from '@/services/BidService'
import { BidApiIntegration } from './interfaces/BidApiIntegrationInterfaces'

/**
 * Hook to integrate with existing bid API
 */
export const useBidApiIntegration = (itemId: string | number): BidApiIntegration => {
  const [initialBids, setInitialBids] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  /**
   * Load bids from the existing API
   */
  const loadBids = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)

      const result = await BidService.getItemBids(itemId)
      
      if (result.success && result.data) {
        // Format bids for display
        const formattedBids = Array.isArray(result.data) 
          ? result.data.map(bid => BidService.formatBidForDisplay(bid))
          : []
        
        setInitialBids(formattedBids)
      } else {
        setError(result.error || 'Failed to load bids')
      }
    } catch (err) {
      console.error('Error loading bids:', err)
      setError('Failed to load bid history')
    } finally {
      setIsLoading(false)
    }
  }, [itemId])

  /**
   * Refresh bids (can be called manually)
   */
  const refreshBids = useCallback(async () => {
    await loadBids()
  }, [loadBids])

  // Load bids on mount and when itemId changes
  useEffect(() => {
    if (itemId) {
      loadBids()
    }
  }, [itemId, loadBids])

  return {
    initialBids,
    isLoading,
    error,
    refreshBids
  }
}
