import React from 'react';
import './style.scss';

function CheckRadio({ 
  label,
  checked,
  onChange,
  disabled = false,
  id,
  name,
  value,
  className = '',
  ...props 
}) {
  let wrapperClasses = 'form-check';
  if (className) {
    wrapperClasses += ` ${className}`;
  }

  return (
    <div className={wrapperClasses}>
      <input
        className="form-check-input"
        type="radio"
        id={id}
        name={name}
        value={value}
        checked={checked}
        onChange={onChange}
        disabled={disabled}
        {...props}
      />
      {label && (
        <label className="form-check-label" htmlFor={id}>
          {label}
        </label>
      )}
    </div>
  );
}

export default CheckRadio;
