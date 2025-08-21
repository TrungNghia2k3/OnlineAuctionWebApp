import { Item } from '../../../models';
import './style.css';

/**
 * AuctionCard Molecule Component
 * Pure UI component for displaying an auction item card
 */
const AuctionCard = ({ 
  item, // Expects an Item instance
  onClick,
  className = ''
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
      {/* Heart/Favorite Icon */}
      <div className="auction-card__favorite">
        <i className="bi bi-heart"></i>
      </div>

      {/* Image Placeholder */}
      <div className="auction-card__image">
        {itemInstance.image ? (
          <img src={itemInstance.image} alt={itemInstance.title} />
        ) : (
          <div className="auction-card__image-placeholder">
            <i className="bi bi-image"></i>
          </div>
        )}
      </div>

      {/* Card Content */}
      <div className="auction-card__content">
        <h6 className="auction-card__title">{itemInstance.title}</h6>
        
        <div className="auction-card__bid-info">
          <div className="auction-card__current-bid">
            <span className="auction-card__bid-label">Current bid</span>
            <span className="auction-card__bid-amount">
              {itemInstance.getFormattedCurrentBid()}
            </span>
          </div>
          
          <div className="auction-card__meta">
            <span className="auction-card__time-left">
              <i className="bi bi-clock"></i>
              {itemInstance.getReadableTimeLeft()}
            </span>
            <span className="auction-card__bid-count">
              {itemInstance.bidCount} bids
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuctionCard;
