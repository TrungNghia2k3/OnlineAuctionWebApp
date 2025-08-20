import { useNavigate } from 'react-router-dom'
import {SearchBar} from '../../atoms'

/**
 * HeaderSearch Molecule Component
 * Single Responsibility: Handle search functionality in header
 */
const HeaderSearch = ({ className = '' }) => {
  const navigate = useNavigate()

  const handleSearch = (query) => {
    // Navigate to search results page with query
    navigate(`/search?q=${encodeURIComponent(query)}`)
  }

  return (
    <div className={`flex-grow-1 mx-3 ${className}`}>
      <SearchBar 
        onSearch={handleSearch}
        placeholder="Search for brand, model, artist..."
        className="w-100"
      />
    </div>
  )
}

export default HeaderSearch
