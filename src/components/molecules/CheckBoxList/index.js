import * as React from 'react'
// import styles from './style.scss'
import Label from '../../../atoms/forms/label'
import CheckBox from '../../../atoms/forms/check-box'

function CheckBoxList({ name, label, options }) {
  const renderLabel = () => {
    if (!label) {
      return
    }
    return <Label text={label}></Label>
  }
  return (
    <form>
      {renderLabel}
      {options.map((option) => (
        <CheckBox name={name} {...option} />
      ))}
    </form>
  )
}

export default CheckBoxList
