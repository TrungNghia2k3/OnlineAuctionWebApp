import { useSearchBar } from '@/hooks'

/**
 * SearchBar Atom Component
 * Single Responsibility: Pure UI for search input and suggestions display
 * Business logic moved to useSearchBar hook
 */
const SearchBar = ({
  placeholder = "Search for brand, model, artist...",
  onSearch,
  className = '',
  size = 'default'
}) => {
  // Business logic from hook
  const {
    searchQuery,
    suggestions,
    showSuggestions,
    selectedIndex,
    isShowingRecentSearches,
    searchRef,
    suggestionsRef,
    handleInputChange,
    handleInputFocus,
    handleSubmit,
    handleSuggestionClick,
    handleKeyDown,
    setSelectedIndex,
    clearSearchHistory
  } = useSearchBar(onSearch)

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
            onFocus={handleInputFocus}
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
          {/* Recent Searches Header */}
          {isShowingRecentSearches && (
            <div className="d-flex justify-content-between align-items-center px-3 py-2 border-bottom bg-light rounded-top-3">
              <span className="text-muted fw-bold small text-uppercase">
                Recent Searches
              </span>
              <button
                className="btn btn-link btn-sm text-muted p-0"
                onClick={clearSearchHistory}
                style={{ 
                  fontSize: '12px',
                  textDecoration: 'none'
                }}
              >
                Clear
              </button>
            </div>
          )}
          
          {/* Suggestions List */}
          {suggestions.map((suggestion, index) => (
            <div
              key={suggestion}
              className={`px-3 py-2 cursor-pointer ${
                index === selectedIndex ? 'bg-light' : 'bg-white'
              } ${index === 0 && !isShowingRecentSearches ? 'rounded-top-3' : ''} ${index === suggestions.length - 1 ? 'rounded-bottom-3' : ''}`}
              onClick={() => handleSuggestionClick(suggestion)}
              onMouseEnter={() => setSelectedIndex(index)}
              style={{ cursor: 'pointer' }}
            >
              <i className={`bi ${isShowingRecentSearches ? 'bi-clock-history' : 'bi-search'} text-muted me-2`}></i>
              {suggestion}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default SearchBar;
