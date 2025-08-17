import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { ROUTE_TYPES, USER_ROLES } from '../common/constant'

/**
 * RouteGuard Component
 * Handles route protection based on authentication and user roles
 * Simplified version without atomic design dependencies
 */
export const RouteGuard = ({ route, children }) => {
  const { user, isAuthenticated, isLoading } = useAuth()

  // Show loading while authentication is being checked
  if (isLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    )
  }

  // Check if route requires authentication
  if (route.requiresAuth && !isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  // Check if route is for guests only (like login/register)
  if (route.meta?.hideForAuthenticated && isAuthenticated) {
    return <Navigate to="/" replace />
  }

  // Check user role permissions
  if (route.type === ROUTE_TYPES.ADMIN_ONLY) {
    if (!isAuthenticated || user?.role !== USER_ROLES.ADMIN) {
      return (
        <div className="container mt-4">
          <div className="alert alert-danger" role="alert">
            <h4 className="alert-heading">Access Denied</h4>
            <p>You don't have permission to access this page.</p>
            <hr />
            <p className="mb-0">
              <Navigate to="/" replace />
            </p>
          </div>
        </div>
      )
    }
  }

  // Check if user has required roles
  if (route.roles && route.roles.length > 0) {
    const userRole = isAuthenticated ? user?.role : USER_ROLES.GUEST
    if (!route.roles.includes(userRole)) {
      return (
        <div className="container mt-4">
          <div className="alert alert-warning" role="alert">
            <h4 className="alert-heading">Insufficient Permissions</h4>
            <p>You don't have the required permissions to view this page.</p>
            <hr />
            <p className="mb-0">
              <Navigate to="/" replace />
            </p>
          </div>
        </div>
      )
    }
  }

  // Render the protected component
  return children
}

export default RouteGuard
