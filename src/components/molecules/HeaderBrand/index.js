import { Logo } from '../../atoms'
import { CategoriesDropdown } from '../../molecules'

/**
 * HeaderBrand Molecule Component
 * Single Responsibility: Handle brand/logo and main navigation elements
 */
const HeaderBrand = ({ className = '' }) => {
  const handleCategorySelect = (category) => {
    // Navigate to category page or filter
    console.log('Selected category:', category)
  }

  return (
    <div className={`d-flex align-items-center ${className}`}>
      {/* Logo */}
      <Logo className="me-3" />

      {/* Categories Dropdown - Hidden on mobile */}
      <div className="d-none d-lg-block">
        <CategoriesDropdown
          onCategorySelect={handleCategorySelect}
          variant="link"
        />
      </div>
    </div>
  )
}

export default HeaderBrand
