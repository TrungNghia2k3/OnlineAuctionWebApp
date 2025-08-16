import React from 'react';
import './style.scss';

function Input({ 
  type = 'text',
  placeholder,
  value,
  onChange,
  disabled = false,
  size,
  isInvalid = false,
  isValid = false,
  className = '',
  innerRef,
  ...props 
}) {
  let classes = 'form-control';
  
  // Add size
  if (size) {
    classes += ` form-control-${size}`;
  }
  
  // Add validation states
  if (isInvalid) {
    classes += ' is-invalid';
  }
  if (isValid) {
    classes += ' is-valid';
  }
  
  // Add custom classes
  if (className) {
    classes += ` ${className}`;
  }

  return (
    <input
      ref={innerRef}
      type={type}
      className={classes}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      disabled={disabled}
      {...props}
    />
  );
}

export default Input;
