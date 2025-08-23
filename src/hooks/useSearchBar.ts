import { useState, useRef, useEffect, useCallback } from 'react'

interface UseSearchBarReturn {
  searchQuery: string
  suggestions: string[]
  showSuggestions: boolean
  selectedIndex: number
  searchRef: React.RefObject<HTMLDivElement>
  suggestionsRef: React.RefObject<HTMLUListElement>
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  handleInputFocus: () => void
  handleSubmit: (e: React.FormEvent) => void
  handleSuggestionClick: (suggestion: string) => void
  handleKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void
  closeSuggestions: () => void
  setSelectedIndex: React.Dispatch<React.SetStateAction<number>>
  clearSearchHistory: () => void
  getSearchHistory: () => string[]
  isShowingRecentSearches: boolean
}

/**
 * useSearchBar Hook
 * Single Responsibility: Handle search business logic
 * Separated from UI components
 */
export const useSearchBar = (onSearch: (query: string) => void): UseSearchBarReturn => {
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [showSuggestions, setShowSuggestions] = useState<boolean>(false)
  const [selectedIndex, setSelectedIndex] = useState<number>(-1)
  const searchRef = useRef<HTMLDivElement>(null)
  const suggestionsRef = useRef<HTMLUListElement>(null)

  // LocalStorage key for search history
  const SEARCH_HISTORY_KEY = 'searchHistory'
  const MAX_HISTORY_ITEMS = 10

  // Get search history from localStorage
  const getSearchHistory = useCallback((): string[] => {
    try {
      const history = localStorage.getItem(SEARCH_HISTORY_KEY)
      return history ? JSON.parse(history) : []
    } catch (error) {
      console.error('Error reading search history:', error)
      return []
    }
  }, [])

  // Save search to localStorage
  const saveToSearchHistory = useCallback((searchTerm: string) => {
    try {
      const history = getSearchHistory()
      
      // Remove if already exists to avoid duplicates
      const filteredHistory = history.filter((item: string) => item.toLowerCase() !== searchTerm.toLowerCase())
      
      // Add to beginning and limit to MAX_HISTORY_ITEMS
      const newHistory = [searchTerm, ...filteredHistory].slice(0, MAX_HISTORY_ITEMS)
      
      localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(newHistory))
    } catch (error) {
      console.error('Error saving search history:', error)
    }
  }, [getSearchHistory])

  // Mock suggestions - replace with actual business logic later
  const generateSuggestions = useCallback((query: string): string[] => {
    const searchHistory = getSearchHistory()
    
    // If no query, show recent searches
    if (!query.trim()) {
      return searchHistory.slice(0, 5)
    }
    
    const mockSuggestions: Record<string, string[]> = {
      'a': ['art', 'art deco', 'art photography', 'antiques', 'asian art'],
      'b': ['books', 'bronze', 'baseball cards', 'bikes', 'buttons'],
      'c': ['coins', 'cars', 'comics', 'cameras', 'collectibles'],
      'd': ['diamonds', 'decorations', 'dolls', 'documents', 'drawings'],
      'e': ['electronics', 'ephemera', 'emeralds', 'enamel', 'engravings']
    }
    
    const firstChar = query.toLowerCase().charAt(0)
    const baseSuggestions = mockSuggestions[firstChar] || []
    
    // Get search history for relevant suggestions
    const historySuggestions = searchHistory.filter((item: string) => 
      item.toLowerCase().includes(query.toLowerCase())
    )
    
    // Combine history and mock suggestions, prioritizing history
    const combinedSuggestions = [
      ...historySuggestions,
      ...baseSuggestions.filter((item: string) => 
        item.toLowerCase().includes(query.toLowerCase()) &&
        !historySuggestions.some((historyItem: string) => 
          historyItem.toLowerCase() === item.toLowerCase()
        )
      )
    ]
    
    return combinedSuggestions.slice(0, 5)
  }, [getSearchHistory])

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
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

  const handleSubmit = useCallback((e: React.FormEvent) => {
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

  const handleSuggestionClick = useCallback((suggestion: string) => {
    setSearchQuery(suggestion)
    setShowSuggestions(false)
    
    // Save to search history
    saveToSearchHistory(suggestion)
    
    // Execute search callback
    if (onSearch) {
      onSearch(suggestion)
    }
  }, [onSearch, saveToSearchHistory])

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
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
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
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

  const closeSuggestions = useCallback(() => {
    setShowSuggestions(false)
    setSelectedIndex(-1)
  }, [])

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
    closeSuggestions,
    
    // State setters
    setSelectedIndex,
    
    // Utilities
    clearSearchHistory,
    getSearchHistory
  }
}
