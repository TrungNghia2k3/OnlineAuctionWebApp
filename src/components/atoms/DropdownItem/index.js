/**
 * DropdownItem Atom Component
 * Single Responsibility: Pure dropdown item UI
 * NO business logic, just rendering
 */
const DropdownItem = ({
  children,
  icon,
  onClick,
  href,
  variant = 'default',
  className = '',
  ...props
}) => {
  const variants = {
    default: 'dropdown-item',
    danger: 'dropdown-item text-danger',
    success: 'dropdown-item text-success',
    divider: 'dropdown-divider'
  }

  if (variant === 'divider') {
    return <li><hr className="dropdown-divider" /></li>
  }

  const content = (
    <>
      {icon && <i className={`${icon} me-2`}></i>}
      {children}
    </>
  )

  return (
    <li>
      {href ? (
        <a
          className={`${variants[variant]} ${className}`}
          href={href}
          onClick={onClick}
          {...props}
        >
          {content}
        </a>
      ) : (
        <button
          className={`${variants[variant]} ${className}`}
          onClick={onClick}
          {...props}
        >
          {content}
        </button>
      )}
    </li>
  )
}

export default DropdownItem
