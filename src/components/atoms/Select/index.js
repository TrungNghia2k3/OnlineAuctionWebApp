import React from 'react';
import './style.scss';

function Select({ 
  options = [], 
  value, 
  onChange, 
  placeholder,
  disabled = false,
  size,
  isInvalid = false,
  isValid = false,
  className = '',
  ...props 
}) {
  let classes = 'form-select';
  
  // Add size
  if (size) {
    classes += ` form-select-${size}`;
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
    <select 
      className={classes} 
      value={value} 
      onChange={onChange}
      disabled={disabled}
      {...props}
    >
      {placeholder && (
        <option value="" disabled>
          {placeholder}
        </option>
      )}
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}

export default Select;