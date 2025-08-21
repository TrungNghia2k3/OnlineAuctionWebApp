import { useState } from 'react'
import { useCategories } from '@/hooks'

/**
 * CategoriesDropdown Molecule Component
 * Single Responsibility: Display categories dropdown
 */
const CategoriesDropdown = ({ 
  onCategorySelect,
  className = '',
  variant = 'default'
}) => {
  const { categories, isLoading } = useCategories()
  const [isOpen, setIsOpen] = useState(false)

  const handleCategoryClick = (category) => {
    if (onCategorySelect) {
      onCategorySelect(category)
    }
    setIsOpen(false)
  }

  const variants = {
    default: 'btn btn-outline-primary dropdown-toggle',
    link: 'nav-link dropdown-toggle'
  }

  if (isLoading) {
    return (
      <button className={`${variants[variant]} ${className}`} disabled>
        {/* <i className="bi bi-grid-3x3-gap me-1"></i> */}
        Categories
      </button>
    )
  }

  return (
    <div className="dropdown">
      <button
        className={`${variants[variant]} ${className}`}
        type="button"
        data-bs-toggle="dropdown"
        aria-expanded={isOpen}
        onClick={() => setIsOpen(!isOpen)}
      >
        Categories
      </button>
      <ul className="dropdown-menu">
        {categories?.map((category) => (
          <li key={category.id}>
            <button
              className="dropdown-item d-flex align-items-center"
              onClick={() => handleCategoryClick(category)}
            >
              {category.icon && <i className={`${category.icon} me-2`}></i>}
              {category.name}
            </button>
          </li>
        ))}
        <li><hr className="dropdown-divider" /></li>
        <li>
          <button className="dropdown-item text-primary fw-semibold">
            <i className="bi bi-list me-2"></i>
            View All Categories
          </button>
        </li>
      </ul>
    </div>
  )
}

export default CategoriesDropdown
