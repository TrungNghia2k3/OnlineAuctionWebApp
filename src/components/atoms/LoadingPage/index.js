import React from 'react';
import './style.scss';

const LoadingPage = ({ 
  variant = 'primary',
  size,
  className = '',
  text = 'Loading...',
  showText = false
}) => {
  let spinnerClasses = `spinner-border text-${variant}`;
  
  if (size === 'sm') {
    spinnerClasses += ' spinner-border-sm';
  }

  let containerClasses = 'loading-overlay';
  if (className) {
    containerClasses += ` ${className}`;
  }

  return (
    <div className={containerClasses}>
      <div className={spinnerClasses} role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
      {showText && (
        <div className="mt-2 text-center">
          {text}
        </div>
      )}
    </div>
  );
};

export default LoadingPage;
