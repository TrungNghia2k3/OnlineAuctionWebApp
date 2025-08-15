import React from 'react'
import ButtonAtom from '../../../atoms/button'
import Image from '../../images/rounded'
import './style.scss'

function IconButton({ variant, onClick, iconPath, type }) {
  return (
    <ButtonAtom
      type={type ?? 'button'}
      variant={variant ?? 'outline-info'}
      onClick={onClick}
      className={{ 'button-style': true }}
    >
      {<Image path={iconPath} className={{ 'image-button': true }} />}
    </ButtonAtom>
  )
}

export default IconButton
