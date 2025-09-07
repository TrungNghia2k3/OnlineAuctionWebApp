import React from 'react';
import { 
  useProductSuggestionsWithCache, 
  useSimilarProducts,
  usePrefetchSuggestions 
} from '@/hooks';
import { LoadingSpinner } from '@/components/atoms';
import { AuctionCard } from '@/components/molecules';
import { useNavigation } from '@/hooks';
import { Item } from '@/models';
import './SuggestedProducts.scss';

/**
 * Suggested Products Component with React Query Caching
 * Displays cached suggestions when user returns to product pages
 * Uses multiple sources: similar products, user preferences, trending
 * 
 * @param {Object} props - Component props
 * @param {string|number} props.currentProductId - Current product ID for similar suggestions
 * @param {string} props.category - Product category for category-based suggestions
 * @param {number} props.maxItems - Maximum number of items to display (default: 8)
 * @param {boolean} props.showTitle - Whether to show component title (default: true)
 * @param {string} props.className - Additional CSS classes
 */
const SuggestedProducts = ({
  currentProductId,
  category,
  maxItems = 8,
  showTitle = true,
  className = ''
}) => {
  const { navigateToBidDetail } = useNavigation();
  const { prefetchSimilarProducts } = usePrefetchSuggestions();
  
  // Get cached suggestions with multiple fallbacks
  const {
    suggestions,
    isLoading,
    error,
    userSuggestionsState,
    similarProductsState,
    trendingProductsState
  } = useProductSuggestionsWithCache(currentProductId);

  // Also get similar products specifically for this product
  const { 
    data: similarProducts
  } = useSimilarProducts(currentProductId || '', 4);

  const handleProductClick = (item) => {
    navigateToBidDetail(item.id);
    // Prefetch suggestions for the next product
    prefetchSimilarProducts(item.id);
  };

  // Show different loading states based on what's cached
  const showLoading = isLoading && suggestions.length === 0;
  const hasAnyCachedData = suggestions.length > 0 || similarProducts?.length;

  // If we have cached data, show it immediately
  if (hasAnyCachedData) {
    const displaySuggestions = suggestions.slice(0, maxItems);
    
    return (
      <div className={`suggested-products ${className}`}>
        {showTitle && (
          <div className="suggested-products__header">
            <h3 className="suggested-products__title">
              <i className="bi bi-lightbulb me-2"></i>
              Suggested for You
            </h3>
            <div className="suggested-products__cache-info">
              <small className="text-muted">
                {/* Show cache status for debugging */}
                <span className={`cache-indicator ${!isLoading ? 'cached' : 'loading'}`}>
                  <i className={`bi ${!isLoading ? 'bi-lightning-fill' : 'bi-arrow-clockwise'}`}></i>
                  {!isLoading ? 'Cached' : 'Loading...'}
                </span>
                {similarProductsState.data?.length && (
                  <span className="ms-2 text-success">
                    <i className="bi bi-check-circle-fill"></i>
                    Similar cached
                  </span>
                )}
              </small>
            </div>
          </div>
        )}

        <div className="suggested-products__grid">
          {displaySuggestions.map((suggestion, index) => {
            // Create an Item instance for the AuctionCard
            const itemData = {
              id: suggestion.id,
              title: suggestion.title,
              image: suggestion.image || '',
              currentBid: suggestion.currentBid,
              category: suggestion.category,
              timeLeft: '2d 5h', // Mock time left
              bidCount: Math.floor(suggestion.confidence * 50), // Mock bid count based on confidence
              description: `Suggested based on ${suggestion.reason.replace('_', ' ')}`,
              seller: 'Marketplace',
              condition: 'Good',
              location: 'Various',
              shippingCost: 0
            };
            
            const item = Item.fromApiResponse(itemData);
            
            return (
              <div key={`suggestion-${suggestion.id}-${index}`} className="suggested-products__item">
                <AuctionCard
                  item={item}
                  onClick={handleProductClick}
                  variant="full"
                />
                {/* Show suggestion reason for debugging */}
                {process.env.NODE_ENV === 'development' && (
                  <div className="suggestion-meta">
                    <small className="text-muted">
                      {suggestion.reason && (
                        <span className="suggestion-reason">
                          {suggestion.reason.replace('_', ' ')} 
                          ({Math.round(suggestion.confidence * 100)}%)
                        </span>
                      )}
                    </small>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Cache performance info (development only) */}
        {process.env.NODE_ENV === 'development' && (
          <div className="suggested-products__debug mt-3">
            <details>
              <summary className="text-muted small">Cache Performance</summary>
              <div className="small text-muted mt-2">
                <div>User suggestions: {userSuggestionsState.isLoading ? 'Loading...' : `${userSuggestionsState.data?.suggestions.length || 0} cached`}</div>
                <div>Similar products: {similarProductsState.isLoading ? 'Loading...' : `${similarProductsState.data?.length || 0} cached`}</div>
                <div>Trending products: {trendingProductsState.isLoading ? 'Loading...' : `${trendingProductsState.data?.length || 0} cached`}</div>
                <div>Total displayed: {displaySuggestions.length}</div>
              </div>
            </details>
          </div>
        )}
      </div>
    );
  }

  // Loading state when no cached data available
  if (showLoading) {
    return (
      <div className={`suggested-products suggested-products--loading ${className}`}>
        {showTitle && (
          <h3 className="suggested-products__title">
            <i className="bi bi-lightbulb me-2"></i>
            Loading Suggestions...
          </h3>
        )}
        <div className="d-flex justify-content-center py-4">
          <LoadingSpinner size="large" message="Finding products you might like..." />
        </div>
      </div>
    );
  }

  // Error state or no suggestions
  if (error) {
    return (
      <div className={`suggested-products suggested-products--error ${className}`}>
        {showTitle && (
          <h3 className="suggested-products__title">
            <i className="bi bi-lightbulb me-2"></i>
            Suggested Products
          </h3>
        )}
        <div className="text-center py-4 text-muted">
          <i className="bi bi-exclamation-circle mb-2" style={{ fontSize: '2rem' }}></i>
          <p>Unable to load suggestions at the moment.</p>
          <small>Please try again later.</small>
        </div>
      </div>
    );
  }

  // Empty state
  return (
    <div className={`suggested-products suggested-products--empty ${className}`}>
      {showTitle && (
        <h3 className="suggested-products__title">
          <i className="bi bi-lightbulb me-2"></i>
          Suggested Products
        </h3>
      )}
      <div className="text-center py-4 text-muted">
        <i className="bi bi-search mb-2" style={{ fontSize: '2rem' }}></i>
        <p>Browse more products to get personalized suggestions!</p>
      </div>
    </div>
  );
};

export default SuggestedProducts;
