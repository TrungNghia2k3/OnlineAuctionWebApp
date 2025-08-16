import * as React from 'react'
import Alert from '../../atoms/Alert'
import Image from '../Rounded'
import './style.scss'

function AlertSuccess({ message, show }) {
  const renderMessage = () => {
    return (
      <>
        <Image path='/images/alerts/success.png' className={{ 'alert-icon-style': true }} />
        <b>{message}</b>
      </>
    )
  }
  return <Alert variant='success' message={renderMessage()} show={show} />
}

export default AlertSuccess
