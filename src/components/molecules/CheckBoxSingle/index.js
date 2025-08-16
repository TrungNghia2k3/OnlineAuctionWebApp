import React from 'react';
import Label from '../../atoms/Label';
import CheckBox from '../../atoms/CheckBox';
import './style.scss';

function CheckBoxSingle({ 
  name, 
  label, 
  values, 
  handleChange, 
  labelCheckBox, 
  className, 
  type = 'checkbox',
  isRequired = false,
  disabled = false,
  ...props 
}) {
  const renderLabel = () => {
    if (!label) {
      return null;
    }
    return <Label text={label} isRequired={isRequired} htmlFor={name} />;
  };

  return (
    <div className={`mb-3 ${className || ''}`}>
      {renderLabel()}
      <CheckBox
        id={name}
        name={name}
        value={values && values[name]}
        checked={values && name ? values[name] : values}
        onChange={handleChange}
        label={labelCheckBox}
        type={type}
        disabled={disabled}
        {...props}
      />
    </div>
  );
}

export default CheckBoxSingle;
