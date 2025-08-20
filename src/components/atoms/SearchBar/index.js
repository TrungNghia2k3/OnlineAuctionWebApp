import { useState, useRef, useEffect } from 'react'

/**
 * SearchBar Atom Component
 * Single Responsibility: Handle search input and submission
 */
const SearchBar = ({
  placeholder = "Search for brand, model, artist...",
  onSearch,
  className = '',
  size = 'default'
}) => {
  const [searchQuery, setSearchQuery] = useState('')
  const [suggestions, setSuggestions] = useState([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const searchRef = useRef(null)
  const suggestionsRef = useRef(null)

  // Mock suggestions - replace with actual business logic later
  const generateSuggestions = (query) => {
    if (!query.trim()) return []
    
    const mockSuggestions = {
      'a': ['art', 'art deco', 'art photography', 'antiques', 'asian art'],
      'b': ['books', 'bronze', 'baseball cards', 'bikes', 'buttons'],
      'c': ['coins', 'cars', 'comics', 'cameras', 'collectibles'],
      'd': ['diamonds', 'decorations', 'dolls', 'documents', 'drawings'],
      'e': ['electronics', 'ephemera', 'emeralds', 'enamel', 'engravings']
    }
    
    const firstChar = query.toLowerCase().charAt(0)
    const baseSuggestions = mockSuggestions[firstChar] || []
    
    return baseSuggestions.filter(item => 
      item.toLowerCase().includes(query.toLowerCase())
    ).slice(0, 5)
  }

  const handleInputChange = (e) => {
    const value = e.target.value
    setSearchQuery(value)
    
    if (value.trim()) {
      const newSuggestions = generateSuggestions(value)
      setSuggestions(newSuggestions)
      setShowSuggestions(newSuggestions.length > 0)
      setSelectedIndex(-1)
    } else {
      setSuggestions([])
      setShowSuggestions(false)
      setSelectedIndex(-1)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (onSearch && searchQuery.trim()) {
      onSearch(searchQuery.trim())
      setShowSuggestions(false)
    }
  }

  const handleSuggestionClick = (suggestion) => {
    setSearchQuery(suggestion)
    setShowSuggestions(false)
    if (onSearch) {
      onSearch(suggestion)
    }
  }

  const handleKeyDown = (e) => {
    if (!showSuggestions) return

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setSelectedIndex(prev => 
          prev < suggestions.length - 1 ? prev + 1 : prev
        )
        break
      case 'ArrowUp':
        e.preventDefault()
        setSelectedIndex(prev => prev > 0 ? prev - 1 : -1)
        break
      case 'Enter':
        if (selectedIndex >= 0) {
          e.preventDefault()
          handleSuggestionClick(suggestions[selectedIndex])
        }
        break
      case 'Escape':
        setShowSuggestions(false)
        setSelectedIndex(-1)
        break
      default:
        // No action needed for other keys
        break
    }
  }

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSuggestions(false)
        setSelectedIndex(-1)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const sizeClasses = {
    small: 'form-control-sm',
    default: '',
    large: 'form-control-lg'
  }

  return (
    <div className={`position-relative ${className}`} ref={searchRef}>
      <form onSubmit={handleSubmit} className="d-flex" role="search">
        <div 
          className="d-flex align-items-center px-3 py-2 w-100"
          style={{ 
            backgroundColor: '#F0F1F5',
            border: 'none'
          }}
        >
          <i 
            className="bi bi-search me-3" 
            style={{ 
              color: 'var(--color-main)',
              fontSize: '16px'
            }}
          ></i>
          <input
            type="search"
            className={`flex-grow-1 ${sizeClasses[size]}`}
            placeholder={placeholder}
            value={searchQuery}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            aria-label="Search"
            id="search-input"
            autoComplete="off"
            style={{
              border: 'none',
              outline: 'none',
              backgroundColor: 'transparent',
              boxShadow: 'none'
            }}
          />
        </div>
      </form>
      
      {/* Suggestions Dropdown */}
      {showSuggestions && suggestions.length > 0 && (
        <div 
          className="position-absolute w-100 bg-white shadow-sm rounded-3 mt-1"
          style={{ 
            top: '100%', 
            zIndex: 1000,
            maxHeight: '200px',
            overflowY: 'auto',
            border: '1px solid #e9ecef'
          }}
          ref={suggestionsRef}
        >
          {suggestions.map((suggestion, index) => (
            <div
              key={suggestion}
              className={`px-3 py-2 cursor-pointer ${
                index === selectedIndex ? 'bg-light' : 'bg-white'
              } ${index === 0 ? 'rounded-top-3' : ''} ${index === suggestions.length - 1 ? 'rounded-bottom-3' : ''}`}
              onClick={() => handleSuggestionClick(suggestion)}
              onMouseEnter={() => setSelectedIndex(index)}
              style={{ cursor: 'pointer' }}
            >
              <i className="bi bi-search text-muted me-2"></i>
              {suggestion}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default SearchBar;
