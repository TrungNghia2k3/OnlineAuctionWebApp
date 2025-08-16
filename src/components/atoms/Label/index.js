import React from 'react';
import './style.scss';

function Label({ 
  text, 
  children,
  isRequired = false, 
  htmlFor,
  className = '',
  ...props 
}) {
  let classes = 'form-label label-style';
  
  if (className) {
    classes += ` ${className}`;
  }

  return (
    <label 
      className={classes} 
      htmlFor={htmlFor}
      {...props}
    >
      {text || children}
      {isRequired && <span className="text-danger ms-1">*</span>}
    </label>
  );
}

export default Label;
