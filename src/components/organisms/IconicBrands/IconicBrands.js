import React from 'react';
import { useBrands } from '@/hooks';
import './IconicBrands.scss';

/**
 * IconicBrands Component
 * Displays brand logos in a 2x6 grid layout using API data
 */
const IconicBrands = ({ className = '' }) => {

  const { brands, isLoading, error } = useBrands(true); // Get active brands only
  console.log("Brands: ", brands);
  if (isLoading) {
    return (
      <section className={`iconic-brands ${className}`}>
        <div className="container">
          <div className="iconic-brands__loading">
            <div className="iconic-brands__spinner">
              <i className="bi bi-arrow-clockwise"></i>
            </div>
            <p>Loading brands...</p>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className={`iconic-brands ${className}`}>
        <div className="container">
          <div className="iconic-brands__error">
            <i className="bi bi-exclamation-triangle"></i>
            <p>Unable to load brands at this time.</p>
          </div>
        </div>
      </section>
    );
  }

  if (!brands.length) {
    return (
      <section className={`iconic-brands ${className}`}>
        <div className="container">
          <div className="iconic-brands__empty">
            <i className="bi bi-shop"></i>
            <p>No brands available.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className={`iconic-brands ${className}`}>
      <div className="container">
        <div className="iconic-brands__grid">
          {brands.map((brand) => (
            <div key={brand.id} className="iconic-brands__item">
              <div className="iconic-brands__logo">
                <img
                  src={brand.imagePath}
                  alt={brand.name}
                  title={brand.description || brand.name}
                  loading="lazy"
                />
                {brand.itemCount > 0 && (
                  <div className="iconic-brands__item-count">
                    {brand.itemCount} {brand.itemCount === 1 ? 'item' : 'items'}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default IconicBrands;
