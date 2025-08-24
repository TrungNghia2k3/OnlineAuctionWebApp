/**
 * Real-time Connection Status Component
 * Shows WebSocket connection status for bidding
 */

import React from 'react'
import PropTypes from 'prop-types'

/**
 * Component to display real-time connection status
 */
const ConnectionStatus = ({
  isConnected,
  isLoading = false,
  error,
  onRetry,
  className = ''
}) => {
  if (isLoading) {
    return (
      <div className={`connection-status ${className}`}>
        <div className="alert alert-info d-flex align-items-center" role="alert">
          <div className="spinner-border spinner-border-sm me-3" role="status">
            <span className="visually-hidden">Connecting...</span>
          </div>
          <div>
            <strong>Connecting to real-time bidding...</strong>
            <div className="small">Please wait while we establish connection</div>
          </div>
        </div>
      </div>
    )
  }

  if (error || !isConnected) {
    return (
      <div className={`connection-status ${className}`}>
        <div className="alert alert-warning d-flex align-items-center justify-content-between" role="alert">
          <div className="d-flex align-items-center">
            <i className="bi bi-exclamation-triangle text-warning me-3 fs-5"></i>
            <div>
              <strong>Real-time bidding unavailable</strong>
              <div className="small">
                {error || 'Unable to connect to bidding service'}
              </div>
            </div>
          </div>
          {onRetry && (
            <button
              type="button"
              className="btn btn-outline-warning btn-sm"
              onClick={onRetry}
            >
              <i className="bi bi-arrow-clockwise me-1"></i>
              Retry
            </button>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className={`connection-status ${className}`}>
      <div className="alert alert-success d-flex align-items-center" role="alert">
        <i className="bi bi-wifi text-success me-3 fs-5"></i>
        <div>
          <strong>Real-time bidding active</strong>
          <div className="small">
            <span className="badge bg-success me-2">
              <span className="spinner-grow spinner-grow-sm me-1" style={{ width: '0.5rem', height: '0.5rem' }}></span>
              LIVE
            </span>
            Bids and prices update automatically
          </div>
        </div>
      </div>
    </div>
  )
}

ConnectionStatus.propTypes = {
  isConnected: PropTypes.bool.isRequired,
  isLoading: PropTypes.bool,
  error: PropTypes.string,
  onRetry: PropTypes.func,
  className: PropTypes.string
}

export default ConnectionStatus
