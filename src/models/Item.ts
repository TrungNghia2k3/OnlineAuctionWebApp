/**
 * Item and AuctionItem-related interfaces and types
 */

import { BaseEntity } from '../types/common'

export enum ItemStatus {
  DRAFT = 'DRAFT',
  ACTIVE = 'ACTIVE',
  ENDED = 'ENDED',
  CANCELLED = 'CANCELLED',
  SOLD = 'SOLD'
}

export enum ItemCondition {
  NEW = 'NEW',
  LIKE_NEW = 'LIKE_NEW',
  EXCELLENT = 'EXCELLENT',
  VERY_GOOD = 'VERY_GOOD',
  GOOD = 'GOOD',
  FAIR = 'FAIR',
  POOR = 'POOR'
}

export enum ImageType {
  MAIN = 'MAIN',
  ADDITIONAL = 'ADDITIONAL',
  THUMBNAIL = 'THUMBNAIL'
}

export interface IItem extends BaseEntity {
  title: string
  image?: string | null
  currentBid: number
  timeLeft: string
  category: string
  bidCount: number
  description?: string
  startingBid?: number
  reservePrice?: number
  seller?: string
  condition?: string
  dimensions?: string
  weight?: string
  location?: string
  shippingCost?: number
  featured?: boolean
  // New fields from API
  name?: string
  imageUrl?: string | null
  startingPrice?: number
  minIncreasePrice?: number
  auctionStartDate?: number[]
  auctionEndDate?: number[]
  status?: string
  categoryObject?: {
    id: number
    name: string
    description: string
    active: boolean
  }
  sellerObject?: {
    id: string
    username: string
    firstName: string
    lastName: string
    dob: number[]
    roles: any[]
  }
  images?: Array<{
    id: number
    imageUrl: string
    type: string
  }>
}

/**
 * Item Class
 * Represents an auction item with all its properties and methods
 */
export class Item implements IItem {
  public id: number
  public title: string
  public image?: string | null
  public currentBid: number
  public timeLeft: string
  public category: string
  public bidCount: number
  public description?: string
  public startingBid?: number
  public reservePrice?: number
  public seller?: string
  public condition?: string
  public dimensions?: string
  public weight?: string
  public location?: string
  public shippingCost?: number
  public featured?: boolean
  public createdAt: Date
  public updatedAt: Date
  // New fields from API
  public name?: string
  public imageUrl?: string | null
  public startingPrice?: number
  public minIncreasePrice?: number
  public auctionStartDate?: number[]
  public auctionEndDate?: number[]
  public status?: string
  public categoryObject?: {
    id: number
    name: string
    description: string
    active: boolean
  }
  public sellerObject?: {
    id: string
    username: string
    firstName: string
    lastName: string
    dob: number[]
    roles: any[]
  }
  public images?: Array<{
    id: number
    imageUrl: string
    type: string
  }>

  constructor(data: Partial<IItem> = {}) {
    this.id = typeof data.id === 'number' ? data.id : 0
    this.title = data.title || data.name || ''
    this.image = data.image || data.imageUrl || (data.images?.find(img => img.type === 'MAIN')?.imageUrl) || null
    this.currentBid = data.currentBid || data.startingPrice || 0
    this.timeLeft = data.timeLeft || Item.calculateTimeLeft(data.auctionEndDate)
    this.category = data.category || data.categoryObject?.name || ''
    this.bidCount = data.bidCount || 0
    this.description = data.description
    this.startingBid = data.startingBid || data.startingPrice
    this.reservePrice = data.reservePrice
    this.seller = data.seller || Item.getSellerName(data.sellerObject)
    this.condition = data.condition
    this.dimensions = data.dimensions
    this.weight = data.weight
    this.location = data.location
    this.shippingCost = data.shippingCost
    this.featured = data.featured || false
    this.createdAt = data.createdAt || new Date()
    this.updatedAt = data.updatedAt || new Date()
    // New API fields
    this.name = data.name
    this.imageUrl = data.imageUrl
    this.startingPrice = data.startingPrice
    this.minIncreasePrice = data.minIncreasePrice
    this.auctionStartDate = data.auctionStartDate
    this.auctionEndDate = data.auctionEndDate
    this.status = data.status
    this.categoryObject = data.categoryObject
    this.sellerObject = data.sellerObject
    this.images = data.images
  }

  /**
   * Factory method to create Item from API response
   */
  static fromApiResponse(data: any): Item {
    return new Item({
      id: data.id,
      title: data.title || data.name,
      image: data.image || data.imageUrl,
      currentBid: data.currentBidPrice,
      timeLeft: data.timeLeft || data.time_left,
      category: data.category || data.categoryObject?.name,
      bidCount: data.bidCount || data.bid_count || 0,
      description: data.description,
      startingBid: data.startingBid || data.starting_bid || data.startingPrice,
      reservePrice: data.reservePrice || data.reserve_price,
      seller: typeof data.seller === 'string' ? data.seller : undefined, // Let constructor handle object sellers
      condition: data.condition,
      dimensions: data.dimensions,
      weight: data.weight,
      location: data.location,
      shippingCost: data.shippingCost || data.shipping_cost,
      featured: data.featured,
      createdAt: data.createdAt ? new Date(data.createdAt) : new Date(),
      updatedAt: data.updatedAt ? new Date(data.updatedAt) : new Date(),
      // API specific fields
      name: data.name,
      imageUrl: data.imageUrl,
      startingPrice: data.startingPrice,
      minIncreasePrice: data.minIncreasePrice,
      auctionStartDate: data.auctionStartDate,
      auctionEndDate: data.auctionEndDate,
      status: data.status,
      categoryObject: data.category,
      sellerObject: data.seller,
      images: data.images
    })
  }

  /**
   * Helper method to calculate time left from auction end date
   */
  static calculateTimeLeft(auctionEndDate?: number[]): string {
    if (!auctionEndDate || auctionEndDate.length < 6) {
      return 'Unknown'
    }

    try {
      // Convert array [year, month, day, hour, minute, second] to Date
      const endDate = new Date(
        auctionEndDate[0], // year
        auctionEndDate[1] - 1, // month (0-based)
        auctionEndDate[2], // day
        auctionEndDate[3] || 0, // hour
        auctionEndDate[4] || 0, // minute
        auctionEndDate[5] || 0  // second
      )

      const now = new Date()
      const timeDiff = endDate.getTime() - now.getTime()

      if (timeDiff <= 0) {
        return 'Ended'
      }

      const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24))
      const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
      const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60))

      if (days > 0) {
        return `${days}d ${hours}h`
      } else if (hours > 0) {
        return `${hours}h ${minutes}m`
      } else {
        return `${minutes}m`
      }
    } catch (error) {
      return 'Unknown'
    }
  }

  /**
   * Helper method to get seller name from seller object
   */
  static getSellerName(sellerObject?: any): string {
    if (!sellerObject) return 'Unknown Seller'
    
    if (sellerObject.firstName && sellerObject.lastName) {
      return `${sellerObject.firstName} ${sellerObject.lastName}`
    }
    
    if (sellerObject.username) {
      return sellerObject.username
    }
    
    return 'Unknown Seller'
  }

  /**
   * Factory method to create multiple Items from API response array
   */
  static fromApiResponseArray(dataArray: any[]): Item[] {
    return dataArray.map(data => Item.fromApiResponse(data))
  }

  /**
   * Convert Item to API format
   */
  toApiFormat(): Record<string, any> {
    return {
      id: this.id,
      title: this.title,
      image: this.image,
      current_bid: this.currentBid,
      time_left: this.timeLeft,
      category: this.category,
      bid_count: this.bidCount,
      description: this.description,
      starting_bid: this.startingBid,
      reserve_price: this.reservePrice,
      seller: this.seller,
      condition: this.condition,
      dimensions: this.dimensions,
      weight: this.weight,
      location: this.location,
      shipping_cost: this.shippingCost,
      featured: this.featured,
      created_at: this.createdAt.toISOString(),
      updated_at: this.updatedAt.toISOString()
    }
  }

  /**
   * Format currency amount
   */
  getFormattedCurrentBid(): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(this.currentBid).replace('€', '€')
  }

  /**
   * Check if item has reserve price
   */
  hasReserve(): boolean {
    return Boolean(this.reservePrice && this.reservePrice > 0)
  }

  /**
   * Check if reserve price is met
   */
  isReserveMet(): boolean {
    if (!this.hasReserve()) return true
    return this.currentBid >= (this.reservePrice || 0)
  }

  /**
   * Get time left in a more readable format
   */
  getReadableTimeLeft(): string {
    return this.timeLeft
  }

  /**
   * Check if item is ending soon (less than 24 hours)
   */
  isEndingSoon(): boolean {
    // Simple check - in real implementation you'd parse the timeLeft properly
    return this.timeLeft.includes('h') && !this.timeLeft.includes('d')
  }

  /**
   * Get item URL slug
   */
  getUrlSlug(): string {
    return this.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
  }

  /**
   * Update the current bid
   */
  updateCurrentBid(newBid: number): void {
    if (newBid > this.currentBid) {
      this.currentBid = newBid
      this.bidCount += 1
      this.updatedAt = new Date()
    }
  }

  /**
   * Clone the item
   */
  clone(): Item {
    return new Item({
      id: this.id,
      title: this.title,
      image: this.image,
      currentBid: this.currentBid,
      timeLeft: this.timeLeft,
      category: this.category,
      bidCount: this.bidCount,
      description: this.description,
      startingBid: this.startingBid,
      reservePrice: this.reservePrice,
      seller: this.seller,
      condition: this.condition,
      dimensions: this.dimensions,
      weight: this.weight,
      location: this.location,
      shippingCost: this.shippingCost,
      featured: this.featured,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    })
  }
}
