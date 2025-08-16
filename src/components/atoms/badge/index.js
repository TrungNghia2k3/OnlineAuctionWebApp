import React from 'react';
import './style.scss';

function Badge({ 
  variant = 'primary', 
  text, 
  children,
  pill = false,
  className = '',
  ...props 
}) {
  let classes = `badge bg-${variant}`;
  
  if (pill) {
    classes += ' rounded-pill';
  }
  
  if (className) {
    classes += ` ${className}`;
  }

  return (
    <span className={classes} {...props}>
      {text || children}
    </span>
  );
}

export default Badge;
