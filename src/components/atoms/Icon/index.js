/**
 * Icon Atom Component
 * Single Responsibility: Pure icon display
 * NO business logic, NO state
 */
const Icon = ({
  name,
  size = 'default',
  color,
  className = '',
  onClick,
  ...props
}) => {
  const sizes = {
    xs: 'fs-6',
    small: 'fs-5',
    default: 'fs-4',
    large: 'fs-3',
    xl: 'fs-2'
  }

  const iconClasses = `bi bi-${name} ${sizes[size]} ${className}`

  const style = {
    color: color,
    cursor: onClick ? 'pointer' : 'default'
  }

  return (
    <i
      className={iconClasses}
      style={style}
      onClick={onClick}
      {...props}
    />
  )
}

export default Icon
