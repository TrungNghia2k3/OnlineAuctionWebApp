import { Item } from '../../../models';
import './AuctionCard.scss';

/**
 * AuctionCard Molecule Component
 * Pure UI component for displaying an auction item card
 * 
 * @param {Object} item - Expects an Item instance
 * @param {Function} onClick - Click handler
 * @param {string} className - Additional CSS classes
 * @param {string} variant - Display variant: 'simple' (option 1) or 'full' (option 2, default)
 * 
 * @example
 * // Option 1: Simple variant (only image + bid info)
 * <AuctionCard 
 *   item={item} 
 *   onClick={handleClick} 
 *   variant="simple" 
 * />
 * 
 * @example
 * // Option 2: Full variant (default - image + title + bid info + meta)
 * <AuctionCard 
 *   item={item} 
 *   onClick={handleClick} 
 *   variant="full" 
 * />
 * // or simply:
 * <AuctionCard item={item} onClick={handleClick} />
 * 
 * @example
 * // Usage in Slides component with simple variant
 * <Slides
 *   items={items}
 *   CardComponent={AuctionCard}
 *   cardProps={{ onClick: handleClick, variant: "simple" }}
 *   title="Quick Browse"
 *   slidesPerView={6}
 * />
 */
const AuctionCard = ({ 
  item, // Expects an Item instance
  onClick,
  className = '',
  variant = 'full' // 'simple' or 'full'
}) => {
  // Ensure item is an Item instance
  const itemInstance = item instanceof Item ? item : new Item(item);

  const handleClick = () => {
    if (onClick) {
      onClick(itemInstance);
    }
  };

  return (
    <div 
      className={`auction-card ${className}`}
      onClick={handleClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleClick();
        }
      }}
    >

        <div className="auction-card__favorite">
          <i className="bi bi-heart"></i>
        </div>
 
      {/* Image - Always shown */}
      <div className="auction-card__image">
        {itemInstance.image ? (
          <img className='auction-card__image-img' src={'images/item/' + itemInstance.image} alt={itemInstance.title} />
        ) : (
          <div className="auction-card__image-placeholder">
            <i className="bi bi-image"></i>
          </div>
        )}
      </div>

      {/* Card Content */}
      <div className="auction-card__content">
        {/* Title - Only in full variant */}
        {variant === 'full' && (
          <h6 className="auction-card__title">{itemInstance.title}</h6>
        )}
        
        {/* Bid Info - Always shown */}
        <div className="auction-card__bid-info">
          <div className="auction-card__current-bid">
            <span className="auction-card__bid-label">Current bid</span>
            <span className="auction-card__bid-amount">
              {itemInstance.getFormattedCurrentBid()}
            </span>
          </div>
          
          {/* Meta info - Only in full variant */}
          {variant === 'full' && (
            <div className="auction-card__meta">
              <span className="auction-card__time-left">
                <i className="bi bi-clock"></i>
                {itemInstance.getReadableTimeLeft()}
              </span>
              <span className="auction-card__bid-count">
                {itemInstance.bidCount} bids
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuctionCard;
