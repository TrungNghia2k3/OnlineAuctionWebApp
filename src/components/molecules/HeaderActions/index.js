import { useAuth } from '@/hooks'
import { NavButton, NavLink } from '../../atoms'

/**
 * HeaderActions Molecule Component
 * Single Responsibility: Handle header action buttons (Sell, Help, Favorites, Auth)
 */
const HeaderActions = ({ className = '' }) => {
    const { isAuthenticated, currentUser, logout } = useAuth()

    const handleLogout = () => {
        logout()
    }

    return (
        <div className={`d-flex align-items-center gap-2 ${className}`}>
            {/* Sell Button - Always visible */}
            <NavLink
                to="/sell"
                variant="link"
                className="d-none d-md-block"
            >
                Sell
            </NavLink>

            {/* Help Button */}
            <NavLink
                to="/help"
                variant="link"
                className="d-none d-md-block"
            >
                Help
            </NavLink>

            {/* Favorites - Only for authenticated users */}
            {isAuthenticated() && (
                <NavButton
                    to="/favorites"
                    variant="minimal"
                    icon="bi bi-heart"
                    title="Favorites"
                    badge="3" // This would come from favorites count
                />
            )}

            {/* Authentication Actions */}
            {isAuthenticated() ? (
                <div className="dropdown">
                    <button
                        className="btn btn-link dropdown-toggle d-flex align-items-center p-2"
                        type="button"
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                    >
                        <i className="bi bi-person-circle fs-5 me-1"></i>
                        <span className="d-none d-md-inline">{currentUser?.firstName || 'User'}</span>
                    </button>
                    <ul className="dropdown-menu dropdown-menu-end">
                        <li>
                            <NavButton
                                to="/profile"
                                variant="link"
                                icon="bi bi-person"
                                className="dropdown-item"
                            >
                                My Profile
                            </NavButton>
                        </li>
                        <li>
                            <NavButton
                                to="/my-bids"
                                variant="link"
                                icon="bi bi-hammer"
                                className="dropdown-item"
                            >
                                My Bids
                            </NavButton>
                        </li>
                        <li>
                            <NavButton
                                to="/my-items"
                                variant="link"
                                icon="bi bi-box"
                                className="dropdown-item"
                            >
                                My Items
                            </NavButton>
                        </li>
                        <li>
                            <hr className="dropdown-divider" />
                        </li>
                        <li>
                            <button
                                className="dropdown-item text-danger"
                                onClick={handleLogout}
                            >
                                <i className="bi bi-box-arrow-right me-2"></i>
                                Sign Out
                            </button>
                        </li>
                    </ul>
                </div>
            ) : (
                <NavButton
                    to="/login"
                    variant="primary"
                    className="main-color text-white border border-0 rounded-0"
                >
                    Sign in
                </NavButton>
            )}
        </div>
    )
}

export default HeaderActions
