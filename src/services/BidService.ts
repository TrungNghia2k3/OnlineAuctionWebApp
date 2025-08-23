/**
 * Bid Service Implementation
 * Integrates with existing bid API and provides real-time functionality
 */

import bidApi from '@/api/bid'
import { IBidServiceResponse } from './interfaces'

/**
 * Bid Service that integrates with existing API
 */
export class BidService {

    /**
     * Place a bid using the existing API
     */
    static async placeBid(itemId: string | number, bidAmount: number, buyerId?: string | number): Promise<IBidServiceResponse> {
        try {
            const bidData = {
                amount: bidAmount,
                itemId: itemId,
                buyerId: buyerId
            }


            console.log('Placing bid with data:', bidData)

            const response = await bidApi.create(bidData)

            // Format the response data for consistency
            const formattedBid = response.result ? BidService.formatBidForDisplay(response.result) : response

            return {
                success: true,
                data: formattedBid,
                message: 'Bid placed successfully'
            }
        } catch (error) {
            console.error('Error placing bid:', error)
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Failed to place bid'
            }
        }
    }

    /**
     * Get bids for an item using the existing API
     */
    static async getItemBids(itemId: string | number): Promise<IBidServiceResponse> {
        try {
            const response = await bidApi.getItemBids(itemId)
            console.log("Bids API Response:", response)

            // Format each bid for display
            const formattedBids = response.result?.map((bid: any) =>
                BidService.formatBidForDisplay(bid)
            ) || []

            return {
                success: true,
                data: formattedBids,
                message: 'Bids retrieved successfully'
            }
        } catch (error) {
            console.error('Error getting item bids:', error)
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Failed to get bids'
            }
        }
    }

    /**
     * Format bid data for display
     */
    static formatBidForDisplay(bidData: any): any {
        // Handle bidTime array format [year, month, day, hour, minute, second, nanoseconds]
        let timestamp: Date
        if (Array.isArray(bidData.bidTime)) {
            const [year, month, day, hour, minute, second, nanoseconds] = bidData.bidTime
            timestamp = new Date(year, month - 1, day, hour, minute, second, Math.floor((nanoseconds || 0) / 1000000)) // month is 0-indexed in JS Date
        } else {
            timestamp = new Date(bidData.timestamp || bidData.createdAt || bidData.bidTime)
        }

        return {
            id: bidData.id,
            itemId: bidData.itemId,
            bidAmount: bidData.amount || bidData.bidAmount, // API uses 'amount'
            bidder: {
                id: bidData.buyerId || bidData.bidder?.id || bidData.bidderId, // API uses 'buyerId'
                username: bidData.bidder?.username || bidData.bidderName || bidData.buyerName || `User ${bidData.buyerId?.slice(0, 8) || 'Anonymous'}`
            },
            timestamp: timestamp,
            isWinning: bidData.isWinning || bidData.highestBid || bidData.status === 'WON',
            totalBids: bidData.totalBids || 0,
            status: bidData.status,
            proxyBid: bidData.proxyBid
        }
    }
}

export default BidService
