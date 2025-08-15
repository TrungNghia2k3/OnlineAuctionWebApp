import * as React from 'react'
import Alert from '../../../atoms/alert'
import Image from '../../images/rounded'
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
