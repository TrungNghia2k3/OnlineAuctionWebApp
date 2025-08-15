import * as React from 'react'
import Alert from '../../../atoms/alert'
import Image from '../../images/rounded'
import './style.scss'

function AlertFail({ message, show, useIcon }) {
  const renderMessage = () => {
    return (
      <>
        {useIcon && <Image path='/images/alerts/fail.png' className={{ 'alert-icon-style': true }} />}
        <b>{message}</b>
      </>
    )
  }
  return <Alert variant='danger' message={renderMessage()} show={show} />
}

export default AlertFail
