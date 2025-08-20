import { Button, Icon, Badge } from '../../atoms'

/**
 * IconButton Molecule Component
 * Single Responsibility: Combine Icon + Button + optional Badge
 * NO business logic - just UI composition
 */
const IconButton = ({
  icon,
  badge,
  children,
  badgeVariant = 'danger',
  onClick,
  className = '',
  ...buttonProps
}) => {
  return (
    <div className={`position-relative ${className}`}>
      <Button onClick={onClick} {...buttonProps}>
        <Icon name={icon} />
        {children && <span className="ms-2">{children}</span>}
      </Button>
      {badge && (
        <Badge 
          variant={badgeVariant} 
          position="top-right"
          size="small"
        >
          {badge}
        </Badge>
      )}
    </div>
  )
}

export default IconButton
