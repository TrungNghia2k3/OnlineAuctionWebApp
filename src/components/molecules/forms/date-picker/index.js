import './style.scss'
import Label from '../../../atoms/forms/label'
import DatePickerAtom from '../../../atoms/forms/date-picker'
import Form from 'react-bootstrap/Form'

function DatePicker({ label, placeholder, selected, name, values, setFieldValue, touched, errors, className }) {
  const handleSelect = (selected) => {
    return setFieldValue(name, selected)
  }

  const handleChange = (selected) => {
    return setFieldValue(name, selected ?? new Date())
  }

  return (
    <div>
      <Label text={label}></Label>
      <DatePickerAtom
        name={name}
        placeholder={placeholder}
        selected={setFieldValue ? values[name] : selected}
        onSelect={handleSelect}
        onChange={handleChange}
        isValid={touched[name] && !errors[name]}
        isInvalid={!!errors[name]}
        className={className}
        dateFormat='yyyy/MM/dd'
      />
      <Form.Control.Feedback type='invalid'>{errors[name]}</Form.Control.Feedback>
    </div>
  )
}

export default DatePicker
