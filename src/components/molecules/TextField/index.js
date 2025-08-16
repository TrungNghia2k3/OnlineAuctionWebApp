import React from 'react';
import Label from '../../atoms/Label';
import Input from '../../atoms/Input';
import './style.scss';

function TextField({ 
  label, 
  placeholder, 
  values, 
  handleChange, 
  touched, 
  errors, 
  name, 
  maxLength, 
  isRequired = false,
  type = 'text',
  disabled = false,
  className,
  ...props 
}) {
  const hasError = touched[name] && errors[name];
  const isValid = touched[name] && !errors[name];

  return (
    <div className={`mb-3 ${className || ''}`}>
      <Label 
        text={label} 
        isRequired={isRequired}
        htmlFor={name}
      />
      <Input
        id={name}
        type={type}
        placeholder={placeholder}
        value={values[name] || ''}
        onChange={handleChange}
        isValid={isValid}
        isInvalid={hasError}
        name={name}
        className="input-style"
        maxLength={maxLength}
        disabled={disabled}
        {...props}
      />
      {hasError && (
        <div className="invalid-feedback d-block">
          {errors[name]}
        </div>
      )}
    </div>
  );
}

export default TextField;
