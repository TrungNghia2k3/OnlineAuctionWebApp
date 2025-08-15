import * as React from 'react'
import classnames from 'classnames'

const Body = ({ children, className }) => {
  return <div className={classnames({ ...className })}>{children}</div>
}

export default Body
