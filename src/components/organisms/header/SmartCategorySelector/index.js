import { useCategories } from '@/hooks'
import { useDropdown } from '@/hooks/useDropdown'
import { useNavigation } from '@/hooks/useNavigation'
import { CategorySelector } from '@/components/molecules'

/**
 * SmartCategorySelector Organism Component
 * Single Responsibility: Connect category business logic to CategorySelector UI
 * This is the "smart" component that handles data and logic
 */
const SmartCategorySelector = ({ 
  variant = 'primary',
  className = 'ps-2 pe-0'
}) => {
  // Business logic hooks
  const { categories, isLoading } = useCategories()
  const { isOpen, toggle, handleItemClick } = useDropdown()
  const { navigateToCategory } = useNavigation()

  // Handle category selection with navigation
  const handleCategorySelect = handleItemClick((category) => {
    navigateToCategory(category)
  })

  // Pure UI component with data and callbacks
  return (
    <CategorySelector
      categories={categories}
      isLoading={isLoading}
      onCategorySelect={handleCategorySelect}
      isOpen={isOpen}
      onToggle={toggle}
      variant={variant}
      className={className}
    />
  )
}

export default SmartCategorySelector
