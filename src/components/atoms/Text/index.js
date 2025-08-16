import React from 'react';
import './style.scss';

function Text({ 
  text, 
  children,
  className = '',
  muted = false,
  ...props 
}) {
  let classes = 'form-text';
  
  if (muted) {
    classes += ' text-muted';
  }
  
  if (className) {
    classes += ` ${className}`;
  }

  return (
    <small className={classes} {...props}>
      {text || children}
    </small>
  );
}

export default Text;
