import { useState, useRef, useEffect, useCallback } from 'react'

/**
 * useSearchBar Hook
 * Single Responsibility: Handle search business logic
 * Separated from UI components
 */
export const useSearchBar = (onSearch) => {
  const [searchQuery, setSearchQuery] = useState('')
  const [suggestions, setSuggestions] = useState([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const searchRef = useRef(null)
  const suggestionsRef = useRef(null)

  // LocalStorage key for search history
  const SEARCH_HISTORY_KEY = 'searchHistory'
  const MAX_HISTORY_ITEMS = 10

  // Get search history from localStorage
  const getSearchHistory = useCallback(() => {
    try {
      const history = localStorage.getItem(SEARCH_HISTORY_KEY)
      return history ? JSON.parse(history) : []
    } catch (error) {
      console.error('Error reading search history:', error)
      return []
    }
  }, [])

  // Save search to localStorage
  const saveToSearchHistory = useCallback((searchTerm) => {
    try {
      const history = getSearchHistory()
      
      // Remove if already exists to avoid duplicates
      const filteredHistory = history.filter(item => item.toLowerCase() !== searchTerm.toLowerCase())
      
      // Add to beginning and limit to MAX_HISTORY_ITEMS
      const newHistory = [searchTerm, ...filteredHistory].slice(0, MAX_HISTORY_ITEMS)
      
      localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(newHistory))
    } catch (error) {
      console.error('Error saving search history:', error)
    }
  }, [getSearchHistory])

  // Mock suggestions - replace with actual business logic later
  const generateSuggestions = useCallback((query) => {
    const searchHistory = getSearchHistory()
    
    // If no query, show recent searches
    if (!query.trim()) {
      return searchHistory.slice(0, 5)
    }
    
    const mockSuggestions = {
      'a': ['art', 'art deco', 'art photography', 'antiques', 'asian art'],
      'b': ['books', 'bronze', 'baseball cards', 'bikes', 'buttons'],
      'c': ['coins', 'cars', 'comics', 'cameras', 'collectibles'],
      'd': ['diamonds', 'decorations', 'dolls', 'documents', 'drawings'],
      'e': ['electronics', 'ephemera', 'emeralds', 'enamel', 'engravings']
    }
    
    const firstChar = query.toLowerCase().charAt(0)
    const baseSuggestions = mockSuggestions[firstChar] || []
    
    // Get search history for relevant suggestions
    const historySuggestions = searchHistory.filter(item => 
      item.toLowerCase().includes(query.toLowerCase())
    )
    
    // Combine history and mock suggestions, prioritizing history
    const combinedSuggestions = [
      ...historySuggestions,
      ...baseSuggestions.filter(item => 
        item.toLowerCase().includes(query.toLowerCase()) &&
        !historySuggestions.some(historyItem => 
          historyItem.toLowerCase() === item.toLowerCase()
        )
      )
    ]
    
    return combinedSuggestions.slice(0, 5)
  }, [getSearchHistory])

  const handleInputChange = useCallback((e) => {
    const value = e.target.value
    setSearchQuery(value)
    
    const newSuggestions = generateSuggestions(value)
    setSuggestions(newSuggestions)
    setShowSuggestions(newSuggestions.length > 0)
    setSelectedIndex(-1)
  }, [generateSuggestions])

  const handleInputFocus = useCallback(() => {
    const newSuggestions = generateSuggestions(searchQuery)
    setSuggestions(newSuggestions)
    setShowSuggestions(newSuggestions.length > 0)
    setSelectedIndex(-1)
  }, [generateSuggestions, searchQuery])

  const handleSubmit = useCallback((e) => {
    e.preventDefault()
    if (onSearch && searchQuery.trim()) {
      const trimmedQuery = searchQuery.trim()
      
      // Save to search history
      saveToSearchHistory(trimmedQuery)
      
      // Execute search callback
      onSearch(trimmedQuery)
      
      // Hide suggestions
      setShowSuggestions(false)
    }
  }, [onSearch, searchQuery, saveToSearchHistory])

  const handleSuggestionClick = useCallback((suggestion) => {
    setSearchQuery(suggestion)
    setShowSuggestions(false)
    
    // Save to search history
    saveToSearchHistory(suggestion)
    
    // Execute search callback
    if (onSearch) {
      onSearch(suggestion)
    }
  }, [onSearch, saveToSearchHistory])

  const handleKeyDown = useCallback((e) => {
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
  }, [showSuggestions, suggestions, selectedIndex, handleSuggestionClick])

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

  // Clear search history utility function
  const clearSearchHistory = useCallback(() => {
    try {
      localStorage.removeItem(SEARCH_HISTORY_KEY)
      // If currently showing recent searches, update suggestions
      if (!searchQuery.trim()) {
        setSuggestions([])
        setShowSuggestions(false)
      }
    } catch (error) {
      console.error('Error clearing search history:', error)
    }
  }, [searchQuery])

  // Check if current suggestions are recent searches (empty query)
  const isShowingRecentSearches = !searchQuery.trim() && suggestions.length > 0

  return {
    // State
    searchQuery,
    suggestions,
    showSuggestions,
    selectedIndex,
    isShowingRecentSearches,
    
    // Refs
    searchRef,
    suggestionsRef,
    
    // Handlers
    handleInputChange,
    handleInputFocus,
    handleSubmit,
    handleSuggestionClick,
    handleKeyDown,
    
    // State setters
    setSelectedIndex,
    
    // Utilities
    clearSearchHistory,
    getSearchHistory
  }
}
