import React from 'react';
import './style.scss';

function Button({ 
  children, 
  variant = 'primary', 
  size, 
  disabled = false, 
  type = 'button',
  outline = false,
  block = false,
  className = '',
  onClick,
  ...props 
}) {
  let classes = 'btn';
  
  // Add variant
  if (outline) {
    classes += ` btn-outline-${variant}`;
  } else {
    classes += ` btn-${variant}`;
  }
  
  // Add size
  if (size) {
    classes += ` btn-${size}`;
  }
  
  // Add block
  if (block) {
    classes += ' w-100';
  }
  
  // Add custom classes
  if (className) {
    classes += ` ${className}`;
  }

  return (
    <button
      type={type}
      className={classes}
      disabled={disabled}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
}

export default Button;
