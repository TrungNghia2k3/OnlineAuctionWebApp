import { Dropdown } from '@/components/atoms'
import { DropdownItem } from '@/components/molecules'

/**
 * CategorySelector Molecule Component
 * Single Responsibility: Combine dropdown UI for category selection
 * NO business logic - receives data and callbacks as props
 */
const CategorySelector = ({
  categories = [],
  isLoading = false,
  onCategorySelect,
  isOpen = false,
  onToggle,
  variant = 'primary',
  className = ''
}) => {
  if (isLoading) {
    return (
      <span style={{ fontSize: '14px', fontWeight: '500', opacity: 0.6 }} className={className}>
        Categories
      </span>
    )
  }

  const trigger = (
    <span style={{ fontSize: '14px', fontWeight: '500' }}>
      Categories
    </span>
  )

  return (
    <Dropdown
      trigger={trigger}
      isOpen={isOpen}
      onToggle={onToggle}
      showArrow={true}
      arrowIcon="chevron-down"
      customToggleClass="pe-2"
      className={className}
    >
      {categories.map((category) => (
        <DropdownItem
          key={category.id}
          onClick={() => onCategorySelect?.(category)}
          icon="tag"
        >
          {category.name}
        </DropdownItem>
      ))}
    </Dropdown>
  )
}

export default CategorySelector
