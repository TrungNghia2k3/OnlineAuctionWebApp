import './style.scss'
import React, { useState } from 'react'
import Label from '../../../atoms/forms/label'
import Input from '../../../atoms/forms/input'
import { Form, InputGroup, Button } from 'react-bootstrap'
import { Eye, EyeSlash } from 'react-bootstrap-icons'

function PasswordField({ label, placeholder, values, handleChange, name, errors, touched, maxLength }) {
  const [showPassword, setShowPassword] = useState(false)

  return (
    <div>
      <Label text={label} className={{ 'label-password': true }}></Label>
      <Form.Group>
        <InputGroup>
          <Input
            type={showPassword ? 'text' : 'password'}
            name={name}
            placeholder={placeholder}
            value={values[name]}
            onChange={handleChange}
            className={{ 'input-style': true }}
            maxLength={maxLength}
            isValid={touched[name] && !errors[name]}
            isInvalid={!!errors[name]}
          />
          <Button variant='outline-secondary' onClick={() => setShowPassword(!showPassword)}>
            {showPassword ? <EyeSlash /> : <Eye />}
          </Button>
          <Form.Control.Feedback type='invalid'>{errors[name]}</Form.Control.Feedback>
        </InputGroup>
      </Form.Group>
    </div>
  )
}

export default PasswordField
