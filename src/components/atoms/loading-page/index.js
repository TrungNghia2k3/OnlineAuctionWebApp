import './style.scss'
import { Spinner } from 'react-bootstrap'

const LoadingPage = () => {
  return (
    <div className='loading-overlay'>
      <Spinner animation='border' variant='primary' />
    </div>
  )
}

export default LoadingPage
