// import styles from './style.scss'
import Label from '../../../atoms/forms/label'
import Input from '../../../atoms/forms/input'
import Form from 'react-bootstrap/Form'

function TextField({ label, placeholder, values, handleChange, touched, errors, name, maxLength, isRequired }) {
  return (
    <div>
      <Label text={label} isRequired={isRequired}></Label>
      <Input
        type='text'
        placeholder={placeholder}
        value={values[name]}
        onChange={handleChange}
        isValid={touched[name] && !errors[name]}
        isInvalid={!!errors[name]}
        name={name}
        className={{ 'input-style': true }}
        maxLength={maxLength}
      />
      <Form.Control.Feedback type='invalid'>{errors[name]}</Form.Control.Feedback>
    </div>
  )
}

export default TextField
