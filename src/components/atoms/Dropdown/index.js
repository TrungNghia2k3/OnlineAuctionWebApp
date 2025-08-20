/**
 * Dropdown Atom Component
 * Single Responsibility: Pure dropdown UI structure
 * NO business logic, NO API calls - just UI rendering
 */
const Dropdown = ({
  trigger,
  children,
  isOpen = false,
  onToggle,
  placement = 'bottom-start',
  className = '',
  menuClassName = '',
  showArrow = true,
  arrowIcon = 'chevron-down',
  customToggleClass = '',
  ...props
}) => {
  const placements = {
    'bottom-start': 'dropdown-menu',
    'bottom-end': 'dropdown-menu dropdown-menu-end',
    'top-start': 'dropdown-menu dropup',
    'top-end': 'dropdown-menu dropup dropdown-menu-end'
  }

  // Remove Bootstrap's default dropdown-toggle if we want custom styling
  const toggleClass = customToggleClass || (showArrow ? 'dropdown-toggle' : '')

  return (
    <div className={`dropdown ${className}`} {...props}>
      <div
        className={`${toggleClass} d-flex align-items-center`}
        data-bs-toggle="dropdown"
        aria-expanded={isOpen}
        onClick={onToggle}
        style={{ cursor: 'pointer' }}
      >
        {trigger}
        {showArrow && customToggleClass && (
          <i 
            className={`bi bi-${arrowIcon} ms-1`}
            style={{
              fontSize: '0.8em',
              transition: 'transform 0.2s ease',
              transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)'
            }}
          ></i>
        )}
      </div>
      {isOpen && (
        <ul className={`${placements[placement]} show ${menuClassName}`}>
          {children}
        </ul>
      )}
    </div>
  )
}

export default Dropdown
