/**
 * TypeScript Utility Types for the Application
 */

// Generic API Response wrapper
export type ApiResponse<T = any> = {
  success: boolean
  data?: T
  message?: string
  error?: string
  code?: number
}

// Common form field types
export type FormField<T = string> = {
  value: T
  error?: string
  touched?: boolean
  required?: boolean
  disabled?: boolean
}

// Form state type
export type FormState<T extends Record<string, any>> = {
  [K in keyof T]: FormField<T[K]>
}

// Async operation state
export type AsyncState<T = any> = {
  data: T | null
  loading: boolean
  error: string | null
}

// Component props with children
export type PropsWithChildren<T = {}> = T & {
  children?: React.ReactNode
}

// Optional properties type
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>

// Pick certain properties and make them required
export type RequiredPick<T, K extends keyof T> = Required<Pick<T, K>> & Omit<T, K>

// Pagination types
export type PaginationInfo = {
  page: number
  limit: number
  total: number
  totalPages: number
  hasNext: boolean
  hasPrev: boolean
}

export type PaginatedData<T> = {
  items: T[]
  pagination: PaginationInfo
}

// Sort and filter types
export type SortOrder = 'asc' | 'desc'
export type SortField<T> = keyof T | string

export type SortConfig<T = any> = {
  field: SortField<T>
  order: SortOrder
}

export type FilterConfig = {
  [key: string]: any
}

// Table column configuration
export type TableColumn<T = any> = {
  key: keyof T | string
  label: string
  sortable?: boolean
  filterable?: boolean
  width?: string | number
  align?: 'left' | 'center' | 'right'
  render?: (value: any, item: T, index: number) => React.ReactNode
}

// Modal types
export type ModalSize = 'sm' | 'lg' | 'xl'
export type ModalType = 'info' | 'success' | 'warning' | 'danger' | 'question'

// Theme types
export type ThemeVariant = 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'light' | 'dark'

// File upload types
export type FileUploadStatus = 'idle' | 'uploading' | 'success' | 'error'

export type FileUploadState = {
  file: File | null
  status: FileUploadStatus
  progress: number
  error?: string
  url?: string
}

// Route guard types
export type RouteGuardType = 'public' | 'protected' | 'admin' | 'guest'

// Event handler types
export type EventHandler<T = HTMLElement> = (event: React.FormEvent<T>) => void
export type ChangeHandler<T = HTMLInputElement> = (event: React.ChangeEvent<T>) => void
export type ClickHandler<T = HTMLButtonElement> = (event: React.MouseEvent<T>) => void

// Utility type to extract promise type
export type PromiseType<T extends Promise<any>> = T extends Promise<infer U> ? U : never

// Deep partial type
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P]
}

// Flatten nested object type
export type Flatten<T> = T extends object
  ? T extends infer O
    ? { [K in keyof O]: O[K] }
    : never
  : T

// Extract function arguments type
export type Arguments<T extends (...args: any[]) => any> = T extends (...args: infer A) => any ? A : never

// Extract function return type
export type ReturnType<T extends (...args: any[]) => any> = T extends (...args: any[]) => infer R ? R : never

// Make specific fields optional
export type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>

// String literal types for common use cases
export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'
export type ContentType = 'application/json' | 'multipart/form-data' | 'application/x-www-form-urlencoded'

// Environment types
export type Environment = 'development' | 'production' | 'test'

// Error boundary types
export type ErrorInfo = {
  componentStack: string
}

export type ErrorBoundaryState = {
  hasError: boolean
  error?: Error
  errorInfo?: ErrorInfo
}

// Navigation types
export type NavigationItem = {
  id: string
  label: string
  path: string
  icon?: string
  badge?: string | number
  children?: NavigationItem[]
  permissions?: string[]
  exact?: boolean
}

// Form validation types
export type ValidationRule<T = any> = {
  required?: boolean
  min?: number
  max?: number
  pattern?: RegExp
  custom?: (value: T) => string | undefined
  message?: string
}

export type ValidationSchema<T extends Record<string, any>> = {
  [K in keyof T]?: ValidationRule<T[K]>
}

// Context types for better provider typing
export type ContextValue<T> = T & {
  isLoading?: boolean
  error?: string | null
}

// Hook return types
export type UseAsyncReturn<T> = {
  data: T | null
  loading: boolean
  error: string | null
  execute: (...args: any[]) => Promise<void>
  reset: () => void
}

// Component size types
export type ComponentSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl'

// Status types
export type Status = 'idle' | 'loading' | 'success' | 'error'

// Currency and number formatting
export type CurrencyCode = 'USD' | 'EUR' | 'GBP' | 'JPY' | 'VND'
export type NumberFormat = 'decimal' | 'currency' | 'percent'
