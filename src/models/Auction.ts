/**
 * Auction and Bid-related interfaces and types
 */

import { BaseEntity } from '../types/common'
import { IUser } from './User'
import { ICategory } from './Category'

export enum AuctionStatus {
  DRAFT = 'DRAFT',
  SCHEDULED = 'SCHEDULED',
  ACTIVE = 'ACTIVE',
  ENDED = 'ENDED',
  CANCELLED = 'CANCELLED',
  SUSPENDED = 'SUSPENDED'
}

export enum BidStatus {
  ACTIVE = 'ACTIVE',
  OUTBID = 'OUTBID',
  WINNING = 'WINNING',
  WON = 'WON',
  LOST = 'LOST',
  CANCELLED = 'CANCELLED'
}

export enum AuctionType {
  STANDARD = 'STANDARD',
  RESERVE = 'RESERVE',
  BUY_NOW = 'BUY_NOW',
  DUTCH = 'DUTCH'
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
  location?: string
  shippingInfo?: string
  returnPolicy?: string
  tags?: string[]
  specifications?: Record<string, any>
  metadata?: Record<string, any>
}

export interface IBid extends BaseEntity {
  auctionId: string | number
  bidder: IUser
  amount: number
  maxAmount?: number
  status: BidStatus
  isAutomatic: boolean
  isWinning: boolean
  timestamp: Date
  ipAddress?: string
}

export interface IWatchlist extends BaseEntity {
  userId: string | number
  auctionId: string | number
  auction?: IAuctionItem
  notifyOnBid: boolean
  notifyBeforeEnd: boolean
}

export interface IBidHistory {
  bid: IBid
  previousPrice: number
  priceIncrease: number
}

export interface IAuctionSearch {
  query?: string
  categoryId?: string | number
  minPrice?: number
  maxPrice?: number
  location?: string
  condition?: string
  status?: AuctionStatus[]
  endingWithin?: number // hours
  sortBy?: 'price' | 'endTime' | 'startTime' | 'bids' | 'relevance'
  sortOrder?: 'asc' | 'desc'
}

export interface IAuctionCreateRequest {
  title: string
  description: string
  categoryId: string | number
  images: File[] | string[]
  condition: string
  startingPrice: number
  reservePrice?: number
  buyNowPrice?: number
  bidIncrement?: number
  duration: number // in hours
  startTime?: Date
  location?: string
  shippingInfo?: string
  returnPolicy?: string
  tags?: string[]
  specifications?: Record<string, any>
}

export interface IBidRequest {
  auctionId: string | number
  amount: number
  maxAmount?: number
}

/**
 * Auction Item model class with methods
 */
export class AuctionItem implements IAuctionItem {
  id: string | number
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
  location?: string
  shippingInfo?: string
  returnPolicy?: string
  tags?: string[]
  specifications?: Record<string, any>
  metadata?: Record<string, any>
  createdAt: Date
  updatedAt: Date

  constructor(auctionData: Partial<IAuctionItem> & { category: ICategory; seller: IUser }) {
    this.id = auctionData.id || ''
    this.title = auctionData.title || ''
    this.description = auctionData.description || ''
    this.shortDescription = auctionData.shortDescription
    this.category = auctionData.category
    this.seller = auctionData.seller
    this.images = auctionData.images || []
    this.condition = auctionData.condition || ''
    this.startingPrice = auctionData.startingPrice || 0
    this.reservePrice = auctionData.reservePrice
    this.buyNowPrice = auctionData.buyNowPrice
    this.currentPrice = auctionData.currentPrice || auctionData.startingPrice || 0
    this.bidIncrement = auctionData.bidIncrement || 1
    this.startTime = auctionData.startTime || new Date()
    this.endTime = auctionData.endTime || new Date()
    this.status = auctionData.status || AuctionStatus.DRAFT
    this.type = auctionData.type || AuctionType.STANDARD
    this.totalBids = auctionData.totalBids || 0
    this.totalWatchers = auctionData.totalWatchers || 0
    this.isWatched = auctionData.isWatched
    this.location = auctionData.location
    this.shippingInfo = auctionData.shippingInfo
    this.returnPolicy = auctionData.returnPolicy
    this.tags = auctionData.tags
    this.specifications = auctionData.specifications
    this.metadata = auctionData.metadata
    this.createdAt = auctionData.createdAt || new Date()
    this.updatedAt = auctionData.updatedAt || new Date()
  }

  isActive(): boolean {
    return this.status === AuctionStatus.ACTIVE && 
           new Date() >= this.startTime && 
           new Date() <= this.endTime
  }

  isEnded(): boolean {
    return this.status === AuctionStatus.ENDED || new Date() > this.endTime
  }

  isScheduled(): boolean {
    return this.status === AuctionStatus.SCHEDULED && new Date() < this.startTime
  }

  hasReserve(): boolean {
    return !!this.reservePrice && this.reservePrice > 0
  }

  isReserveMet(): boolean {
    return !this.hasReserve() || this.currentPrice >= (this.reservePrice || 0)
  }

  hasBuyNow(): boolean {
    return !!this.buyNowPrice && this.buyNowPrice > 0
  }

  getTimeRemaining(): { days: number; hours: number; minutes: number; seconds: number } | null {
    if (this.isEnded()) return null

    const now = new Date().getTime()
    const endTime = this.endTime.getTime()
    const difference = endTime - now

    if (difference <= 0) return null

    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
      minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
      seconds: Math.floor((difference % (1000 * 60)) / 1000)
    }
  }

  getNextBidAmount(): number {
    return this.currentPrice + this.bidIncrement
  }

  getPrimaryImage(): string {
    return this.images[0] || '/images/placeholder-item.jpg'
  }

  getShortDescription(): string {
    if (this.shortDescription) return this.shortDescription
    return this.description.length > 100 
      ? this.description.substring(0, 100) + '...'
      : this.description
  }

  canBid(): boolean {
    return this.isActive() && this.status === AuctionStatus.ACTIVE
  }

  canBuyNow(): boolean {
    return this.canBid() && this.hasBuyNow()
  }

  toJSON(): IAuctionItem {
    return {
      id: this.id,
      title: this.title,
      description: this.description,
      shortDescription: this.shortDescription,
      category: this.category,
      seller: this.seller,
      images: this.images,
      condition: this.condition,
      startingPrice: this.startingPrice,
      reservePrice: this.reservePrice,
      buyNowPrice: this.buyNowPrice,
      currentPrice: this.currentPrice,
      bidIncrement: this.bidIncrement,
      startTime: this.startTime,
      endTime: this.endTime,
      status: this.status,
      type: this.type,
      totalBids: this.totalBids,
      totalWatchers: this.totalWatchers,
      isWatched: this.isWatched,
      location: this.location,
      shippingInfo: this.shippingInfo,
      returnPolicy: this.returnPolicy,
      tags: this.tags,
      specifications: this.specifications,
      metadata: this.metadata,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    }
  }

  static fromApiResponse(data: any): AuctionItem {
    return new AuctionItem({
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
      bidIncrement: data.bidIncrement || data.bid_increment,
      startTime: new Date(data.startTime || data.start_time),
      endTime: new Date(data.endTime || data.end_time),
      status: data.status,
      type: data.type,
      totalBids: data.totalBids || data.total_bids || 0,
      totalWatchers: data.totalWatchers || data.total_watchers || 0,
      isWatched: data.isWatched || data.is_watched,
      location: data.location,
      shippingInfo: data.shippingInfo || data.shipping_info,
      returnPolicy: data.returnPolicy || data.return_policy,
      tags: data.tags,
      specifications: data.specifications,
      metadata: data.metadata,
      createdAt: data.createdAt ? new Date(data.createdAt) : new Date(),
      updatedAt: data.updatedAt ? new Date(data.updatedAt) : new Date()
    })
  }
}

/**
 * Bid model class with methods
 */
export class Bid implements IBid {
  id: string | number
  auctionId: string | number
  bidder: IUser
  amount: number
  maxAmount?: number
  status: BidStatus
  isAutomatic: boolean
  isWinning: boolean
  timestamp: Date
  ipAddress?: string
  createdAt: Date
  updatedAt: Date

  constructor(bidData: Partial<IBid> & { bidder: IUser }) {
    this.id = bidData.id || ''
    this.auctionId = bidData.auctionId || ''
    this.bidder = bidData.bidder
    this.amount = bidData.amount || 0
    this.maxAmount = bidData.maxAmount
    this.status = bidData.status || BidStatus.ACTIVE
    this.isAutomatic = bidData.isAutomatic || false
    this.isWinning = bidData.isWinning || false
    this.timestamp = bidData.timestamp || new Date()
    this.ipAddress = bidData.ipAddress
    this.createdAt = bidData.createdAt || new Date()
    this.updatedAt = bidData.updatedAt || new Date()
  }

  isActive(): boolean {
    return this.status === BidStatus.ACTIVE || this.status === BidStatus.WINNING
  }

  isWon(): boolean {
    return this.status === BidStatus.WON
  }

  isLost(): boolean {
    return this.status === BidStatus.LOST || this.status === BidStatus.OUTBID
  }

  toJSON(): IBid {
    return {
      id: this.id,
      auctionId: this.auctionId,
      bidder: this.bidder,
      amount: this.amount,
      maxAmount: this.maxAmount,
      status: this.status,
      isAutomatic: this.isAutomatic,
      isWinning: this.isWinning,
      timestamp: this.timestamp,
      ipAddress: this.ipAddress,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    }
  }

  static fromApiResponse(data: any): Bid {
    return new Bid({
      id: data.id,
      auctionId: data.auctionId || data.auction_id,
      bidder: data.bidder,
      amount: data.amount,
      maxAmount: data.maxAmount || data.max_amount,
      status: data.status,
      isAutomatic: data.isAutomatic || data.is_automatic || false,
      isWinning: data.isWinning || data.is_winning || false,
      timestamp: new Date(data.timestamp),
      ipAddress: data.ipAddress || data.ip_address,
      createdAt: data.createdAt ? new Date(data.createdAt) : new Date(),
      updatedAt: data.updatedAt ? new Date(data.updatedAt) : new Date()
    })
  }
}
