// import styles from './style.scss'
import { Form } from 'react-bootstrap';

function Select({ options, value, onChange }) {
  return (
    <Form.Select value={value} onChange={onChange}>
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </Form.Select>
  );
}

export default Select;