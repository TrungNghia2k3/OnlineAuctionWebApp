import React from 'react';
import './style.scss';

function AutoSuggest({ 
  className = '', 
  type = 'text',
  placeholder,
  value,
  onChange,
  disabled = false,
  ...props 
}) {
  let classes = 'form-control';
  
  if (className) {
    classes += ` ${className}`;
  }

  return (
    <input 
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

export default AutoSuggest;
