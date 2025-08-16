import React, { useState } from 'react';
import Label from '../../atoms/Label';
import Input from '../../atoms/Input';
import Button from '../../atoms/Button';
import './style.scss';

function PasswordField({ 
  label, 
  placeholder, 
  values, 
  handleChange, 
  name, 
  errors, 
  touched, 
  maxLength,
  isRequired = false,
  disabled = false,
  className,
  ...props 
}) {
  const [showPassword, setShowPassword] = useState(false);
  const hasError = touched[name] && errors[name];
  const isValid = touched[name] && !errors[name];

  return (
    <div className={`mb-3 ${className || ''}`}>
      <Label 
        text={label} 
        className="label-password"
        isRequired={isRequired}
        htmlFor={name}
      />
      <div className="input-group">
        <Input
          id={name}
          type={showPassword ? 'text' : 'password'}
          name={name}
          placeholder={placeholder}
          value={values[name] || ''}
          onChange={handleChange}
          className="input-style"
          maxLength={maxLength}
          isValid={isValid}
          isInvalid={hasError}
          disabled={disabled}
          {...props}
        />
        <Button
          variant="outline-secondary"
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="btn-outline-secondary"
        >
          <i className={`bi ${showPassword ? 'bi-eye-slash' : 'bi-eye'}`}></i>
        </Button>
      </div>
      {hasError && (
        <div className="invalid-feedback d-block">
          {errors[name]}
        </div>
      )}
    </div>
  );
}

export default PasswordField;
