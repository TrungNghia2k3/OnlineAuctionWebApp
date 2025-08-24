/**
 * Bid Form Component
 * UI-only component for placing bids - logic handled by useBidForm hook
 */

import React from 'react'
import PropTypes from 'prop-types'

/**
 * Pure UI component for bid form
 */
const BidForm = ({
  bidAmount,
  validationError,
  displayError,
  minBidAmount,
  minBidIncrement,
  isSubmitting,
  canBid,
  success,
  className = '',
  onBidAmountChange,
  onSubmit,
  onQuickBid
}) => {
  const handleInputChange = (e) => {
    onBidAmountChange(e.target.value)
  }

  return (
    <div className={`bid-form ${className}`}>
      <form onSubmit={onSubmit}>
        <div className="bid-form__input-section">
          <div className="input-group mb-3">
            <span className="input-group-text">€</span>
            <input
              type="number"
              step="0.01"
              min={minBidAmount}
              max="1000000"
              className={`form-control ${displayError ? 'is-invalid' : ''} ${success ? 'is-valid' : ''}`}
              placeholder={`Min. €${minBidAmount.toLocaleString()}`}
              value={bidAmount}
              onChange={handleInputChange}
              disabled={!canBid || isSubmitting}
              aria-label="Bid amount"
            />
            <button
              type="submit"
              className="btn btn-primary"
              disabled={!canBid || isSubmitting || !!validationError}
            >
              {isSubmitting ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  Placing Bid...
                </>
              ) : (
                'Place Bid'
              )}
            </button>
          </div>

          {/* Quick bid buttons */}
          <div className="bid-form__quick-bids mb-3">
            <small className="text-muted d-block mb-2">Quick bid amounts:</small>
            <div className="btn-group btn-group-sm" role="group" aria-label="Quick bid amounts">
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={() => onQuickBid(minBidAmount)}
                disabled={!canBid || isSubmitting}
              >
                €{minBidAmount.toLocaleString()}
              </button>
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={() => onQuickBid(minBidAmount + minBidIncrement)}
                disabled={!canBid || isSubmitting}
              >
                €{(minBidAmount + minBidIncrement).toLocaleString()}
              </button>
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={() => onQuickBid(minBidAmount + minBidIncrement * 2)}
                disabled={!canBid || isSubmitting}
              >
                €{(minBidAmount + minBidIncrement * 2).toLocaleString()}
              </button>
            </div>
          </div>

          {/* Error message */}
          {displayError && (
            <div className="alert alert-danger alert-sm mb-3" role="alert">
              <i className="bi bi-exclamation-triangle me-2"></i>
              {displayError}
            </div>
          )}

          {/* Success message */}
          {success && (
            <div className="alert alert-success alert-sm mb-3" role="alert">
              <i className="bi bi-check-circle me-2"></i>
              Bid placed successfully!
            </div>
          )}

          {/* Help text */}
          <small className="text-muted">
            <i className="bi bi-info-circle me-1"></i>
            Minimum bid: €{minBidAmount.toLocaleString()} 
          </small>
        </div>
      </form>

      {/* Bidding status indicators */}
      <div className="bid-form__status mt-3">
        {!canBid && (
          <div className="alert alert-warning alert-sm" role="alert">
            <i className="bi bi-exclamation-triangle me-2"></i>
            Unable to bid at this time
          </div>
        )}
      </div>
    </div>
  )
}

BidForm.propTypes = {
  bidAmount: PropTypes.string.isRequired,
  validationError: PropTypes.string,
  displayError: PropTypes.string,
  minBidAmount: PropTypes.number.isRequired,
  minBidIncrement: PropTypes.number.isRequired,
  isSubmitting: PropTypes.bool.isRequired,
  canBid: PropTypes.bool.isRequired,
  success: PropTypes.bool,
  className: PropTypes.string,
  onBidAmountChange: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  onQuickBid: PropTypes.func.isRequired
}

export default BidForm
