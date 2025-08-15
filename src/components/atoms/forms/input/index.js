import classnames from 'classnames'
// import styles from './style.scss'
import { Form } from 'react-bootstrap'

function Input(props) {
  return <Form.Control ref={props.innerRef} {...props} className={classnames(props.className)} />
}

export default Input
