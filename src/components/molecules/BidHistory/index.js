/**
 * Bid History Component
 * UI-only component for displaying bid history - logic handled by useBidHistory hook
 */

import React from 'react'
import PropTypes from 'prop-types'

/**
 * Pure UI component for bid history display
 */
const BidHistory = ({
  displayedBids,
  totalBids,
  currentHighBid,
  uniqueBidders,
  isLoading,
  className = '',
  maxItems,
  formatTimestamp,
  isCurrentUserBid
}) => {
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
          <span className="badge bg-secondary ms-2">{totalBids}</span>
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

        {totalBids > maxItems && (
          <div className="bid-history__more text-center mt-3">
            <small className="text-muted">
              Showing {maxItems} of {totalBids} bids
            </small>
          </div>
        )}
      </div>

      <div className="bid-history__stats mt-3">
        <div className="row text-center">
          <div className="col-4">
            <small className="text-muted d-block">Total Bids</small>
            <strong>{totalBids}</strong>
          </div>
          <div className="col-4">
            <small className="text-muted d-block">Current High</small>
            <strong className="text-success">
              €{currentHighBid.toLocaleString()}
            </strong>
          </div>
          <div className="col-4">
            <small className="text-muted d-block">Bidders</small>
            <strong>{uniqueBidders}</strong>
          </div>
        </div>
      </div>
    </div>
  )
}

BidHistory.propTypes = {
  displayedBids: PropTypes.arrayOf(PropTypes.shape({
    bidAmount: PropTypes.number.isRequired,
    timestamp: PropTypes.instanceOf(Date),
    bidder: PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      username: PropTypes.string
    }),
    buyerId: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
  })).isRequired,
  totalBids: PropTypes.number.isRequired,
  currentHighBid: PropTypes.number.isRequired,
  uniqueBidders: PropTypes.number.isRequired,
  isLoading: PropTypes.bool,
  className: PropTypes.string,
  maxItems: PropTypes.number,
  formatTimestamp: PropTypes.func.isRequired,
  isCurrentUserBid: PropTypes.func.isRequired
}

export default BidHistory
