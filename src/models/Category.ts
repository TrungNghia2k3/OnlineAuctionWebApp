/**
 * Category-related interfaces and types
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
  parent?: ICategoryTree
}

export interface ICategoryBreadcrumb {
  id: string | number
  name: string
  slug: string
  path: string
}

export interface ICategoryCreateRequest {
  name: string
  description?: string
  parentId?: string | number
  image?: string
  icon?: string
  color?: string
  status?: CategoryStatus
  sortOrder?: number
  metadata?: Record<string, any>
}

export interface ICategoryUpdateRequest extends Partial<ICategoryCreateRequest> {
  id: string | number
}

/**
 * Category model class with methods
 */
export class Category implements ICategory {
  id: string | number
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
  createdAt: Date
  updatedAt: Date

  constructor(categoryData: Partial<ICategory>) {
    this.id = categoryData.id || ''
    this.name = categoryData.name || ''
    this.description = categoryData.description
    this.slug = categoryData.slug || this.generateSlug(categoryData.name || '')
    this.parentId = categoryData.parentId
    this.level = categoryData.level || 0
    this.image = categoryData.image
    this.icon = categoryData.icon
    this.color = categoryData.color
    this.status = categoryData.status || CategoryStatus.ACTIVE
    this.sortOrder = categoryData.sortOrder || 0
    this.itemCount = categoryData.itemCount || 0
    this.isLeaf = categoryData.isLeaf || false
    this.path = categoryData.path || ''
    this.metadata = categoryData.metadata
    this.createdAt = categoryData.createdAt || new Date()
    this.updatedAt = categoryData.updatedAt || new Date()
  }

  private generateSlug(name: string): string {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim()
  }

  isActive(): boolean {
    return this.status === CategoryStatus.ACTIVE
  }

  isRoot(): boolean {
    return !this.parentId && this.level === 0
  }

  hasParent(): boolean {
    return !!this.parentId
  }

  hasChildren(): boolean {
    return !this.isLeaf
  }

  getDisplayName(): string {
    return this.name
  }

  getImageUrl(): string {
    return this.image || '/images/placeholder-category.jpg'
  }

  getBreadcrumbs(): ICategoryBreadcrumb[] {
    // This would typically be populated by the service layer
    // For now, return basic breadcrumb
    return [
      {
        id: this.id,
        name: this.name,
        slug: this.slug,
        path: this.path
      }
    ]
  }

  toJSON(): ICategory {
    return {
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
    }
  }

  static fromApiResponse(data: any): Category {
    return new Category({
      id: data.id,
      name: data.name,
      description: data.description,
      slug: data.slug,
      parentId: data.parentId || data.parent_id,
      level: data.level || 0,
      image: data.image || data.imageUrl,
      icon: data.icon,
      color: data.color,
      status: data.status || CategoryStatus.ACTIVE,
      sortOrder: data.sortOrder || data.sort_order || 0,
      itemCount: data.itemCount || data.item_count || 0,
      isLeaf: data.isLeaf || data.is_leaf || false,
      path: data.path || '',
      metadata: data.metadata,
      createdAt: data.createdAt ? new Date(data.createdAt) : new Date(),
      updatedAt: data.updatedAt ? new Date(data.updatedAt) : new Date()
    })
  }

  static buildTree(categories: Category[]): ICategoryTree[] {
    const categoryMap = new Map<string | number, ICategoryTree>()
    const rootCategories: ICategoryTree[] = []

    // Initialize all categories with children array
    categories.forEach(category => {
      categoryMap.set(category.id, {
        ...category.toJSON(),
        children: []
      })
    })

    // Build the tree structure
    categories.forEach(category => {
      const categoryNode = categoryMap.get(category.id)!
      
      if (category.parentId) {
        const parent = categoryMap.get(category.parentId)
        if (parent) {
          parent.children.push(categoryNode)
          categoryNode.parent = parent
        }
      } else {
        rootCategories.push(categoryNode)
      }
    })

    return rootCategories
  }
}
