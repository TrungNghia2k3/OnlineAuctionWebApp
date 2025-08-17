import React from 'react'
import './LoadingSpinner.scss'

/**
 * Loading Spinner Atom Component
 * Displays a centered spinner with fade animation
 */
const LoadingSpinner = ({ 
  size = 'md', 
  variant = 'primary',
  message = 'Loading...',
  show = true,
  fadeOut = false,
  className = ''
}) => {
  const sizeClasses = {
    sm: 'spinner-sm',
    md: 'spinner-md', 
    lg: 'spinner-lg'
  }

  const spinnerClass = `
    loading-spinner
    ${sizeClasses[size] || sizeClasses.md}
    ${fadeOut ? 'fade-out' : ''}
    ${className}
  `.trim()

  if (!show) return null

  return (
    <div className={`loading-spinner-container ${fadeOut ? 'fade-out' : ''}`}>
      <div className="loading-content">
        <div 
          className={`spinner-border text-${variant} ${spinnerClass}`}
          role="status"
          aria-hidden="true"
        >
          <span className="visually-hidden">{message}</span>
        </div>
        {message && (
          <div className="loading-message mt-3 text-muted">
            {message}
          </div>
        )}
      </div>
    </div>
  )
}

export default LoadingSpinner
