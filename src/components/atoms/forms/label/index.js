import { Form } from 'react-bootstrap'
import classnames from 'classnames'
import './style.scss'

function Label(props) {
  var classNamesCombine = classnames({ 'label-style': true, ...props.className })
  return (
    <Form.Label {...props} className={classNamesCombine}>
      {props.text}
      {props.isRequired && <span style={{ color: 'red' }}>*</span>}
    </Form.Label>
  )
}

export default Label
