import './Header.scss'
import { Logo, Button } from '../../atoms'
import { SmartCategorySelector, SmartSearchBar, SmartUserActions } from '../'

/**
 * Header Organism Component
 * Single Responsibility: Layout and composition of header elements
 * 
 * Now follows proper atomic design:
 * - Uses pure atoms for basic UI elements
 * - Uses smart organisms for business logic connection
 * - No business logic in this component - just layout
 */
const Header = () => {
    return (
        <header className="app-header bg-white border-bottom sticky-top">
            <div className="container">
                <nav className="navbar navbar-expand-lg navbar-light py-2">
                    {/* Brand Section */}
                    <div className="d-flex align-items-center">
                        <Logo className="me-3" />

                        {/* Categories - Hidden on mobile */}
                        <div className="d-none d-lg-block">
                            <SmartCategorySelector variant="link" />
                        </div>
                    </div>

                    {/* Search Bar - Desktop */}
                    <div className="flex-grow-1 mx-3 d-none d-lg-flex">
                        <SmartSearchBar className="w-100" />
                    </div>

                    {/* Actions Section - Desktop */}
                    <div className="d-none d-lg-flex align-items-center gap-3">
                        <Button
                            variant="link"
                            onClick={() => window.location.href = '/sell'}
                            className="d-none d-md-block"
                        >
                            Sell
                        </Button>

                        <Button
                            variant="link"
                            onClick={() => window.location.href = '/help'}
                            className="d-none d-md-block"
                        >
                            Help
                        </Button>

                        <SmartUserActions />
                    </div>

                    {/* Mobile Menu Toggle - Replace with proper mobile menu later */}
                    <div className="d-lg-none">
                        <Button variant="link" icon="list" />
                    </div>
                </nav>

                {/* Search Bar - Mobile */}
                <div className="d-lg-none pb-2">
                    <SmartSearchBar />
                </div>
            </div>
        </header>
    )
}

export default Header