/**
 * User-related interfaces and types
 */

import { BaseEntity } from '@/types'

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

export interface IUserProfile {
  bio?: string
  website?: string
  socialLinks?: {
    facebook?: string
    twitter?: string
    instagram?: string
    linkedin?: string
  }
  preferences?: {
    language: string
    currency: string
    timezone: string
    notifications: {
      email: boolean
      sms: boolean
      push: boolean
    }
  }
}

export interface IAuthToken {
  accessToken: string
  refreshToken?: string
  tokenType: string
  expiresIn: number
  expiresAt: Date
  scope: string[]
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
  phone?: string
  agreeToTerms: boolean
}

export interface IForgotPasswordRequest {
  email: string
}

export interface IResetPasswordRequest {
  token: string
  newPassword: string
  confirmPassword: string
}

export interface IChangePasswordRequest {
  currentPassword: string
  newPassword: string
  confirmPassword: string
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
      return `${this.firstName} ${this.lastName}`.trim()
    }
    return this.firstName || this.lastName || this.username
  }

  get displayName(): string {
    return this.fullName || this.username
  }

  get initials(): string {
    if (this.firstName && this.lastName) {
      return `${this.firstName[0]}${this.lastName[0]}`.toUpperCase()
    }
    return this.username.slice(0, 2).toUpperCase()
  }

  isAdmin(): boolean {
    return this.role === UserRole.ADMIN
  }

  isUser(): boolean {
    return this.role === UserRole.USER
  }

  isGuest(): boolean {
    return this.role === UserRole.GUEST
  }

  isActive(): boolean {
    return this.status === UserStatus.ACTIVE
  }

  isSuspended(): boolean {
    return this.status === UserStatus.SUSPENDED
  }

  isBanned(): boolean {
    return this.status === UserStatus.BANNED
  }

  canAccess(requiredRole: UserRole): boolean {
    return this.role >= requiredRole && this.isActive()
  }

  getAge(): number | null {
    if (!this.dateOfBirth) return null
    const today = new Date()
    const birthDate = new Date(this.dateOfBirth)
    let age = today.getFullYear() - birthDate.getFullYear()
    const monthDiff = today.getMonth() - birthDate.getMonth()
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--
    }
    
    return age
  }

  toJSON(): IUser {
    return {
      id: this.id,
      username: this.username,
      email: this.email,
      firstName: this.firstName,
      lastName: this.lastName,
      fullName: this.fullName,
      avatar: this.avatar,
      phone: this.phone,
      address: this.address,
      dateOfBirth: this.dateOfBirth,
      role: this.role,
      roleString: this.roleString,
      status: this.status,
      emailVerified: this.emailVerified,
      phoneVerified: this.phoneVerified,
      lastLoginAt: this.lastLoginAt,
      profileCompleteness: this.profileCompleteness,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    }
  }

  static fromApiResponse(data: any): User {
    return new User({
      id: data.id,
      username: data.username,
      email: data.email,
      firstName: data.firstName || data.first_name,
      lastName: data.lastName || data.last_name,
      avatar: data.avatar || data.profilePicture,
      phone: data.phone || data.phoneNumber,
      address: data.address,
      dateOfBirth: data.dateOfBirth ? new Date(data.dateOfBirth) : undefined,
      role: data.role || UserRole.GUEST,
      roleString: data.roleString || data.role_string || '',
      status: data.status || UserStatus.INACTIVE,
      emailVerified: data.emailVerified || data.email_verified || false,
      phoneVerified: data.phoneVerified || data.phone_verified || false,
      lastLoginAt: data.lastLoginAt ? new Date(data.lastLoginAt) : undefined,
      profileCompleteness: data.profileCompleteness || 0,
      createdAt: data.createdAt ? new Date(data.createdAt) : new Date(),
      updatedAt: data.updatedAt ? new Date(data.updatedAt) : new Date()
    })
  }
}
