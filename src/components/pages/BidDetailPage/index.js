import React from 'react';
import { useParams } from 'react-router-dom';
import { useItem, useAuth } from '@/hooks';
import { PageLayout } from '@/components/templates';
import { LoadingSpinner } from '@/components/atoms';
import RealtimeBidding from '@/components/organisms/RealtimeBidding';
import './BidDetailPage.scss';

/**
 * Bid Detail Page Component
 * Displays full auction item details and bidding interface
 */
const BidDetailPage = () => {
  const { id } = useParams();
  const { item, loading, error } = useItem(id);
  const { currentUser } = useAuth();

  // Debug logging
  console.log('BidDetailPage - ID:', id);
  console.log('BidDetailPage - Item:', item);
  console.log('BidDetailPage - Loading:', loading);
  console.log('BidDetailPage - Error:', error);

  // Loading state
  if (loading) {
    return (
      <PageLayout>
        <div className="bid-detail-loading">
          <LoadingSpinner size="large" message="Loading auction details..." />
        </div>
      </PageLayout>
    );
  }

  // Error state
  if (error) {
    return (
      <PageLayout>
        <div className="bid-detail-error">
          <div className="alert alert-danger" role="alert">
            <h4 className="alert-heading">Error Loading Auction</h4>
            <p>{error}</p>
            <hr />
            <button 
              className="btn btn-outline-danger" 
              onClick={() => window.history.back()}
            >
              Go Back
            </button>
          </div>
        </div>
      </PageLayout>
    );
  }

  // Item not found
  if (!item) {
    return (
      <PageLayout>
        <div className="bid-detail-not-found">
          <div className="alert alert-warning" role="alert">
            <h4 className="alert-heading">Auction Not Found</h4>
            <p>The auction item you're looking for could not be found.</p>
            <hr />
            <button 
              className="btn btn-outline-warning" 
              onClick={() => window.history.back()}
            >
              Go Back
            </button>
          </div>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <div className="bid-detail-page">
        <div className="row">
          {/* Left Column - Image and Gallery */}
          <div className="col-lg-6 col-md-6 mb-4">
            <div className="bid-detail__image-section">
              <div className="bid-detail__main-image">
                {item.image ? (
                  <img 
                    src={item.image} 
                    alt={item.title}
                    className="img-fluid rounded"
                    onError={(e) => {
                      console.error('Image failed to load:', item.image);
                      e.target.style.display = 'none';
                    }}
                    onLoad={() => console.log('Image loaded successfully:', item.image)}
                  />
                ) : (
                  <div className="bid-detail__image-placeholder">
                    <i className="bi bi-image"></i>
                    <span>No Image Available</span>
                  </div>
                )}
              </div>
              
              {/* Additional Images Gallery */}
              {item.images && item.images.length > 1 && (
                <div className="bid-detail__image-gallery mt-3">
                  <h5>More Images</h5>
                  <div className="row">
                    {item.images.slice(0, 4).map((image, index) => (
                      <div key={image.id || index} className="col-3 mb-2">
                        <img
                          src={image.imageUrl}
                          alt={`${item.title} - View ${index + 1}`}
                          className="img-fluid rounded cursor-pointer"
                          style={{ height: '80px', objectFit: 'cover', width: '100%' }}
                          onClick={() => {
                            // Update main image
                            const mainImg = document.querySelector('.bid-detail__main-image img');
                            if (mainImg) mainImg.src = image.imageUrl;
                          }}
                          onError={(e) => {
                            e.target.style.display = 'none';
                          }}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Item Details and Bidding */}
          <div className="col-lg-6 col-md-6">
            <div className="bid-detail__info">
              {/* Title and Category */}
              <div className="bid-detail__header">
                <h1 className="bid-detail__title">{item.title}</h1>
                <span className="bid-detail__category badge bg-secondary">
                  {typeof item.category === 'object' ? item.category?.name : item.category}
                </span>
              </div>

              {/* Current Bid Information */}
              <div className="bid-detail__bid-section">
                <div className="bid-detail__current-bid">
                  <label className="bid-detail__bid-label">Current Bid</label>
                  <div className="bid-detail__bid-amount">
                    {item.getFormattedCurrentBid()}
                  </div>
                </div>

                <div className="bid-detail__meta-info">
                  <div className="bid-detail__time-left">
                    <i className="bi bi-clock"></i>
                    <span>{item.getReadableTimeLeft()}</span>
                  </div>
                  <div className="bid-detail__bid-count">
                    <i className="bi bi-people"></i>
                    <span>{item.bidCount} bids</span>
                  </div>
                </div>
              </div>

              {/* Real-time Bidding Interface */}
              <RealtimeBidding
                itemId={item.id}
                initialPrice={item.currentBid || item.startingPrice || 0}
                initialTotalBids={item.bidCount || 0}
                minBidIncrement={item.minIncreasePrice || 1}
                isAuctionActive={item.status === 'ACTIVE'}
                currentUserId={currentUser?.username}
                showHistory={true}
                showConnectionStatus={true}
                className="mb-4"
              />

              {/* Additional Item Details */}
              <div className="bid-detail__details">
                <h3>Item Details</h3>
                <div className="bid-detail__details-grid">
                  {item.seller && (
                    <div className="detail-item">
                      <strong>Seller:</strong>
                      <span>{typeof item.seller === 'object' ? item.seller.username || item.seller.firstName + ' ' + item.seller.lastName : item.seller}</span>
                    </div>
                  )}
                  {item.sellerObject?.username && (
                    <div className="detail-item">
                      <strong>Username:</strong>
                      <span>@{item.sellerObject.username}</span>
                    </div>
                  )}
                  {item.status && (
                    <div className="detail-item">
                      <strong>Status:</strong>
                      <span className={`badge ${item.status === 'ACTIVE' ? 'bg-success' : 'bg-warning'}`}>
                        {item.status}
                      </span>
                    </div>
                  )}
                  {item.startingPrice && (
                    <div className="detail-item">
                      <strong>Starting Price:</strong>
                      <span>€{item.startingPrice.toLocaleString()}</span>
                    </div>
                  )}
                  {item.reservePrice && (
                    <div className="detail-item">
                      <strong>Reserve Price:</strong>
                      <span>€{item.reservePrice.toLocaleString()}</span>
                    </div>
                  )}
                  {item.minIncreasePrice && (
                    <div className="detail-item">
                      <strong>Min. Bid Increase:</strong>
                      <span>€{item.minIncreasePrice}</span>
                    </div>
                  )}
                  {item.condition && (
                    <div className="detail-item">
                      <strong>Condition:</strong>
                      <span>{item.condition}</span>
                    </div>
                  )}
                  {item.location && (
                    <div className="detail-item">
                      <strong>Location:</strong>
                      <span>{item.location}</span>
                    </div>
                  )}
                  {item.shippingCost !== undefined && (
                    <div className="detail-item">
                      <strong>Shipping:</strong>
                      <span>€{item.shippingCost}</span>
                    </div>
                  )}
                  {item.dimensions && (
                    <div className="detail-item">
                      <strong>Dimensions:</strong>
                      <span>{item.dimensions}</span>
                    </div>
                  )}
                  {item.weight && (
                    <div className="detail-item">
                      <strong>Weight:</strong>
                      <span>{item.weight}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Description */}
              {item.description && (
                <div className="bid-detail__description">
                  <h3>Description</h3>
                  <p>{item.description}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default BidDetailPage;
