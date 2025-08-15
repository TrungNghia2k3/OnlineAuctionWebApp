// import styles from './style.scss'
import { Form } from 'react-bootstrap';

function Range({ value, min, max, step, onChange }) {
  return (
    <Form.Range
        value={value}
        min={min}
        max={max}
        step={step}
        onChange={onChange}
    />
  );
}

export default Range;