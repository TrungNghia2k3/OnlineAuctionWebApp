/**
 * Bid Form Component
 * Allows users to place bids on auction items with real-time validation
 */

import React, { useState, useEffect } from 'react'

interface BidFormProps {
  currentPrice: number
  minBidIncrement: number
  isSubmitting: boolean
  canBid: boolean
  onSubmit: (amount: number) => void
  error?: string | null
  success?: boolean
  className?: string
}

/**
 * Form component for placing bids on auction items
 */
const BidForm: React.FC<BidFormProps> = ({
  currentPrice,
  minBidIncrement,
  isSubmitting,
  canBid,
  onSubmit,
  error,
  success,
  className = ''
}) => {
  const [bidAmount, setBidAmount] = useState('')
  const [validationError, setValidationError] = useState<string | null>(null)

  const minBidAmount = currentPrice + minBidIncrement

  /**
   * Validate bid amount
   */
  const validateBidAmount = (amount: string): string | null => {
    const numericAmount = parseFloat(amount)

    if (!amount || isNaN(numericAmount)) {
      return 'Please enter a valid bid amount'
    }

    if (numericAmount < minBidAmount) {
      return `Minimum bid is €${minBidAmount.toLocaleString()}`
    }

    if (numericAmount > 1000000) {
      return 'Bid amount cannot exceed €1,000,000'
    }

    return null
  }

  /**
   * Handle form submission
   */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const error = validateBidAmount(bidAmount)
    if (error) {
      setValidationError(error)
      return
    }

    const numericAmount = parseFloat(bidAmount)
    onSubmit(numericAmount)
  }

  /**
   * Handle bid amount change
   */
  const handleBidAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setBidAmount(value)

    // Clear validation error when user starts typing
    if (validationError) {
      setValidationError(null)
    }
  }

  /**
   * Set quick bid amounts
   */
  const setQuickBid = (amount: number) => {
    setBidAmount(amount.toString())
    setValidationError(null)
  }

  // Clear form when bid is successful
  useEffect(() => {
    if (success) {
      setBidAmount('')
      setValidationError(null)
    }
  }, [success])

  // Update minimum bid when current price changes
  useEffect(() => {
    const currentBidAmount = parseFloat(bidAmount)
    if (bidAmount && !isNaN(currentBidAmount) && currentBidAmount < minBidAmount) {
      setValidationError(`Minimum bid is €${minBidAmount.toLocaleString()}`)
    }
  }, [minBidAmount, bidAmount])

  const displayError = validationError || error

  return (
    <div className={`bid-form ${className}`}>
      <form onSubmit={handleSubmit}>
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
              onChange={handleBidAmountChange}
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
                onClick={() => setQuickBid(minBidAmount)}
                disabled={!canBid || isSubmitting}
              >
                €{minBidAmount.toLocaleString()}
              </button>
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={() => setQuickBid(minBidAmount + minBidIncrement)}
                disabled={!canBid || isSubmitting}
              >
                €{(minBidAmount + minBidIncrement).toLocaleString()}
              </button>
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={() => setQuickBid(minBidAmount + minBidIncrement * 2)}
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
            (Current: €{currentPrice.toLocaleString()} + €{minBidIncrement.toLocaleString()})
          </small>
        </div>
      </form>

      {/* Bidding status indicators */}
      <div className="bid-form__status mt-3">
        {!canBid && (
          <div className="alert alert-warning alert-sm" role="alert">
            <i className="bi bi-exclamation-triangle me-2"></i>
            {!canBid ? 'Unable to bid at this time' : 'Please log in to place bids'}
          </div>
        )}
      </div>
    </div>
  )
}

export default BidForm
