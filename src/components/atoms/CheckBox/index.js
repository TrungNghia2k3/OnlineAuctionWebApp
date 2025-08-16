import React from 'react';
import './style.scss';

function CheckBox({ 
  type = 'checkbox',
  label,
  checked,
  onChange,
  disabled = false,
  id,
  name,
  value,
  isInvalid = false,
  className = '',
  ...props 
}) {
  let inputClasses = 'form-check-input';
  if (isInvalid) {
    inputClasses += ' is-invalid';
  }

  const labelClasses = 'form-check-label';
  
  let wrapperClasses = 'form-check';
  if (className) {
    wrapperClasses += ` ${className}`;
  }

  return (
    <div className={wrapperClasses}>
      <input
        className={inputClasses}
        type={type}
        id={id}
        name={name}
        value={value}
        checked={checked}
        onChange={onChange}
        disabled={disabled}
        {...props}
      />
      {label && (
        <label className={labelClasses} htmlFor={id}>
          {label}
        </label>
      )}
    </div>
  );
}

export default CheckBox;
