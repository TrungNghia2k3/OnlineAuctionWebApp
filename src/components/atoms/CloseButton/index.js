import * as React from 'react'
// import classnames from 'classnames'
// import styles from './style.scss'
import { CloseButton as CloseButtonLib} from 'react-bootstrap';

const CloseButton = ({ handleClose }) => {
  return (
      <CloseButtonLib onClick={handleClose}></CloseButtonLib>
  );
}

export default CloseButton;
