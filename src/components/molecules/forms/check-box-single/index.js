import * as React from 'react'
// import styles from './style.scss'
import Label from '../../../atoms/forms/label'
import CheckBox from '../../../atoms/forms/check-box'

function CheckBoxSingle({ name, label, values, handleChange, labelCheckBox, className, type }) {
  const renderLabel = () => {
    if (!label) {
      return
    }
    return <Label text={label}></Label>
  }
  return (
    <form>
      {renderLabel}
      <CheckBox
        className={className}
        name={name}
        value={values && values[name]}
        checked={values && name ? values[name] : values}
        onChange={handleChange}
        label={labelCheckBox}
        type={type ? type : 'checkbox'}
      />
    </form>
  )
}

export default CheckBoxSingle
