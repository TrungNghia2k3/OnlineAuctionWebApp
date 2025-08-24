import { useAuth } from '@/hooks'
import { useDropdown } from '@/hooks/useDropdown'
import { useNavigation } from '@/hooks/useNavigation'
import { Button } from '../../../atoms'
import { IconButton, UserMenu } from '../../../molecules'
import './SmartUserActions.scss'

/**
 * SmartUserActions Organism Component
 * Single Responsibility: Connect auth/user business logic to UI components
 * This is the "smart" component that handles data and logic
 */
const SmartUserActions = ({ className = '' }) => {
  // Business logic hooks
  const { isAuthenticated, currentUser, logout } = useAuth()
  const { isOpen, toggle, handleItemClick } = useDropdown()
  const { navigateTo } = useNavigation()

  // Handle user actions with navigation
  const handleProfileClick = handleItemClick(() => {
    navigateTo('/profile')
  })

  const handleBidsClick = handleItemClick(() => {
    navigateTo('/my-bids')
  })

  const handleItemsClick = handleItemClick(() => {
    navigateTo('/my-items')
  })

  const handleLogout = handleItemClick(() => {
    logout()
  })

  const handleLoginClick = () => {
    navigateTo('/login')
  }

  const handleFavoritesClick = () => {
    navigateTo('/favorites')
  }

  return (
    <div className={`d-flex align-items-center gap-2 ${className}`}>
      {/* Favorites - Only for authenticated users */}
      {isAuthenticated() && (
        <IconButton
          icon="heart"
          badge="3" // This would come from favorites count
          variant="minimal"
          onClick={handleFavoritesClick}
          title="Favorites"
        />
      )}

      {/* Authentication Actions */}
      {isAuthenticated() ? (
        <UserMenu
          user={currentUser}
          isOpen={isOpen}
          onToggle={toggle}
          onProfileClick={handleProfileClick}
          onBidsClick={handleBidsClick}
          onItemsClick={handleItemsClick}
          onLogout={handleLogout}
        />
      ) : (
        <Button
          variant="primary"
          onClick={handleLoginClick}
          className="main-color text-white border border-0 rounded-0 btn-sign-in"
        >
          Sign in
        </Button>
      )}
    </div>
  )
}

export default SmartUserActions
