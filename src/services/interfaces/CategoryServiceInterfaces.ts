/**
 * Category Service Interfaces
 * Contains all category-related service abstractions
 */

import { BaseResponse, PaginatedResponse, QueryOptions } from '@/types'
import { 
  ICategory, 
  ICategoryCreateRequest, 
  ICategoryUpdateRequest 
} from '@/models'

export interface ICategoryService {
  getAllCategories(options?: QueryOptions): Promise<PaginatedResponse<ICategory>>
  getCategoryById(id: string | number): Promise<BaseResponse<ICategory>>
  getCategoryTree(): Promise<BaseResponse<ICategory[]>>
  createCategory(categoryData: ICategoryCreateRequest): Promise<BaseResponse<ICategory>>
  updateCategory(id: string | number, categoryData: ICategoryUpdateRequest): Promise<BaseResponse<ICategory>>
  deleteCategory(id: string | number): Promise<BaseResponse<void>>
  getCategoryBreadcrumbs(id: string | number): Promise<BaseResponse<ICategory[]>>
}
