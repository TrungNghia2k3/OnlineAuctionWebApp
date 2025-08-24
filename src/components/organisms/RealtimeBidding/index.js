/**
 * Real-time Bidding Component
 * Main component that orchestrates real-time bidding functionality
 */

import ConnectionStatus from '@/components/atoms/ConnectionStatus'
import { BidForm, BidHistory } from '@/components/molecules'
import { useBidApiIntegration, useBidding, useBidForm, useBidHistory } from '@/hooks'
import PropTypes from 'prop-types'
import React, { useEffect } from 'react'

/**
 * Real-time bidding component with WebSocket integration
 */
const RealtimeBidding = ({
  itemId,
  initialPrice,
  initialTotalBids = 0,
  minBidIncrement,
  isAuctionActive,
  currentUserId,
  className = '',
  showHistory = true,
  showConnectionStatus = true
}) => {
  const {
    currentPrice,
    totalBids,
    bidHistory,
    isConnected,
    isLoading,
    error,
    bidSubmission,
    placeBid,
    updateCurrentPrice,
    clearBidSubmission,
    retry,
    canBid,
    isAuthenticated
  } = useBidding({ itemId, autoConnect: true })

  // Load initial bid history from existing API
  const {
    initialBids,
    isLoading: bidsLoading,
  } = useBidApiIntegration(itemId)

  // Update initial price when prop changes
  useEffect(() => {
    updateCurrentPrice(initialPrice, initialTotalBids)
  }, [initialPrice, initialTotalBids, updateCurrentPrice])

  // Merge initial bids with real-time bid history
  const allBids = bidHistory.length > 0 ? bidHistory : initialBids

  const effectiveCurrentPrice = currentPrice || initialPrice
  const effectiveTotalBids = totalBids || initialTotalBids

  const handleBidSubmit = async (amount) => {
    await placeBid(amount)
  }

  const handleRetry = () => {
    clearBidSubmission()
    retry()
  }

  const canPlaceBid = canBid && isAuctionActive && isAuthenticated

  // Initialize BidForm hook
  const bidFormHook = useBidForm({
    currentPrice: effectiveCurrentPrice,
    minBidIncrement,
    isSubmitting: bidSubmission.isSubmitting,
    canBid: canPlaceBid || false,
    onSubmit: handleBidSubmit,
    error: bidSubmission.error,
    success: bidSubmission.success
  })

  // Initialize BidHistory hook
  const bidHistoryHook = useBidHistory({
    bidHistory: allBids,
    currentUserId,
    maxItems: 10
  })

  return (
    <div className={`realtime-bidding ${className}`}>
      {/* Connection Status */}
      {showConnectionStatus && (
        <ConnectionStatus
          isConnected={isConnected}
          isLoading={isLoading}
          error={error}
          onRetry={handleRetry}
          className="mb-4"
        />
      )}

      {/* Current Bid Display */}
      <div className="realtime-bidding__current-bid mb-4">
        <div className="card border-success">
          <div className="card-body">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <h5 className="card-title mb-0">
                <i className="bi bi-currency-euro me-2"></i>
                Current Bid
              </h5>
              {isConnected && (
                <span className="badge bg-success">
                  <i className="bi bi-broadcast me-1"></i>
                  LIVE
                </span>
              )}
            </div>
            
            <div className="row align-items-center">
              <div className="col-md-8">
                <div className="realtime-bidding__price-display">
                  <span className="display-6 fw-bold text-success">
                    €{effectiveCurrentPrice.toLocaleString()}
                  </span>
                  {allBids.length > 0 && allBids[0].timestamp && (
                    <small className="text-muted d-block">
                      <i className="bi bi-clock me-1"></i>
                      Last updated: {new Date(allBids[0].timestamp).toLocaleTimeString()}
                    </small>
                  )}
                </div>
              </div>
              <div className="col-md-4 text-md-end">
                <div className="realtime-bidding__bid-stats">
                  <div className="text-muted">
                    <i className="bi bi-people me-1"></i>
                    <strong>{effectiveTotalBids}</strong> bid{effectiveTotalBids !== 1 ? 's' : ''}
                  </div>
                  {allBids.length > 0 && allBids[0].bidder && (
                    <div className="text-muted small">
                      Leading: <strong>{allBids[0].bidder.username}</strong>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bid Form */}
      <div className="realtime-bidding__bid-form mb-4">
        <div className="card">
          <div className="card-header">
            <h6 className="mb-0">
              <i className="bi bi-hammer me-2"></i>
              Place Your Bid
            </h6>
          </div>
          <div className="card-body">
            {!isAuthenticated ? (
              <div className="alert alert-info" role="alert">
                <i className="bi bi-info-circle me-2"></i>
                Please <strong>log in</strong> to participate in this auction.
              </div>
            ) : !isAuctionActive ? (
              <div className="alert alert-warning" role="alert">
                <i className="bi bi-clock me-2"></i>
                This auction is not currently active for bidding.
              </div>
            ) : (
              <BidForm
                bidAmount={bidFormHook.bidAmount}
                validationError={bidFormHook.validationError}
                displayError={bidFormHook.displayError}
                minBidAmount={bidFormHook.minBidAmount}
                minBidIncrement={minBidIncrement}
                isSubmitting={bidSubmission.isSubmitting}
                canBid={canPlaceBid || false}
                success={bidSubmission.success}
                onBidAmountChange={bidFormHook.handleBidAmountChange}
                onSubmit={bidFormHook.handleSubmit}
                onQuickBid={bidFormHook.setQuickBid}
              />
            )}
          </div>
        </div>
      </div>

      {/* Bid History */}
      {showHistory && (
        <div className="realtime-bidding__history">
          <div className="card">
            <div className="card-body">
              <BidHistory
                displayedBids={bidHistoryHook.displayedBids}
                totalBids={bidHistoryHook.totalBids}
                currentHighBid={bidHistoryHook.currentHighBid}
                uniqueBidders={bidHistoryHook.uniqueBidders}
                isLoading={(isLoading && bidHistory.length === 0) || bidsLoading}
                maxItems={10}
                formatTimestamp={bidHistoryHook.formatTimestamp}
                isCurrentUserBid={bidHistoryHook.isCurrentUserBid}
              />
            </div>
          </div>
        </div>
      )}

      {/* Debug Info (Development only) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="realtime-bidding__debug mt-4">
          <details>
            <summary className="text-muted small">Debug Info</summary>
            <pre className="small text-muted mt-2">
              {JSON.stringify({
                itemId,
                isConnected,
                isLoading,
                currentPrice: effectiveCurrentPrice,
                totalBids: effectiveTotalBids,
                bidHistoryCount: allBids.length,
                canBid: canPlaceBid,
                isAuthenticated,
                isAuctionActive
              }, null, 2)}
            </pre>
          </details>
        </div>
      )}
    </div>
  )
}

RealtimeBidding.propTypes = {
  itemId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  initialPrice: PropTypes.number.isRequired,
  initialTotalBids: PropTypes.number,
  minBidIncrement: PropTypes.number.isRequired,
  isAuctionActive: PropTypes.bool.isRequired,
  currentUserId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  className: PropTypes.string,
  showHistory: PropTypes.bool,
  showConnectionStatus: PropTypes.bool
}

export default RealtimeBidding
