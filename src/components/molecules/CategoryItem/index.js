import React from 'react';
import './style.css';

/**
 * CategoryItem Molecule Component
 * Pure UI component for displaying a single category item
 */
const CategoryItem = ({ 
  category, 
  isActive = false, 
  onClick,
  className = '',
  isBlurred = false,
  showArrow = null // 'left' | 'right' | null
}) => {
  const handleClick = () => {
    if (onClick) {
      onClick(category);
    }
  };

  const categoryClasses = [
    'category-item',
    isActive ? 'category-item--active' : '',
    isBlurred ? 'category-item--blurred' : '',
    showArrow ? 'category-item--arrow' : '',
    className
  ].filter(Boolean).join(' ');

  return (
    <div 
      className={categoryClasses}
      onClick={handleClick}
      role="button"
      tabIndex={0}
      style={{
        '--category-color': category.color || '#007bff'
      }}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleClick();
        }
      }}
    >
      <div className="category-item__content">
        {showArrow === 'left' && (
          <i className="bi bi-chevron-left category-item__arrow"></i>
        )}
        {showArrow === 'right' && (
          <i className="bi bi-chevron-right category-item__arrow"></i>
        )}
        {!showArrow && (
          <>
            {category.icon && (
              <i className={`${category.icon} category-item__icon`}></i>
            )}
            <span className="category-item__name">{category.name}</span>
          </>
        )}
      </div>
      {isActive && <div className="category-item__active-line"></div>}
    </div>
  );
};

export default CategoryItem;
