/**
 * Badge Atom Component
 * Single Responsibility: Pure badge display
 * NO business logic, NO state
 */
const Badge = ({
  children,
  variant = 'primary',
  size = 'default',
  position = 'static',
  className = '',
  ...props
}) => {
  const variants = {
    primary: 'bg-primary',
    secondary: 'bg-secondary',
    success: 'bg-success',
    danger: 'bg-danger',
    warning: 'bg-warning',
    info: 'bg-info',
    light: 'bg-light text-dark',
    dark: 'bg-dark'
  }

  const sizes = {
    small: 'badge-sm',
    default: '',
    large: 'badge-lg'
  }

  const positions = {
    static: '',
    'top-right': 'position-absolute top-0 start-100 translate-middle',
    'top-left': 'position-absolute top-0 start-0 translate-middle',
    'bottom-right': 'position-absolute bottom-0 start-100 translate-middle',
    'bottom-left': 'position-absolute bottom-0 start-0 translate-middle'
  }

  if (!children && children !== 0) return null

  return (
    <span
      className={`badge rounded-pill ${variants[variant]} ${sizes[size]} ${positions[position]} ${className}`}
      {...props}
    >
      {children}
    </span>
  )
}

export default Badge
