/**
 * Button Atom Component
 * Single Responsibility: Pure UI button with variants
 * NO business logic, NO state, NO API calls
 */
const Button = ({
  children,
  variant = 'primary',
  size = 'default',
  icon,
  disabled = false,
  className = '',
  onClick,
  type = 'button',
  ...props
}) => {
  const variants = {
    primary: 'btn btn-primary',
    secondary: 'btn btn-secondary',
    outline: 'btn btn-outline-primary',
    link: 'btn btn-link',
    minimal: 'btn btn-link p-1',
    ghost: 'btn btn-ghost'
  }

  const sizes = {
    small: 'btn-sm',
    default: '',
    large: 'btn-lg'
  }

  return (
    <button
      type={type}
      className={`${variants[variant]} ${sizes[size]} ${className}`}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      {icon && <i className={`${icon} ${children ? 'me-2' : ''}`}></i>}
      {children}
    </button>
  )
}

export default Button
