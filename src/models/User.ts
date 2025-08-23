/**
 * User and User-related interfaces and types
 */

import { BaseEntity } from '../types/common'

export enum UserRole {
  GUEST = 0,
  USER = 1,
  ADMIN = 2
}

export enum UserStatus {
    INACTIVE = 'INACTIVE',
    ACTIVE = 'ACTIVE',
    SUSPENDED = 'SUSPENDED',
    BANNED = 'BANNED'
}

export interface IUser extends BaseEntity {
  username: string
  email: string
  firstName?: string
  lastName?: string
  fullName?: string
  avatar?: string
  phone?: string
  address?: string
  dateOfBirth?: Date
  role: UserRole
  roleString: string
  status: UserStatus
  emailVerified: boolean
  phoneVerified: boolean
  lastLoginAt?: Date
  profileCompleteness: number
}

export interface IUserProfile extends BaseEntity {
  user: IUser
  bio?: string
  location?: string
  website?: string
  socialMedia?: Record<string, string>
  preferences?: Record<string, any>
  lastActive?: Date
}

export interface ILoginCredentials {
  username: string
  password: string
  rememberMe?: boolean
}

export interface IRegisterData {
  username: string
  email: string
  password: string
  confirmPassword: string
  firstName?: string
  lastName?: string
  agreeToTerms: boolean
}

export interface IForgotPasswordRequest {
  email: string
}

export interface IAuthToken {
  accessToken: string
  tokenType: string
  expiresIn: number
  expiresAt: Date
  scope: string[]
  refreshToken?: string
  user?: IUser
}

/**
 * User model class with methods
 */
export class User implements IUser {
  id: string | number
  username: string
  email: string
  firstName?: string
  lastName?: string
  avatar?: string
  phone?: string
  address?: string
  dateOfBirth?: Date
  role: UserRole
  roleString: string
  status: UserStatus
  emailVerified: boolean
  phoneVerified: boolean
  lastLoginAt?: Date
  profileCompleteness: number
  createdAt: Date
  updatedAt: Date

  constructor(userData: Partial<IUser>) {
    this.id = userData.id || ''
    this.username = userData.username || ''
    this.email = userData.email || ''
    this.firstName = userData.firstName
    this.lastName = userData.lastName
    this.avatar = userData.avatar
    this.phone = userData.phone
    this.address = userData.address
    this.dateOfBirth = userData.dateOfBirth
    this.role = userData.role || UserRole.GUEST
    this.roleString = userData.roleString || ''
    this.status = userData.status || UserStatus.INACTIVE
    this.emailVerified = userData.emailVerified || false
    this.phoneVerified = userData.phoneVerified || false
    this.lastLoginAt = userData.lastLoginAt
    this.profileCompleteness = userData.profileCompleteness || 0
    this.createdAt = userData.createdAt || new Date()
    this.updatedAt = userData.updatedAt || new Date()
  }

  get fullName(): string {
    if (this.firstName && this.lastName) {
      return `${this.firstName} ${this.lastName}`
    }
    return this.firstName || this.lastName || this.username
  }

  isAdmin(): boolean {
    return this.role === UserRole.ADMIN
  }

  isUser(): boolean {
    return this.role >= UserRole.USER
  }

  isActive(): boolean {
    return this.status === UserStatus.ACTIVE
  }

  canBid(): boolean {
    return this.isUser() && this.isActive() && this.emailVerified
  }

  canSell(): boolean {
    return this.canBid() && this.profileCompleteness >= 70
  }

  updateProfile(updates: Partial<IUser>): void {
    Object.assign(this, updates)
    this.updatedAt = new Date()
    this.updateProfileCompleteness()
  }

  private updateProfileCompleteness(): void {
    let completeness = 0
    const fields = [
      'username', 'email', 'firstName', 'lastName', 
      'phone', 'address', 'avatar'
    ]
    
    fields.forEach(field => {
      if (this[field as keyof this]) completeness += 10
    })
    
    if (this.emailVerified) completeness += 15
    if (this.phoneVerified) completeness += 15
    
    this.profileCompleteness = Math.min(completeness, 100)
  }

  static fromApiResponse(data: any): User {
    return new User({
      id: data.id,
      username: data.username,
      email: data.email,
      firstName: data.firstName || data.first_name,
      lastName: data.lastName || data.last_name,
      avatar: data.avatar || data.profilePicture,
      phone: data.phone,
      address: data.address,
      dateOfBirth: data.dateOfBirth ? new Date(data.dateOfBirth) : undefined,
      role: data.role,
      roleString: data.roleString || data.role_string,
      status: data.status,
      emailVerified: data.emailVerified || data.email_verified || false,
      phoneVerified: data.phoneVerified || data.phone_verified || false,
      lastLoginAt: data.lastLoginAt ? new Date(data.lastLoginAt) : undefined,
      profileCompleteness: data.profileCompleteness || 0,
      createdAt: data.createdAt ? new Date(data.createdAt) : new Date(),
      updatedAt: data.updatedAt ? new Date(data.updatedAt) : new Date()
    })
  }

  toApiFormat(): Record<string, any> {
    return {
      id: this.id,
      username: this.username,
      email: this.email,
      firstName: this.firstName,
      lastName: this.lastName,
      avatar: this.avatar,
      phone: this.phone,
      address: this.address,
      dateOfBirth: this.dateOfBirth?.toISOString(),
      role: this.role,
      roleString: this.roleString,
      status: this.status,
      emailVerified: this.emailVerified,
      phoneVerified: this.phoneVerified,
      lastLoginAt: this.lastLoginAt?.toISOString(),
      profileCompleteness: this.profileCompleteness,
      createdAt: this.createdAt.toISOString(),
      updatedAt: this.updatedAt.toISOString()
    }
  }

  toJSON(): Record<string, any> {
    return this.toApiFormat()
  }

  clone(): User {
    return new User(this)
  }
}
