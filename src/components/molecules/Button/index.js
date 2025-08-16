import React from 'react'
import ButtonAtom from '../../atoms/Button'
import Image from '../Rounded'
import './style.scss'

function Button({ variant, onClick, text, iconPath, className, disabled, type }) {
  return (
    <ButtonAtom
      variant={variant ?? 'outline-info'}
      onClick={onClick}
      type={type ?? 'button'}
      className={className}
      disabled={disabled}
    >
      {iconPath && <Image path={iconPath} className={{ 'image-button': true }} />}
      {text}
    </ButtonAtom>
  )
}

export default Button
