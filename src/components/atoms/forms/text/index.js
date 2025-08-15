// import styles from './style.scss'
import { Form } from 'react-bootstrap'

function Text({ text, className }) {
  return <Form.Text className={className}>{text}</Form.Text>
}

export default Text
