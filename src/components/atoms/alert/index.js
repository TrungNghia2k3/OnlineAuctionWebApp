import * as React from 'react'
// import classnames from 'classnames'
// import styles from './style.scss'
import { Alert as AlertLib} from 'react-bootstrap';

function Alert({ variant, message, show }) {
  return (
      <AlertLib key={variant} variant={variant} show={show}>{message}</AlertLib>
  );
}

export default Alert;
