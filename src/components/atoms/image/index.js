import * as React from 'react'
import classnames from 'classnames'
// import styles from './style.scss'
import { Image as ImageLibrary } from 'react-bootstrap'

function Image({ path, rounded, roundedCircle, className, handleClick }) {
  return (
    <ImageLibrary
      src={path}
      rounded={rounded}
      roundedCircle={roundedCircle}
      className={classnames({ ...className })}
      onClick={handleClick}
    />
  )
}

export default Image
