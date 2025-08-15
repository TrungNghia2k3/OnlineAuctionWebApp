import * as React from 'react'
// import styles from './style.scss'
import Label from '../../../atoms/forms/label';
import Range from '../../../atoms/forms/range';
import Text from '../../../atoms/forms/text';

function RangeBar({ label, value, min, max, step, onChange }) {
  return (
    <div>
      <Label text={label}></Label>
      <Range
        value={value}
        min={min}
        max={max}
        step={step}
        onChange={onChange}
      />
      <Text text={value}></Text>
    </div>
  );
}

export default RangeBar;