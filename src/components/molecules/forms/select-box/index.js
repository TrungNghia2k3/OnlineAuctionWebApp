/* eslint-disable no-undef */
// import styles from './style.scss'
import React from 'react';
import Label from '../../../atoms/forms/label';
import Select from '../../../atoms/forms/select';

function SelectBox({ label, value, onChange, options }) {

    return (
        <div>
            <Label text={label}></Label>
            <Select options={options} onChange={onChange} value={value} />
        </div>
    );
}

export default SelectBox;