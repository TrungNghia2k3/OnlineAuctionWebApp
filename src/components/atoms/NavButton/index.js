import { Link } from 'react-router-dom'
import './NavButton.scss'

/**
 * NavButton Atom Component
 * Single Responsibility: Render navigation buttons with consistent styling
 */
const NavButton = ({ 
  to, 
  children, 
  variant = 'default',
  icon,
  badge,
  onClick,
  className = '',
  external = false
}) => {
  const variants = {
    default: 'btn btn-outline-primary',
    primary: 'btn btn-primary',
    link: 'nav-link text-dark fw-medium',
    minimal: 'btn btn-link text-dark p-2'
  }

  const buttonClass = `${variants[variant]} ${className} position-relative btn-nav`

  const content = (
    <>
      {icon && <i className={`${icon} ${children ? 'me-1' : ''}`}></i>}
      {children}
      {badge && (
        <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
          {badge}
        </span>
      )}
    </>
  )

  if (external) {
    return (
      <a 
        href={to}
        className={buttonClass}
        onClick={onClick}
        target="_blank"
        rel="noopener noreferrer"
        style={{padding: '1rem 1rem'}}
      >
        {content}
      </a>
    )
  }

  if (to) {
    return (
      <Link to={to} className={buttonClass} onClick={onClick}>
        {content}
      </Link>
    )
  }

  return (
    <button className={buttonClass} onClick={onClick}>
      {content}
    </button>
  )
}

export default NavButton
