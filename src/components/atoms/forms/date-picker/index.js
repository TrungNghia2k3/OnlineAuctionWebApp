import classnames from 'classnames'
import './style.scss'
import DatePickerLib from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'

function DatePicker(props) {
  const wrapperClass = `datePicker ${props.isInvalid ? 'is-invalid' : ''}`
  return <DatePickerLib {...props} wrapperClassName={wrapperClass} className={classnames(props.className)} />
}

export default DatePicker
