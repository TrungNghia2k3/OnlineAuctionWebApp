import { lazy } from 'react'
import { USER_ROLES, ROUTE_TYPES } from '@/common'

/**
 * Route Configuration System
 * Follows OCP - open for extension, closed for modification
 * New routes can be added without modifying existing code
 */

// Lazy load components for better performance
const HomePage = lazy(() => import('../components/pages/HomePage'))
const LoginPage = lazy(() => import('../components/pages/LoginPage'))
const RegisterPage = lazy(() => import('../components/pages/RegisterPage'))
const ForgotPasswordPage = lazy(() => import('../components/pages/ForgotPasswordPage'))
const CategoryBrowserPage = lazy(() => import('../components/pages/CategoryBrowserPage'))
const CategoryPage = lazy(() => import('../components/pages/CategoryPage'))
const BidDetailPage = lazy(() => import('../components/pages/BidDetailPage'))
const SearchResultsPage = lazy(() => import('../components/pages/SearchResultsPage'))
const ProfilePage = lazy(() => import('../components/pages/ProfilePage'))
const CategoryManagementPage = lazy(() => import('../components/pages/CategoryManagementPage'))
const UserManagementPage = lazy(() => import('../components/pages/UserManagementPage'))
const AuctionManagementPage = lazy(() => import('../components/pages/AuctionManagementPage'))

/**
 * Route definition interface
 * @typedef {Object} RouteDefinition
 * @property {string} path - The route path
 * @property {React.Component} element - The component to render
 * @property {string} type - Route type (public, protected, admin_only)
 * @property {number[]} roles - Required user roles for access
 * @property {boolean} index - Whether this is the index route
 * @property {string} title - Page title for SEO
 * @property {string} description - Page description for SEO
 * @property {boolean} requiresAuth - Whether authentication is required
 * @property {Object} meta - Additional metadata
 */

export const routeDefinitions = [
  // Public routes - accessible without authentication
  {
    path: '/',
    element: <HomePage />,
    type: ROUTE_TYPES.PUBLIC,
    roles: [USER_ROLES.GUEST, USER_ROLES.USER, USER_ROLES.ADMIN],
    index: true,
    title: 'Online Auction - Home',
    description: 'Welcome to our online auction platform',
    requiresAuth: false,
    meta: {
      showInNavigation: true,
      navOrder: 1
    }
  },
  {
    path: '/login',
    element: <LoginPage />,
    type: ROUTE_TYPES.PUBLIC,
    roles: [USER_ROLES.GUEST],
    title: 'Login - Online Auction',
    description: 'Sign in to your account',
    requiresAuth: false,
    meta: {
      hideForAuthenticated: true,
      showInNavigation: false
    }
  },
  {
    path: '/register',
    element: <RegisterPage />,
    type: ROUTE_TYPES.PUBLIC,
    roles: [USER_ROLES.GUEST],
    title: 'Register - Online Auction',
    description: 'Create a new account',
    requiresAuth: false,
    meta: {
      hideForAuthenticated: true,
      showInNavigation: false
    }
  },
  {
    path: '/forgot-password',
    element: <ForgotPasswordPage />,
    type: ROUTE_TYPES.PUBLIC,
    roles: [USER_ROLES.GUEST],
    title: 'Forgot Password - Online Auction',
    description: 'Reset your password',
    requiresAuth: false,
    meta: {
      hideForAuthenticated: true,
      showInNavigation: false
    }
  },
  {
    path: '/category-browser',
    element: <CategoryBrowserPage />,
    type: ROUTE_TYPES.PUBLIC,
    roles: [USER_ROLES.GUEST, USER_ROLES.USER, USER_ROLES.ADMIN],
    title: 'Browse Categories - Online Auction',
    description: 'Browse auction categories',
    requiresAuth: false,
    meta: {
      showInNavigation: true,
      navOrder: 2
    }
  },
  {
    path: '/category/:categoryId',
    element: <CategoryPage />,
    type: ROUTE_TYPES.PUBLIC,
    roles: [USER_ROLES.GUEST, USER_ROLES.USER, USER_ROLES.ADMIN],
    title: 'Category - Online Auction',
    description: 'View category items and subcategories',
    requiresAuth: false,
    meta: {
      showInNavigation: false
    }
  },
  {
    path: '/bid-detail/:id',
    element: <BidDetailPage />,
    type: ROUTE_TYPES.PUBLIC,
    roles: [USER_ROLES.GUEST, USER_ROLES.USER, USER_ROLES.ADMIN],
    title: 'Auction Details - Online Auction',
    description: 'View auction item details',
    requiresAuth: false,
    meta: {
      showInNavigation: false
    }
  },
  {
    path: '/search-results',
    element: <SearchResultsPage />,
    type: ROUTE_TYPES.PUBLIC,
    roles: [USER_ROLES.GUEST, USER_ROLES.USER, USER_ROLES.ADMIN],
    title: 'Search Results - Online Auction',
    description: 'Search results for auction items',
    requiresAuth: false,
    meta: {
      showInNavigation: false
    }
  },

  // Protected routes - require authentication
  {
    path: '/profile',
    element: <ProfilePage />,
    type: ROUTE_TYPES.PROTECTED,
    roles: [USER_ROLES.USER, USER_ROLES.ADMIN],
    title: 'My Profile - Online Auction',
    description: 'Manage your profile',
    requiresAuth: true,
    meta: {
      showInNavigation: true,
      navOrder: 10
    }
  },

  // Admin-only routes
  {
    path: '/category-management',
    element: <CategoryManagementPage />,
    type: ROUTE_TYPES.ADMIN_ONLY,
    roles: [USER_ROLES.ADMIN],
    title: 'Category Management - Online Auction',
    description: 'Manage auction categories',
    requiresAuth: true,
    meta: {
      showInNavigation: true,
      navOrder: 20,
      adminOnly: true
    }
  },
  {
    path: '/user-management',
    element: <UserManagementPage />,
    type: ROUTE_TYPES.ADMIN_ONLY,
    roles: [USER_ROLES.ADMIN],
    title: 'User Management - Online Auction',
    description: 'Manage users',
    requiresAuth: true,
    meta: {
      showInNavigation: true,
      navOrder: 21,
      adminOnly: true
    }
  },
  {
    path: '/auction-management',
    element: <AuctionManagementPage />,
    type: ROUTE_TYPES.ADMIN_ONLY,
    roles: [USER_ROLES.ADMIN],
    title: 'Auction Management - Online Auction',
    description: 'Manage auctions',
    requiresAuth: true,
    meta: {
      showInNavigation: true,
      navOrder: 22,
      adminOnly: true
    }
  }
]

// Helper functions for route management
export const getPublicRoutes = () => 
  routeDefinitions.filter(route => route.type === ROUTE_TYPES.PUBLIC)

export const getProtectedRoutes = () => 
  routeDefinitions.filter(route => route.type === ROUTE_TYPES.PROTECTED)

export const getAdminRoutes = () => 
  routeDefinitions.filter(route => route.type === ROUTE_TYPES.ADMIN_ONLY)

export const getRouteByPath = (path) => 
  routeDefinitions.find(route => route.path === path)

export const getNavigationRoutes = () => 
  routeDefinitions
    .filter(route => route.meta?.showInNavigation)
    .sort((a, b) => (a.meta?.navOrder || 0) - (b.meta?.navOrder || 0))

export const getRoutesForRole = (userRole) => 
  routeDefinitions.filter(route => route.roles.includes(userRole))

export const canAccessRoute = (route, userRole) => 
  route.roles.includes(userRole)

export const getIndexRoute = () => 
  routeDefinitions.find(route => route.index)

// Route validation
export const validateRouteDefinition = (route) => {
  const requiredFields = ['path', 'element', 'type', 'roles']
  const missingFields = requiredFields.filter(field => !route[field])
  
  if (missingFields.length > 0) {
    throw new Error(`Route definition missing required fields: ${missingFields.join(', ')}`)
  }
  
  if (!Object.values(ROUTE_TYPES).includes(route.type)) {
    throw new Error(`Invalid route type: ${route.type}`)
  }
  
  if (!Array.isArray(route.roles) || route.roles.length === 0) {
    throw new Error('Route roles must be a non-empty array')
  }
  
  const validRoles = Object.values(USER_ROLES)
  const invalidRoles = route.roles.filter(role => !validRoles.includes(role))
  if (invalidRoles.length > 0) {
    throw new Error(`Invalid roles: ${invalidRoles.join(', ')}`)
  }
  
  return true
}

// Validate all route definitions on module load
routeDefinitions.forEach(validateRouteDefinition)
