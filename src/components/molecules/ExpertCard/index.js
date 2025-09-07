import React from 'react';
import './ExpertCard.scss';

/**
 * ExpertCard Component
 * Displays expert information including name, expertise, category, and image
 * 
 * @param {Object} item - Expert data object
 * @param {Function} onClick - Click handler for the card
 * @param {string} className - Additional CSS classes
 */
const ExpertCard = ({ item: expert, onClick, className = '' }) => {
  if (!expert) {
    return null;
  }

  const handleClick = () => {
    if (onClick) {
      onClick(expert);
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleClick();
    }
  };

  return (
    <div 
      className={`expert-card ${className}`}
      onClick={handleClick}
      onKeyPress={handleKeyPress}
      tabIndex={0}
      role="button"
      aria-label={`View expert ${expert.name}`}
    >
      <div className="expert-card__image-container">
        {expert.imagePath ? (
          <img 
            src={expert.imagePath} 
            alt={expert.name}
            className="expert-card__image"
            loading="lazy"
          />
        ) : (
          <div className="expert-card__image-placeholder">
            <i className="bi bi-person-circle"></i>
          </div>
        )}
      </div>
      
      <div className="expert-card__content">
        <h3 className="expert-card__name">{expert.name}</h3>
        <p className="expert-card__expertise">{expert.expertise}</p>
      </div>
    </div>
  );
};

export default ExpertCard;
