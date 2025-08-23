/**
 * Models Ba// Notification model exports
export * from './Notification'

// Common types
export * from './types'

// =============================================================================
// Constants
// =============================================================================

// Currency formatting constants
export const CURRENCY_CONFIG = {
  STYLE: 'currency',
  CURRENCY: 'EUR',
  MIN_FRACTION_DIGITS: 0,
  MAX_FRACTION_DIGITS: 0
} as const

// Time constants for calculations
export const TIME_CONSTANTS = {
    MILLISECONDS_IN_SECOND: 1000,
    SECONDS_IN_MINUTE: 60,
    MINUTES_IN_HOUR: 60,
    HOURS_IN_DAY: 24
} as const

// =============================================================================
// Callback Types
// =============================================================================

export type BidConfirmationCallback = (confirmation: BidConfirmation) => void
export type BidUpdateCallback = (bidUpdate: BidUpdate) => void
export type ConnectionStatusCallback = (connected: boolean) => void
export type ErrorCallback = (error: string) => voidFile
 * Exports all models from consolidated files
 */

// User model exports
export * from './User'

// Category model exports  
export * from './Category'

// Auction model exports
export * from './Auction'

// Item model exports
export * from './Item'

// Notification model exports
export * from './Notification'

// Common types
export * from '../types'
