/**
 * Core Bid Service Interfaces
 * Contains all bid-related service abstractions (separate from BidServiceInterfaces.ts)
 */

import { BaseResponse, PaginatedResponse, QueryOptions } from '@/types'
import { IBid, IBidRequest } from '@/models'

export interface IBidService {
  placeBid(bidData: IBidRequest): Promise<BaseResponse<IBid>>
  getBidsByAuction(auctionId: string | number, options?: QueryOptions): Promise<PaginatedResponse<IBid>>
  getBidsByUser(userId: string | number, options?: QueryOptions): Promise<PaginatedResponse<IBid>>
  getWinningBids(userId: string | number, options?: QueryOptions): Promise<PaginatedResponse<IBid>>
  cancelBid(bidId: string | number): Promise<BaseResponse<void>>
  getMaxBid(auctionId: string | number, userId: string | number): Promise<BaseResponse<IBid>>
}
