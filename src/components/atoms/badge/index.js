// import styles from './style.scss'
import { Badge as BadgeLib } from 'react-bootstrap'

function Badge({ variant, text }) {
  return <BadgeLib bg={variant}>{text}</BadgeLib>
}

export default Badge
