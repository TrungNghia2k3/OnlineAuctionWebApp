import './style.scss'
import Label from '../../../atoms/forms/label'
import AutoSuggestAtom from '../../../atoms/forms/auto-suggest'
import Form from 'react-bootstrap/Form'
import { alertMessages } from '../../../../common'

function AutoSuggest({
  label,
  id,
  name,
  labelKey,
  items,
  selected,
  multiple = false,
  placeholder,
  values,
  setFieldValue,
  touched,
  errors,
  isRequired,
}) {
  const handleChange = (selected) => {
    if (selected?.length !== 0) {
      setFieldValue(id, selected[0][id])
      setFieldValue(name, selected)
    }
  }

  const handleInputChange = (inputData) => {
    setFieldValue(id, 0)
    setFieldValue(name, [{ [labelKey]: inputData }])
  }
  return (
    <div>
      <Label text={label} isRequired={isRequired}></Label>
      <AutoSuggestAtom
        id={id}
        name={name}
        labelKey={labelKey}
        options={items}
        onChange={handleChange}
        onInputChange={handleInputChange}
        selected={values ? values[name] : selected}
        multiple={multiple}
        placeholder={placeholder}
        isValid={touched[name] && !errors[name]}
        isInvalid={!!errors[name]}
        emptyLabel={alertMessages.notFoundData}
      />
      <Form.Control.Feedback type='invalid'>{errors[name]}</Form.Control.Feedback>
    </div>
  )
}

export default AutoSuggest
