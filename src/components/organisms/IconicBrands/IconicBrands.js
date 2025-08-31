import React from 'react';
import brands from '@/data/brands';
import './IconicBrands.scss';

/**
 * IconicBrands Component
 * Displays brand logos in a 2x6 grid layout
 */
const IconicBrands = ({ className = '' }) => {
  return (
    <section className={`iconic-brands ${className}`}>
      <div className="container">
        <div className="iconic-brands__grid">
          {brands.map((brand, index) => (
            <div key={brand.name} className="iconic-brands__item">
              <div className="iconic-brands__logo">
                <img 
                  src={brand.image} 
                  alt={brand.name}
                  loading="lazy"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default IconicBrands;
