import { Dropdown, Icon } from '../../atoms'
import { DropdownItem } from '../../molecules'

/**
 * UserMenu Molecule Component
 * Single Responsibility: Combine user dropdown UI
 * NO business logic - receives data and callbacks as props
 */
const UserMenu = ({
  user,
  isOpen = false,
  onToggle,
  onProfileClick,
  onBidsClick,
  onItemsClick,
  onLogout,
  className = ''
}) => {
  const trigger = (
    <div className="d-flex align-items-center">
      <Icon name="person-circle" size="large" />
      <span className="d-none d-md-inline ms-2">
        {user?.username || user?.firstName || 'User'}
      </span>
    </div>
  )

  return (
    <Dropdown
      trigger={trigger}
      isOpen={isOpen}
      onToggle={onToggle}
      placement="bottom-end"
      className={className}
    >
      <DropdownItem
        icon="person"
        onClick={onProfileClick}
      >
        My Profile
      </DropdownItem>

      <DropdownItem
        icon="hammer"
        onClick={onBidsClick}
      >
        My Bids
      </DropdownItem>

      <DropdownItem
        icon="box"
        onClick={onItemsClick}
      >
        My Items
      </DropdownItem>

      <DropdownItem variant="divider" />

      <DropdownItem
        icon="box-arrow-right"
        onClick={onLogout}
        variant="danger"
      >
        Sign Out
      </DropdownItem>
    </Dropdown>
  )
}

export default UserMenu
