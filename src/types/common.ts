/**
 * Base interfaces for common properties
 */

export interface BaseEntity {
  id: string | number
  createdAt: Date
  updatedAt: Date
}

export interface BaseResponse<T = any> {
  success: boolean
  message?: string
  data?: T
  error?: string
  code?: number
}

export interface PaginatedResponse<T = any> extends BaseResponse<T[]> {
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
    hasNext: boolean
    hasPrev: boolean
  }
}

export interface ApiError {
  message: string
  code: number
  details?: Record<string, any>
}

export interface SortOptions {
  field: string
  direction: 'asc' | 'desc'
}

export interface FilterOptions {
  [key: string]: any
}

export interface QueryOptions {
  page?: number
  limit?: number
  sort?: SortOptions
  filters?: FilterOptions
  search?: string
}
