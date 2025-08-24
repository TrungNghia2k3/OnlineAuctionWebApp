import React from 'react';
import { useItems } from '@/hooks';
import { LoadingSpinner } from '@/components/atoms';

/**
 * API Items List Component
 * Displays items fetched from the API
 */
const ApiItemsList = () => {
  const { items, loading, error } = useItems();

  if (loading) {
    return (
      <div className="text-center py-4">
        <LoadingSpinner size="medium" message="Loading items..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger" role="alert">
        <h5 className="alert-heading">Error Loading Items</h5>
        <p>{error}</p>
      </div>
    );
  }

  if (!items || items.length === 0) {
    return (
      <div className="alert alert-info" role="alert">
        <h5 className="alert-heading">No Items Found</h5>
        <p>There are no auction items available at the moment.</p>
      </div>
    );
  }

  return (
    <div className="api-items-list">
      <h2 className="mb-4">Live Auction Items</h2>
      
      {/* Items Grid */}
      <div className="row">
        {items.map(item => (
          <div key={item.id} className="col-lg-3 col-md-4 col-sm-6 mb-4">
            <div className="card h-100">
              {/* Item Image */}
              <div className="card-img-top-wrapper" style={{ height: '200px', overflow: 'hidden' }}>
                {item.image ? (
                  <img 
                    src={item.image} 
                    alt={item.title}
                    className="card-img-top"
                    style={{ 
                      width: '100%', 
                      height: '100%', 
                      objectFit: 'cover' 
                    }}
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                ) : null}
                <div 
                  className="d-flex align-items-center justify-content-center bg-light text-muted h-100"
                  style={{ display: item.image ? 'none' : 'flex' }}
                >
                  <div className="text-center">
                    <i className="bi bi-image fs-1"></i>
                    <div>No Image</div>
                  </div>
                </div>
              </div>
              
              {/* Item Details */}
              <div className="card-body d-flex flex-column">
                <h5 className="card-title" title={item.title}>
                  {item.title.length > 50 ? item.title.substring(0, 47) + '...' : item.title}
                </h5>
                
                <div className="mb-2">
                  <small className="text-muted">
                    Category: {typeof item.category === 'object' ? item.category?.name : item.category}
                  </small>
                </div>
                
                <div className="mb-2">
                  <strong className="text-primary fs-5">
                    €{item.currentBid.toLocaleString()}
                  </strong>
                </div>
                
                <div className="mb-2">
                  <small className="text-muted">
                    <i className="bi bi-clock me-1"></i>
                    {item.timeLeft}
                  </small>
                </div>
                
                <div className="mb-3">
                  <small className="text-muted">
                    <i className="bi bi-people me-1"></i>
                    {item.bidCount} bids
                  </small>
                </div>
                
                {item.description && (
                  <p className="card-text text-muted small flex-grow-1">
                    {item.description.length > 100 
                      ? item.description.substring(0, 97) + '...'
                      : item.description
                    }
                  </p>
                )}
                
                <div className="mt-auto">
                  <div className="d-flex justify-content-between align-items-center">
                    <span className={`badge ${item.status === 'ACTIVE' ? 'bg-success' : 'bg-warning'}`}>
                      {item.status || 'UNKNOWN'}
                    </span>
                    
                    <a 
                      href={`/bid-detail/${item.id}`} 
                      className="btn btn-primary btn-sm"
                      onClick={(e) => {
                        e.preventDefault();
                        window.location.href = `/bid-detail/${item.id}`;
                      }}
                    >
                      View Details
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Summary Info */}
      <div className="mt-4 p-3 bg-light rounded">
        <div className="row text-center">
          <div className="col-md-3">
            <h5 className="mb-1">{items.length}</h5>
            <small className="text-muted">Total Items</small>
          </div>
          <div className="col-md-3">
            <h5 className="mb-1">
              {items.filter(item => item.status === 'ACTIVE').length}
            </h5>
            <small className="text-muted">Active Auctions</small>
          </div>
          <div className="col-md-3">
            <h5 className="mb-1">
              {items.reduce((total, item) => total + item.bidCount, 0)}
            </h5>
            <small className="text-muted">Total Bids</small>
          </div>
          <div className="col-md-3">
            <h5 className="mb-1">
              €{Math.round(items.reduce((total, item) => total + item.currentBid, 0)).toLocaleString()}
            </h5>
            <small className="text-muted">Total Value</small>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApiItemsList;
