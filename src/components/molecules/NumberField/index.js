// import styles from './style.scss'
import Label from '../../atoms/Label'
import Input from '../../atoms/Input'

function NumberField({ label, placeholder, values, handleChange, touched, errors, name, isRequired }) {
  return (
    <div>
      <Label text={label} isRequired={isRequired}></Label>
      <Input
        type='number'
        placeholder={placeholder}
        value={values[name]}
        onChange={handleChange}
        isValid={touched[name] && !errors[name]}
        isInvalid={!!errors[name]}
        name={name}
        className="input-style"
      />
      {errors[name] && <div className="invalid-feedback d-block">{errors[name]}</div>}
    </div>
  )
}

export default NumberField
