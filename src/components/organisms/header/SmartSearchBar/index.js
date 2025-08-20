import { useNavigation } from '@/hooks/useNavigation'
import { SearchBar } from '../../../atoms'

/**
 * SmartSearchBar Organism Component
 * Single Responsibility: Connect search business logic to SearchBar UI
 * This is the "smart" component that handles search logic
 */
const SmartSearchBar = ({ 
  className = '',
  placeholder = "Search for brand, model, artist..."
}) => {
  // Business logic hooks
  const { navigateToSearch } = useNavigation()

  // Handle search with navigation
  const handleSearch = (query) => {
    navigateToSearch(query)
  }

  // Pure UI component with callback
  return (
    <SearchBar
      onSearch={handleSearch}
      placeholder={placeholder}
      className={className}
    />
  )
}

export default SmartSearchBar
