/**
 * Category and Category-related interfaces and types
 */

import { BaseEntity } from '../types/common'

export enum CategoryStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  ARCHIVED = 'ARCHIVED'
}

export interface ICategory extends BaseEntity {
  name: string
  description?: string
  slug: string
  parentId?: string | number
  level: number
  image?: string
  icon?: string
  color?: string
  status: CategoryStatus
  sortOrder: number
  itemCount: number
  isLeaf: boolean
  path: string
  metadata?: Record<string, any>
}

export interface ICategoryTree extends ICategory {
  children: ICategoryTree[]
}

export interface ICategoryBreadcrumb {
  id: string | number
  name: string
  slug: string
  level: number
}

/**
 * Category Class
 * Represents a category with its hierarchy and metadata
 */
export class Category implements ICategory {
  public id: string | number
  public name: string
  public description?: string
  public slug: string
  public parentId?: string | number
  public level: number
  public image?: string
  public icon?: string
  public color?: string
  public status: CategoryStatus
  public sortOrder: number
  public itemCount: number
  public isLeaf: boolean
  public path: string
  public metadata?: Record<string, any>
  public createdAt: Date
  public updatedAt: Date

  constructor(data: Partial<ICategory> = {}) {
    this.id = data.id || ''
    this.name = data.name || ''
    this.description = data.description
    this.slug = data.slug || Category.generateSlug(data.name || '')
    this.parentId = data.parentId
    this.level = data.level || 0
    this.image = data.image
    this.icon = data.icon
    this.color = data.color
    this.status = data.status || CategoryStatus.ACTIVE
    this.sortOrder = data.sortOrder || 0
    this.itemCount = data.itemCount || 0
    this.isLeaf = data.isLeaf || true
    this.path = data.path || ''
    this.metadata = data.metadata
    this.createdAt = data.createdAt || new Date()
    this.updatedAt = data.updatedAt || new Date()
  }

  /**
   * Generate URL-friendly slug from name
   */
  static generateSlug(name: string): string {
    return name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '')
  }

  /**
   * Factory method to create Category from API response
   */
  static fromApiResponse(data: any): Category {
    return new Category({
      id: data.id,
      name: data.name,
      description: data.description,
      slug: data.slug,
      parentId: data.parentId || data.parent_id,
      level: data.level || 0,
      image: data.image,
      icon: data.icon,
      color: data.color,
      status: data.status || CategoryStatus.ACTIVE,
      sortOrder: data.sortOrder || data.sort_order || 0,
      itemCount: data.itemCount || data.item_count || 0,
      isLeaf: data.isLeaf !== undefined ? data.isLeaf : data.is_leaf !== undefined ? data.is_leaf : true,
      path: data.path || '',
      metadata: data.metadata,
      createdAt: data.createdAt ? new Date(data.createdAt) : new Date(),
      updatedAt: data.updatedAt ? new Date(data.updatedAt) : new Date()
    })
  }

  /**
   * Factory method to create multiple Categories from API response array
   */
  static fromApiResponseArray(dataArray: any[]): Category[] {
    return dataArray.map(data => Category.fromApiResponse(data))
  }

  /**
   * Convert Category to API format
   */
  toApiFormat(): Record<string, any> {
    return {
      id: this.id,
      name: this.name,
      description: this.description,
      slug: this.slug,
      parent_id: this.parentId,
      level: this.level,
      image: this.image,
      icon: this.icon,
      color: this.color,
      status: this.status,
      sort_order: this.sortOrder,
      item_count: this.itemCount,
      is_leaf: this.isLeaf,
      path: this.path,
      metadata: this.metadata,
      created_at: this.createdAt.toISOString(),
      updated_at: this.updatedAt.toISOString()
    }
  }

  /**
   * Check if this category is a root category
   */
  isRoot(): boolean {
    return !this.parentId && this.level === 0
  }

  /**
   * Check if this category is active
   */
  isActive(): boolean {
    return this.status === CategoryStatus.ACTIVE
  }

  /**
   * Get the breadcrumb path for this category
   */
  getBreadcrumbs(): ICategoryBreadcrumb[] {
    // This would need to be implemented with parent category data
    return [
      {
        id: this.id,
        name: this.name,
        slug: this.slug,
        level: this.level
      }
    ]
  }

  /**
   * Update the item count
   */
  updateItemCount(count: number): void {
    this.itemCount = count
    this.updatedAt = new Date()
  }

  /**
   * Update category status
   */
  updateStatus(status: CategoryStatus): void {
    this.status = status
    this.updatedAt = new Date()
  }

  /**
   * Clone the category
   */
  clone(): Category {
    return new Category({
      id: this.id,
      name: this.name,
      description: this.description,
      slug: this.slug,
      parentId: this.parentId,
      level: this.level,
      image: this.image,
      icon: this.icon,
      color: this.color,
      status: this.status,
      sortOrder: this.sortOrder,
      itemCount: this.itemCount,
      isLeaf: this.isLeaf,
      path: this.path,
      metadata: this.metadata,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    })
  }
}
