import React from 'react';
import { PageLayout } from '@/components/templates';
import { ProductSuggestionTracker } from '@/components/molecules';
import { useProductSuggestion } from '@/hooks';

/**
 * Product Suggestion Debug Page
 * Development page to test and monitor product suggestion functionality
 */
const ProductSuggestionDebugPage = () => {
  const { 
    getViewedProducts, 
    getQueuedSuggestions,
    clearViewedProducts,
    isTracking,
    lastSyncTime
  } = useProductSuggestion();

  const viewedProducts = getViewedProducts();
  const queuedSuggestions = getQueuedSuggestions();

  const handleClearAll = () => {
    if (window.confirm('Are you sure you want to clear all tracked product data?')) {
      clearViewedProducts();
      window.location.reload(); // Refresh to show cleared state
    }
  };

  const handleTestView = () => {
    // Simulate viewing a product for testing
    const testProductId = Math.floor(Math.random() * 100);
    // Note: You would need to import and use trackProductView here
    console.log('Test product view simulation for ID:', testProductId);
  };

  return (
    <PageLayout>
      <div className="container mt-4">
        <div className="row">
          <div className="col-12">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h1>
                <i className="bi bi-graph-up me-2"></i>
                Product Suggestion Debug
              </h1>
              <div>
                <button 
                  className="btn btn-outline-primary me-2"
                  onClick={handleTestView}
                >
                  <i className="bi bi-plus-circle me-1"></i>
                  Simulate View
                </button>
                <button 
                  className="btn btn-outline-danger"
                  onClick={handleClearAll}
                  disabled={viewedProducts.length === 0}
                >
                  <i className="bi bi-trash me-1"></i>
                  Clear All Data
                </button>
              </div>
            </div>

            {/* System Status Overview */}
            <div className="row mb-4">
              <div className="col-md-3 mb-3">
                <div className="card text-center">
                  <div className="card-body">
                    <i className={`bi ${isTracking ? 'bi-play-circle-fill text-success' : 'bi-stop-circle text-muted'} mb-2`} style={{fontSize: '2rem'}}></i>
                    <h5 className="card-title">System Status</h5>
                    <p className="card-text">
                      <span className={`badge ${isTracking ? 'bg-success' : 'bg-secondary'}`}>
                        {isTracking ? 'Active' : 'Inactive'}
                      </span>
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="col-md-3 mb-3">
                <div className="card text-center">
                  <div className="card-body">
                    <i className="bi bi-eye-fill text-primary mb-2" style={{fontSize: '2rem'}}></i>
                    <h5 className="card-title">Viewed Products</h5>
                    <p className="card-text">
                      <span className="badge bg-primary">{viewedProducts.length}</span>
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="col-md-3 mb-3">
                <div className="card text-center">
                  <div className="card-body">
                    <i className="bi bi-clock text-info mb-2" style={{fontSize: '2rem'}}></i>
                    <h5 className="card-title">Last Sync</h5>
                    <p className="card-text">
                      <small>
                        {lastSyncTime ? lastSyncTime.toLocaleTimeString() : 'Not synced yet'}
                      </small>
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="col-md-3 mb-3">
                <div className="card text-center">
                  <div className="card-body">
                    <i className="bi bi-server text-warning mb-2" style={{fontSize: '2rem'}}></i>
                    <h5 className="card-title">Queue Status</h5>
                    <p className="card-text">
                      <span className="badge bg-warning text-dark">
                        {queuedSuggestions?.viewedProducts.length || 0} queued
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Detailed Tracker */}
            <div className="row">
              <div className="col-12">
                <ProductSuggestionTracker showDetails={true} />
              </div>
            </div>

            {/* Raw Data View */}
            <div className="row mt-4">
              <div className="col-md-6 mb-4">
                <div className="card">
                  <div className="card-header">
                    <h6 className="mb-0">
                      <i className="bi bi-code-square me-2"></i>
                      Raw Viewed Products Data
                    </h6>
                  </div>
                  <div className="card-body">
                    <pre className="bg-light p-3 rounded" style={{fontSize: '0.8rem', maxHeight: '300px', overflow: 'auto'}}>
                      {JSON.stringify(viewedProducts, null, 2)}
                    </pre>
                  </div>
                </div>
              </div>
              
              <div className="col-md-6 mb-4">
                <div className="card">
                  <div className="card-header">
                    <h6 className="mb-0">
                      <i className="bi bi-code-square me-2"></i>
                      Raw Queue Data
                    </h6>
                  </div>
                  <div className="card-body">
                    <pre className="bg-light p-3 rounded" style={{fontSize: '0.8rem', maxHeight: '300px', overflow: 'auto'}}>
                      {JSON.stringify(queuedSuggestions, null, 2)}
                    </pre>
                  </div>
                </div>
              </div>
            </div>

            {/* Instructions */}
            <div className="row mt-4">
              <div className="col-12">
                <div className="alert alert-info">
                  <h6>
                    <i className="bi bi-info-circle me-2"></i>
                    How to Test Product Suggestion Tracking:
                  </h6>
                  <ol className="mb-0">
                    <li>Visit different product detail pages (BidDetailPage)</li>
                    <li>Watch the "Viewed Products" count increase</li>
                    <li>Check this page to see tracked products</li>
                    <li>Data is automatically sent to server every 10 minutes</li>
                    <li>Check browser console for API call logs</li>
                  </ol>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default ProductSuggestionDebugPage;
