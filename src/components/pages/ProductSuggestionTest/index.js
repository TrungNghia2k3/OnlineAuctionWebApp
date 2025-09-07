/**
 * Test the updated product suggestion system
 * - localStorage limited to 5 items
 * - Sends list of product IDs to server
 * - JavaScript files instead of TypeScript
 */

import React, { useState } from 'react';
import { useProductSuggestion } from '@/hooks';

const ProductSuggestionTest = () => {
  const { 
    trackProductView, 
    getViewedProducts, 
    clearViewedProducts,
    isTracking,
    lastSyncTime 
  } = useProductSuggestion();
  
  const [viewedProducts, setViewedProducts] = useState([]);

  const handleTrackProduct = (productId) => {
    trackProductView(productId, {
      category: 'Electronics',
      title: `Product ${productId}`,
      currentBid: Math.floor(Math.random() * 1000) + 100
    });
    
    // Update local state to show current viewed products
    setViewedProducts(getViewedProducts());
  };

  const handleRefreshView = () => {
    setViewedProducts(getViewedProducts());
  };

  const handleClear = () => {
    clearViewedProducts();
    setViewedProducts([]);
  };

  return (
    <div className="container mt-4">
      <div className="card">
        <div className="card-header">
          <h3>Product Suggestion System Test</h3>
          <p className="text-muted">Test the updated system: max 5 items, JS files, sends list to server</p>
        </div>
        
        <div className="card-body">
          {/* Test Buttons */}
          <div className="mb-4">
            <h5>Track Product Views</h5>
            <div className="btn-group" role="group">
              {[1, 2, 3, 4, 5, 6, 7, 8].map(id => (
                <button 
                  key={id}
                  className="btn btn-outline-primary"
                  onClick={() => handleTrackProduct(id)}
                >
                  Track Product {id}
                </button>
              ))}
            </div>
          </div>

          {/* Status Information */}
          <div className="row mb-4">
            <div className="col-md-6">
              <div className="card">
                <div className="card-body">
                  <h6>System Status</h6>
                  <p><strong>Tracking:</strong> {isTracking ? 'Active' : 'Inactive'}</p>
                  <p><strong>Last Sync:</strong> {lastSyncTime ? lastSyncTime.toLocaleString() : 'Never'}</p>
                  <p><strong>Max Storage:</strong> 5 items</p>
                </div>
              </div>
            </div>
            
            <div className="col-md-6">
              <div className="card">
                <div className="card-body">
                  <h6>Actions</h6>
                  <button 
                    className="btn btn-secondary me-2"
                    onClick={handleRefreshView}
                  >
                    Refresh View
                  </button>
                  <button 
                    className="btn btn-danger"
                    onClick={handleClear}
                  >
                    Clear All
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Viewed Products Display */}
          <div className="card">
            <div className="card-header d-flex justify-content-between align-items-center">
              <h6 className="mb-0">Viewed Products in localStorage</h6>
              <span className="badge bg-primary">{viewedProducts.length}/5</span>
            </div>
            <div className="card-body">
              {viewedProducts.length === 0 ? (
                <p className="text-muted">No products viewed yet</p>
              ) : (
                <div className="list-group">
                  {viewedProducts.map((product, index) => (
                    <div key={`${product.productId}-${index}`} className="list-group-item">
                      <div className="d-flex justify-content-between align-items-start">
                        <div>
                          <h6 className="mb-1">Product ID: {product.productId}</h6>
                          <p className="mb-1">{product.title}</p>
                          <small className="text-muted">
                            Category: {product.category} | Bid: ${product.currentBid}
                          </small>
                        </div>
                        <small className="text-muted">
                          {new Date(product.viewedAt).toLocaleTimeString()}
                        </small>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Test Instructions */}
          <div className="alert alert-info mt-4">
            <h6>Test Instructions:</h6>
            <ol>
              <li>Click "Track Product X" buttons to simulate viewing products</li>
              <li>Notice only the last 5 products are stored</li>
              <li>Wait 1 minute to see the system send the list to server</li>
              <li>Check browser console for server communication logs</li>
              <li>Verify that older products are removed when limit is exceeded</li>
            </ol>
          </div>

          {/* Implementation Notes */}
          <div className="alert alert-success mt-3">
            <h6>✅ Changes Implemented:</h6>
            <ul className="mb-0">
              <li>localStorage limited to 5 items (MAX_VIEWED_PRODUCTS = 5)</li>
              <li>System sends array of product IDs, not just single item</li>
              <li>SuggestedProducts component converted from .tsx to .js</li>
              <li>productSuggestion API converted from .ts to .js</li>
              <li>All TypeScript interfaces removed and converted to JSDoc</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductSuggestionTest;
