import {useState} from 'react'
import {useAuth} from '@/hooks'
import {CategoriesDropdown, NavButton} from '../../atoms'

/**
 * MobileMenu Molecule Component
 * Single Responsibility: Handle mobile navigation menu
 */
const MobileMenu = ({className = ''}) => {
    const [isOpen, setIsOpen] = useState(false)
    const {isAuthenticated, currentUser, logout} = useAuth()

    const toggleMenu = () => {
        setIsOpen(!isOpen)
    }

    const closeMenu = () => {
        setIsOpen(false)
    }

    const handleLogout = () => {
        logout()
        closeMenu()
    }

    return (
        <>
            {/* Mobile Menu Toggle Button */}
            <button
                className={`navbar-toggler d-lg-none ${className}`}
                type="button"
                onClick={toggleMenu}
                aria-controls="mobileMenu"
                aria-expanded={isOpen}
                aria-label="Toggle navigation"
            >
                <span className="navbar-toggler-icon"></span>
            </button>

            {/* Mobile Menu Overlay */}
            {isOpen && (
                <div
                    className="position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-50 d-lg-none"
                    style={{zIndex: 1040}}
                    onClick={closeMenu}
                />
            )}

            {/* Mobile Menu Content */}
            <div
                className={`offcanvas offcanvas-end d-lg-none ${isOpen ? 'show' : ''}`}
                id="mobileMenu"
                style={{
                    zIndex: 1045,
                    visibility: isOpen ? 'visible' : 'hidden'
                }}
            >
                <div className="offcanvas-header border-bottom">
                    <h5 className="offcanvas-title">
                        <i className="bi bi-trophy-fill text-primary me-2"></i>
                        OnlineAuction
                    </h5>
                    <button
                        type="button"
                        className="btn-close"
                        onClick={closeMenu}
                        aria-label="Close"
                    ></button>
                </div>

                <div className="offcanvas-body">
                    <div className="d-flex flex-column gap-3">
                        {/* Categories */}
                        <div>
                            <h6 className="text-muted mb-2">Browse</h6>
                            <CategoriesDropdown variant="link"/>
                        </div>

                        <hr/>

                        {/* Main Navigation */}
                        <div>
                            <h6 className="text-muted mb-2">Navigation</h6>
                            <div className="d-flex flex-column gap-2">
                                <NavButton to="/" variant="link" onClick={closeMenu}>
                                    <i className="bi bi-house me-2"></i>Home
                                </NavButton>
                                <NavButton to="/auctions" variant="link" onClick={closeMenu}>
                                    <i className="bi bi-hammer me-2"></i>Auctions
                                </NavButton>
                                <NavButton to="/sell" variant="link" onClick={closeMenu}>
                                    <i className="bi bi-plus-circle me-2"></i>Sell
                                </NavButton>
                            </div>
                        </div>

                        <hr/>

                        {/* User Actions */}
                        {isAuthenticated() ? (
                            <div>
                                <h6 className="text-muted mb-2">My Account</h6>
                                <div className="d-flex flex-column gap-2">
                                    <div className="d-flex align-items-center mb-2">
                                        <i className="bi bi-person-circle fs-4 me-2"></i>
                                        <span className="fw-medium">{currentUser?.firstName || 'User'}</span>
                                    </div>
                                    <NavButton to="/profile" variant="link" onClick={closeMenu}>
                                        <i className="bi bi-person me-2"></i>My Profile
                                    </NavButton>
                                    <NavButton to="/favorites" variant="link" onClick={closeMenu}>
                                        <i className="bi bi-heart me-2"></i>Favorites
                                    </NavButton>
                                    <NavButton to="/my-bids" variant="link" onClick={closeMenu}>
                                        <i className="bi bi-hammer me-2"></i>My Bids
                                    </NavButton>
                                    <NavButton to="/my-items" variant="link" onClick={closeMenu}>
                                        <i className="bi bi-box me-2"></i>My Items
                                    </NavButton>
                                    <button
                                        className="btn btn-link nav-link text-danger text-start p-0"
                                        onClick={handleLogout}
                                    >
                                        <i className="bi bi-box-arrow-right me-2"></i>
                                        Sign Out
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div>
                                <h6 className="text-muted mb-2">Account</h6>
                                <div className="d-flex flex-column gap-2">
                                    <NavButton to="/login" variant="primary" onClick={closeMenu}>
                                        Sign In
                                    </NavButton>
                                    <NavButton to="/register" variant="link" onClick={closeMenu}>
                                        Create Account
                                    </NavButton>
                                </div>
                            </div>
                        )}

                        <hr/>

                        {/* Help */}
                        <div>
                            <NavButton to="/help" variant="link" onClick={closeMenu}>
                                <i className="bi bi-question-circle me-2"></i>Help & Support
                            </NavButton>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default MobileMenu
