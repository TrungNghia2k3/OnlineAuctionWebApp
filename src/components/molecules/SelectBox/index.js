import React from 'react';
import Label from '../../atoms/Label';
import Select from '../../atoms/Select';
import './style.scss';

function SelectBox({ 
  label, 
  value, 
  onChange, 
  options = [],
  placeholder,
  isRequired = false,
  disabled = false,
  errors,
  touched,
  name,
  className,
  ...props 
}) {
  const hasError = name && touched && errors && touched[name] && errors[name];
  const isValid = name && touched && !errors && touched[name] && !errors[name];

  return (
    <div className={`mb-3 ${className || ''}`}>
      <Label 
        text={label}
        isRequired={isRequired}
        htmlFor={name}
      />
      <Select 
        id={name}
        options={options} 
        onChange={onChange} 
        value={value}
        placeholder={placeholder}
        disabled={disabled}
        isValid={isValid}
        isInvalid={hasError}
        name={name}
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

export default SelectBox;