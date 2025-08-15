import React from 'react'
import classnames from 'classnames'
import { Button as ButtonLib } from 'react-bootstrap'
import './style.scss'

function Button(props) {
  return <ButtonLib {...props} className={classnames(props.className)}></ButtonLib>
}

export default Button
