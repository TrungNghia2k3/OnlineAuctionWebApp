/**
 * Auction and Auction-related interfaces and types
 */

import { BaseEntity } from '../types/common'
import { ICategory } from './Category'
import { IUser } from './User'

export enum AuctionStatus {
  DRAFT = 'DRAFT',
  SCHEDULED = 'SCHEDULED',
  ACTIVE = 'ACTIVE',
  ENDED = 'ENDED',
  CANCELLED = 'CANCELLED',
  SOLD = 'SOLD'
}

export enum AuctionType {
  STANDARD = 'STANDARD',
  RESERVE = 'RESERVE',
  BUY_NOW = 'BUY_NOW',
  DUTCH = 'DUTCH'
}

export enum BidStatus {
  PENDING = 'PENDING',
  ACCEPTED = 'ACCEPTED',
  REJECTED = 'REJECTED',
  OUTBID = 'OUTBID'
}

export interface IAuctionItem extends BaseEntity {
  title: string
  description: string
  shortDescription?: string
  category: ICategory
  seller: IUser
  images: string[]
  condition: string
  startingPrice: number
  reservePrice?: number
  buyNowPrice?: number
  currentPrice: number
  bidIncrement: number
  startTime: Date
  endTime: Date
  status: AuctionStatus
  type: AuctionType
  totalBids: number
  totalWatchers: number
  isWatched?: boolean
  highestBidder?: IUser
  isReserveMet: boolean
  timeRemaining?: string
  location?: string
  shippingOptions?: any[]
  returnPolicy?: string
  tags?: string[]
  featured: boolean
  promoted: boolean
}

export interface IAuctionSearch {
  query?: string
  categoryId?: string | number
  minPrice?: number
  maxPrice?: number
  condition?: string
  status?: AuctionStatus[]
  location?: string
  sortBy?: 'endTime' | 'currentPrice' | 'totalBids' | 'created'
  sortOrder?: 'asc' | 'desc'
  page?: number
  limit?: number
}

/**
 * Auction Class
 * Represents an auction item with bidding functionality
 */
export class Auction implements IAuctionItem {
  public id: string | number
  public title: string
  public description: string
  public shortDescription?: string
  public category: ICategory
  public seller: IUser
  public images: string[]
  public condition: string
  public startingPrice: number
  public reservePrice?: number
  public buyNowPrice?: number
  public currentPrice: number
  public bidIncrement: number
  public startTime: Date
  public endTime: Date
  public status: AuctionStatus
  public type: AuctionType
  public totalBids: number
  public totalWatchers: number
  public isWatched?: boolean
  public highestBidder?: IUser
  public isReserveMet: boolean
  public timeRemaining?: string
  public location?: string
  public shippingOptions?: any[]
  public returnPolicy?: string
  public tags?: string[]
  public featured: boolean
  public promoted: boolean
  public createdAt: Date
  public updatedAt: Date

  constructor(data: Partial<IAuctionItem> = {}) {
    this.id = data.id || ''
    this.title = data.title || ''
    this.description = data.description || ''
    this.shortDescription = data.shortDescription
    this.category = data.category as ICategory
    this.seller = data.seller as IUser
    this.images = data.images || []
    this.condition = data.condition || ''
    this.startingPrice = data.startingPrice || 0
    this.reservePrice = data.reservePrice
    this.buyNowPrice = data.buyNowPrice
    this.currentPrice = data.currentPrice || data.startingPrice || 0
    this.bidIncrement = data.bidIncrement || 1
    this.startTime = data.startTime || new Date()
    this.endTime = data.endTime || new Date()
    this.status = data.status || AuctionStatus.DRAFT
    this.type = data.type || AuctionType.STANDARD
    this.totalBids = data.totalBids || 0
    this.totalWatchers = data.totalWatchers || 0
    this.isWatched = data.isWatched || false
    this.highestBidder = data.highestBidder
    this.isReserveMet = data.isReserveMet || false
    this.timeRemaining = data.timeRemaining
    this.location = data.location
    this.shippingOptions = data.shippingOptions || []
    this.returnPolicy = data.returnPolicy
    this.tags = data.tags || []
    this.featured = data.featured || false
    this.promoted = data.promoted || false
    this.createdAt = data.createdAt || new Date()
    this.updatedAt = data.updatedAt || new Date()
  }

  /**
   * Factory method to create Auction from API response
   */
  static fromApiResponse(data: any): Auction {
    return new Auction({
      id: data.id,
      title: data.title,
      description: data.description,
      shortDescription: data.shortDescription || data.short_description,
      category: data.category,
      seller: data.seller,
      images: data.images || [],
      condition: data.condition,
      startingPrice: data.startingPrice || data.starting_price,
      reservePrice: data.reservePrice || data.reserve_price,
      buyNowPrice: data.buyNowPrice || data.buy_now_price,
      currentPrice: data.currentPrice || data.current_price,
      bidIncrement: data.bidIncrement || data.bid_increment || 1,
      startTime: new Date(data.startTime || data.start_time),
      endTime: new Date(data.endTime || data.end_time),
      status: data.status || AuctionStatus.DRAFT,
      type: data.type || AuctionType.STANDARD,
      totalBids: data.totalBids || data.total_bids || 0,
      totalWatchers: data.totalWatchers || data.total_watchers || 0,
      isWatched: data.isWatched || data.is_watched || false,
      highestBidder: data.highestBidder || data.highest_bidder,
      isReserveMet: data.isReserveMet || data.is_reserve_met || false,
      timeRemaining: data.timeRemaining || data.time_remaining,
      location: data.location,
      shippingOptions: data.shippingOptions || data.shipping_options || [],
      returnPolicy: data.returnPolicy || data.return_policy,
      tags: data.tags || [],
      featured: data.featured || false,
      promoted: data.promoted || false,
      createdAt: data.createdAt ? new Date(data.createdAt) : new Date(),
      updatedAt: data.updatedAt ? new Date(data.updatedAt) : new Date()
    })
  }

  /**
   * Check if auction is currently active
   */
  isActive(): boolean {
    const now = new Date()
    return this.status === AuctionStatus.ACTIVE && 
           now >= this.startTime && 
           now <= this.endTime
  }

  /**
   * Check if auction has ended
   */
  hasEnded(): boolean {
    return new Date() > this.endTime || this.status === AuctionStatus.ENDED
  }

  /**
   * Check if auction hasn't started yet
   */
  isPending(): boolean {
    return new Date() < this.startTime && this.status === AuctionStatus.SCHEDULED
  }

  /**
   * Calculate time remaining
   */
  getTimeRemaining(): string {
    if (this.hasEnded()) return 'Ended'
    
    const now = new Date()
    const remaining = this.endTime.getTime() - now.getTime()
    
    if (remaining <= 0) return 'Ended'
    
    const days = Math.floor(remaining / (1000 * 60 * 60 * 24))
    const hours = Math.floor((remaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60))
    
    if (days > 0) {
      return `${days}d ${hours}h`
    } else if (hours > 0) {
      return `${hours}h ${minutes}m`
    } else {
      return `${minutes}m`
    }
  }

  /**
   * Check if reserve price is met
   */
  checkReserveMet(): boolean {
    if (!this.reservePrice) return true
    return this.currentPrice >= this.reservePrice
  }

  /**
   * Place a bid on this auction
   */
  placeBid(amount: number, bidder: IUser): boolean {
    if (!this.isActive()) return false
    if (amount <= this.currentPrice) return false
    if (amount < this.currentPrice + this.bidIncrement) return false
    
    this.currentPrice = amount
    this.highestBidder = bidder
    this.totalBids += 1
    this.isReserveMet = this.checkReserveMet()
    this.updatedAt = new Date()
    
    return true
  }

  /**
   * Format current price as currency
   */
  getFormattedCurrentPrice(): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(this.currentPrice)
  }

  /**
   * Get URL slug for this auction
   */
  getUrlSlug(): string {
    return this.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
  }

  /**
   * Clone the auction
   */
  clone(): Auction {
    return new Auction(this)
  }
}
