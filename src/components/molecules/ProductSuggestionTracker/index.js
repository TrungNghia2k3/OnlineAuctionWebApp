import React from 'react';
import { useProductSuggestion } from '@/hooks';
import './ProductSuggestionTracker.scss';

/**
 * Product Suggestion Tracker Component
 * Development component to display tracking status and viewed products
 * Can be used for testing and debugging
 */
const ProductSuggestionTracker = ({ 
  showDetails = false, 
  className = '',
  style = {} 
}) => {
  const { 
    getViewedProducts, 
    getQueuedSuggestions,
    isTracking, 
    lastSyncTime,
    clearViewedProducts 
  } = useProductSuggestion();

  const viewedProducts = getViewedProducts();
  const queuedSuggestions = getQueuedSuggestions();

  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleString();
  };

  if (!showDetails) {
    return (
      <div className={`product-suggestion-status ${className}`} style={style}>
        <small className="text-muted d-flex align-items-center">
          <i className={`bi ${isTracking ? 'bi-circle-fill text-success' : 'bi-circle text-muted'} me-1`}></i>
          Tracking: {viewedProducts.length} products viewed
          {lastSyncTime && (
            <span className="ms-2">
              | Last sync: {lastSyncTime.toLocaleTimeString()}
            </span>
          )}
        </small>
      </div>
    );
  }

  return (
    <div className={`product-suggestion-tracker ${className}`} style={style}>
      <div className="card">
        <div className="card-header d-flex justify-content-between align-items-center">
          <h6 className="mb-0">
            <i className="bi bi-graph-up me-2"></i>
            Product Suggestion Tracker
          </h6>
          <div className="d-flex align-items-center">
            <span className={`badge ${isTracking ? 'bg-success' : 'bg-secondary'} me-2`}>
              {isTracking ? 'Active' : 'Inactive'}
            </span>
            {viewedProducts.length > 0 && (
              <button 
                className="btn btn-sm btn-outline-danger"
                onClick={clearViewedProducts}
                title="Clear all tracked products"
              >
                <i className="bi bi-trash"></i>
              </button>
            )}
          </div>
        </div>
        
        <div className="card-body">
          {/* Tracking Status */}
          <div className="mb-3">
            <div className="row">
              <div className="col-6">
                <small className="text-muted">Status:</small>
                <div className="fw-bold">
                  {isTracking ? 'Tracking Active' : 'Tracking Inactive'}
                </div>
              </div>
              <div className="col-6">
                <small className="text-muted">Products Tracked:</small>
                <div className="fw-bold">{viewedProducts.length}</div>
              </div>
            </div>
          </div>

          {/* Last Sync Time */}
          {lastSyncTime && (
            <div className="mb-3">
              <small className="text-muted">Last Server Sync:</small>
              <div className="fw-bold">{lastSyncTime.toLocaleString()}</div>
            </div>
          )}

          {/* Queue Status */}
          {queuedSuggestions && (
            <div className="mb-3">
              <small className="text-muted">Queue Status:</small>
              <div className="fw-bold">
                {queuedSuggestions.viewedProducts.length} products queued
                {queuedSuggestions.lastSentAt > 0 && (
                  <small className="text-muted ms-2">
                    (Last sent: {formatDate(queuedSuggestions.lastSentAt)})
                  </small>
                )}
              </div>
            </div>
          )}

          {/* Recently Viewed Products */}
          {viewedProducts.length > 0 && (
            <div>
              <small className="text-muted">Recently Viewed:</small>
              <div className="mt-2" style={{ maxHeight: '200px', overflowY: 'auto' }}>
                {viewedProducts.slice(-5).reverse().map((product, index) => (
                  <div key={`${product.productId}-${product.viewedAt}`} className="border-bottom py-2">
                    <div className="d-flex justify-content-between align-items-start">
                      <div className="flex-grow-1">
                        <div className="fw-medium">{product.title || `Product #${product.productId}`}</div>
                        {product.category && (
                          <small className="text-muted">{product.category}</small>
                        )}
                        {product.currentBid && (
                          <small className="text-success ms-2">€{product.currentBid.toLocaleString()}</small>
                        )}
                      </div>
                      <small className="text-muted">
                        {formatDate(product.viewedAt)}
                      </small>
                    </div>
                  </div>
                ))}
                {viewedProducts.length > 5 && (
                  <div className="text-center py-2">
                    <small className="text-muted">
                      ... and {viewedProducts.length - 5} more products
                    </small>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Empty State */}
          {viewedProducts.length === 0 && (
            <div className="text-center py-3">
              <i className="bi bi-eye-slash text-muted mb-2" style={{ fontSize: '1.5rem' }}></i>
              <div className="text-muted">No products viewed yet</div>
              <small className="text-muted">
                Visit product detail pages to start tracking
              </small>
            </div>
          )}
        </div>

        {/* Footer with info */}
        <div className="card-footer">
          <small className="text-muted">
            <i className="bi bi-info-circle me-1"></i>
            Data is automatically sent to server every 10 minutes
          </small>
        </div>
      </div>
    </div>
  );
};

export default ProductSuggestionTracker;
