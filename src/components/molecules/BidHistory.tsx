/**
 * Bid History Component
 * Displays real-time bid history for auction items
 */

import React from 'react'
import { BidUpdate } from '@/services/interfaces/WebSocketInterfaces'

interface BidHistoryProps {
  bidHistory: BidUpdate[]
  currentUserId?: string | number
  isLoading?: boolean
  className?: string
  maxItems?: number
}

/**
 * Component to display bid history with real-time updates
 */
const BidHistory: React.FC<BidHistoryProps> = ({
  bidHistory,
  currentUserId,
  isLoading = false,
  className = '',
  maxItems = 10
}) => {
  const displayedBids = bidHistory.slice(0, maxItems)

  /**
   * Format timestamp for display
   */
  const formatTimestamp = (timestamp?: Date): string => {
    if (!timestamp) {
      return 'Just now'
    }
    
    const now = new Date()
    const diff = now.getTime() - timestamp.getTime()
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)

    if (days > 0) {
      return `${days}d ago`
    } else if (hours > 0) {
      return `${hours}h ago`
    } else if (minutes > 0) {
      return `${minutes}m ago`
    } else {
      return 'Just now'
    }
  }

  /**
   * Check if bid is from current user
   */
  const isCurrentUserBid = (bidder: { id: string | number } | undefined): boolean => {
    if (!bidder || currentUserId === undefined) {
      return false
    }
    return bidder.id.toString() === currentUserId.toString()
  }

  if (isLoading) {
    return (
      <div className={`bid-history ${className}`}>
        <div className="bid-history__header">
          <h5 className="mb-3">
            <i className="bi bi-clock-history me-2"></i>
            Bid History
          </h5>
        </div>
        <div className="bid-history__loading">
          <div className="d-flex justify-content-center p-4">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading bid history...</span>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (displayedBids.length === 0) {
    return (
      <div className={`bid-history ${className}`}>
        <div className="bid-history__header">
          <h5 className="mb-3">
            <i className="bi bi-clock-history me-2"></i>
            Bid History
          </h5>
        </div>
        <div className="bid-history__empty">
          <div className="text-center text-muted p-4">
            <i className="bi bi-inbox display-4 mb-3"></i>
            <p className="mb-0">No bids placed yet</p>
            <small>Be the first to place a bid!</small>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={`bid-history ${className}`}>
      <div className="bid-history__header">
        <h5 className="mb-3">
          <i className="bi bi-clock-history me-2"></i>
          Bid History
          <span className="badge bg-secondary ms-2">{bidHistory.length}</span>
        </h5>
      </div>

      <div className="bid-history__list">
        <div className="list-group list-group-flush">
          {displayedBids.map((bid, index) => (
            <div
              key={`${bid.bidder?.id || bid.buyerId || 'unknown'}-${bid.timestamp?.getTime() || index}`}
              className={`list-group-item d-flex justify-content-between align-items-start 
                ${isCurrentUserBid(bid.bidder) ? 'bg-light border-primary' : ''}
                ${index === 0 ? 'border-success' : ''}
              `}
            >
              <div className="bid-history__bid-info">
                <div className="bid-history__bidder">
                  <span className={`fw-bold ${isCurrentUserBid(bid.bidder) ? 'text-primary' : ''}`}>
                    {isCurrentUserBid(bid.bidder) ? 'You' : (bid.bidder?.username || 'Anonymous')}
                  </span>
                  {index === 0 && (
                    <span className="badge bg-success ms-2">
                      <i className="bi bi-trophy me-1"></i>
                      Winning
                    </span>
                  )}
                  {isCurrentUserBid(bid.bidder) && index !== 0 && (
                    <span className="badge bg-primary ms-2">Your bid</span>
                  )}
                </div>
                <small className="text-muted">
                  <i className="bi bi-clock me-1"></i>
                  {formatTimestamp(bid.timestamp)}
                </small>
              </div>

              <div className="bid-history__amount">
                <span className={`fw-bold ${index === 0 ? 'text-success' : ''}`}>
                  €{bid.bidAmount.toLocaleString()}
                </span>
              </div>
            </div>
          ))}
        </div>

        {bidHistory.length > maxItems && (
          <div className="bid-history__more text-center mt-3">
            <small className="text-muted">
              Showing {maxItems} of {bidHistory.length} bids
            </small>
          </div>
        )}
      </div>

      <div className="bid-history__stats mt-3">
        <div className="row text-center">
          <div className="col-4">
            <small className="text-muted d-block">Total Bids</small>
            <strong>{bidHistory.length}</strong>
          </div>
          <div className="col-4">
            <small className="text-muted d-block">Current High</small>
            <strong className="text-success">
              €{displayedBids[0]?.bidAmount.toLocaleString() || '0'}
            </strong>
          </div>
          <div className="col-4">
            <small className="text-muted d-block">Bidders</small>
            <strong>
              {new Set(bidHistory.map(bid => bid.bidder?.id).filter(id => id !== undefined)).size}
            </strong>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BidHistory
