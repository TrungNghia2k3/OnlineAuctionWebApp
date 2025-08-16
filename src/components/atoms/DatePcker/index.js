import React from 'react';
import './style.scss';

function DatePicker({ 
  isInvalid = false,
  className = '',
  type = 'date',
  value,
  onChange,
  disabled = false,
  ...props 
}) {
  let classes = 'form-control datePicker';
  
  if (isInvalid) {
    classes += ' is-invalid';
  }
  
  if (className) {
    classes += ` ${className}`;
  }

  return (
    <input 
      type={type}
      className={classes}
      value={value}
      onChange={onChange}
      disabled={disabled}
      {...props}
    />
  );
}

export default DatePicker;
