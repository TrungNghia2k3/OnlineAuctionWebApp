/**
 * Hook for managing bid form logic
 * Handles validation, submission state, and form interactions
 */

import { useState, useEffect } from 'react'

interface UseBidFormProps {
  currentPrice: number
  minBidIncrement: number
  isSubmitting: boolean
  canBid: boolean
  onSubmit: (amount: number) => void
  error?: string | null
  success?: boolean
}

interface UseBidFormReturn {
  bidAmount: string
  validationError: string | null
  displayError: string | null
  minBidAmount: number
  handleBidAmountChange: (value: string) => void
  handleSubmit: (e: React.FormEvent) => void
  setQuickBid: (amount: number) => void
  clearForm: () => void
}

export const useBidForm = ({
  currentPrice,
  minBidIncrement,
  isSubmitting,
  canBid,
  onSubmit,
  error,
  success
}: UseBidFormProps): UseBidFormReturn => {
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
  const handleBidAmountChange = (value: string) => {
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

  /**
   * Clear form
   */
  const clearForm = () => {
    setBidAmount('')
    setValidationError(null)
  }

  // Clear form when bid is successful
  useEffect(() => {
    if (success) {
      clearForm()
    }
  }, [success])

  // Update minimum bid when current price changes
  useEffect(() => {
    const currentBidAmount = parseFloat(bidAmount)
    if (bidAmount && !isNaN(currentBidAmount) && currentBidAmount < minBidAmount) {
      setValidationError(`Minimum bid is €${minBidAmount.toLocaleString()}`)
    }
  }, [minBidAmount, bidAmount])

  const displayError = validationError || error || null

  return {
    bidAmount,
    validationError,
    displayError,
    minBidAmount,
    handleBidAmountChange,
    handleSubmit,
    setQuickBid,
    clearForm
  }
}
