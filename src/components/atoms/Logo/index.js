import { Link } from 'react-router-dom'

/**
 * Logo Atom Component
 * Single Responsibility: Display application logo/brand
 */
const Logo = ({ className = '', variant = 'default' }) => {
  const logoVariants = {
    default: 'navbar-brand fw-bold text-primary',
    compact: 'navbar-brand fw-bold text-primary fs-6',
    footer: 'fw-bold text-light'
  }

  return (
    <Link 
      to="/" 
      className={`${logoVariants[variant]} ${className}`}
      style={{ textDecoration: 'none' }}
    >
        <img src="/logo.svg" alt="Online Auction" />
    </Link>
  )
}

export default Logo
