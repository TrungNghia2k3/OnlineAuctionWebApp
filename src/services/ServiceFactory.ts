/**
 * Service Factory Implementation
 * Follows Factory Pattern and Dependency Injection
 */

import { 
  IAuthService, 
  ICategoryService, 
  IAuctionService, 
  IBidService, 
  INotificationService, 
  IUserService, 
  IFileService,
  IWebSocketService 
} from './interfaces'
import { ApiAuthService } from './AuthService'
import { getWebSocketService } from './WebSocketService'
// import { MockAuthService } from './MockAuthService' // Commented out - using real API
// Import other concrete implementations when they're created
// import { ApiCategoryService } from './CategoryService'
// import { ApiAuctionService } from './AuctionService'
// import { ApiBidService } from './BidService'
// import { ApiNotificationService } from './NotificationService'
// import { ApiUserService } from './UserService'
// import { ApiFileService } from './FileService'

/**
 * Service Registry
 * Centralizes service creation and management
 */
class ServiceRegistry {
  private static instance: ServiceRegistry
  private services: Map<string, any> = new Map()

  private constructor() {}

  static getInstance(): ServiceRegistry {
    if (!ServiceRegistry.instance) {
      ServiceRegistry.instance = new ServiceRegistry()
    }
    return ServiceRegistry.instance
  }

  register<T>(key: string, service: T): void {
    this.services.set(key, service)
  }

  get<T>(key: string): T {
    const service = this.services.get(key)
    if (!service) {
      throw new Error(`Service ${key} not found`)
    }
    return service
  }

  has(key: string): boolean {
    return this.services.has(key)
  }
}

/**
 * Service Factory
 * Creates and manages service instances
 */
export class ServiceFactory {
  private static registry = ServiceRegistry.getInstance()

  static initialize(): void {
    // Register all services - using API services for real backend integration
    this.registry.register('auth', new ApiAuthService()) // Use real API service
    // this.registry.register('auth', new MockAuthService()) // Commented out mock service
    // this.registry.register('category', new ApiCategoryService())
    // this.registry.register('auction', new ApiAuctionService())
    // this.registry.register('bid', new ApiBidService())
    // this.registry.register('notification', new ApiNotificationService())
    // this.registry.register('user', new ApiUserService())
    // this.registry.register('file', new ApiFileService())
  }

  static getAuthService(): IAuthService {
    return this.registry.get<IAuthService>('auth')
  }

  static getCategoryService(): ICategoryService {
    if (!this.registry.has('category')) {
      throw new Error('CategoryService not implemented yet')
    }
    return this.registry.get<ICategoryService>('category')
  }

  static getAuctionService(): IAuctionService {
    if (!this.registry.has('auction')) {
      throw new Error('AuctionService not implemented yet')
    }
    return this.registry.get<IAuctionService>('auction')
  }

  static getBidService(): IBidService {
    if (!this.registry.has('bid')) {
      throw new Error('BidService not implemented yet')
    }
    return this.registry.get<IBidService>('bid')
  }

  static getNotificationService(): INotificationService {
    if (!this.registry.has('notification')) {
      throw new Error('NotificationService not implemented yet')
    }
    return this.registry.get<INotificationService>('notification')
  }

  static getUserService(): IUserService {
    if (!this.registry.has('user')) {
      throw new Error('UserService not implemented yet')
    }
    return this.registry.get<IUserService>('user')
  }

  static getFileService(): IFileService {
    if (!this.registry.has('file')) {
      throw new Error('FileService not implemented yet')
    }
    return this.registry.get<IFileService>('file')
  }

  static getWebSocketService(): IWebSocketService {
    return getWebSocketService() as IWebSocketService
  }

  // For testing purposes - allows replacing services with mocks
  static registerService<T>(key: string, service: T): void {
    this.registry.register(key, service)
  }

  static reset(): void {
    this.registry = ServiceRegistry.getInstance()
  }
}

// Initialize services on module load
ServiceFactory.initialize()
