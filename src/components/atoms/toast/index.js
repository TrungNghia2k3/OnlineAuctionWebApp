import * as React from 'react'
import classnames from 'classnames'
import { Toast as ToastLib } from 'react-bootstrap'
import ImageRounded from '../../molecules/images/rounded'
import './style.scss'

const Toast = ({ headerIcon, headerTitle, children, className }) => {
  return (
    <ToastLib className={classnames({ ...className })}>
      <ToastLib.Header closeButton={false}>
        <ImageRounded path={headerIcon} className={{ 'image-rounded': true }} />
        <b className='fs-6'>{headerTitle}</b>
      </ToastLib.Header>
      <ToastLib.Body>{children}</ToastLib.Body>
    </ToastLib>
  )
}

export default Toast
