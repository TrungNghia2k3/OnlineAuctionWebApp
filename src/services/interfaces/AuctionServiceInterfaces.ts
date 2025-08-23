/**
 * Auction Service Interfaces
 * Contains all auction-related service abstractions
 */

import { BaseResponse, PaginatedResponse, QueryOptions } from '@/types'
import { 
  IAuctionItem, 
  IAuctionCreateRequest, 
  IAuctionSearch 
} from '@/models'

export interface IAuctionService {
  getAllAuctions(options?: QueryOptions): Promise<PaginatedResponse<IAuctionItem>>
  getAuctionById(id: string | number): Promise<BaseResponse<IAuctionItem>>
  searchAuctions(searchParams: IAuctionSearch, options?: QueryOptions): Promise<PaginatedResponse<IAuctionItem>>
  createAuction(auctionData: IAuctionCreateRequest): Promise<BaseResponse<IAuctionItem>>
  updateAuction(id: string | number, auctionData: Partial<IAuctionCreateRequest>): Promise<BaseResponse<IAuctionItem>>
  deleteAuction(id: string | number): Promise<BaseResponse<void>>
  getAuctionsByUser(userId: string | number, options?: QueryOptions): Promise<PaginatedResponse<IAuctionItem>>
  getWatchedAuctions(userId: string | number, options?: QueryOptions): Promise<PaginatedResponse<IAuctionItem>>
  addToWatchlist(userId: string | number, auctionId: string | number): Promise<BaseResponse<void>>
  removeFromWatchlist(userId: string | number, auctionId: string | number): Promise<BaseResponse<void>>
}
