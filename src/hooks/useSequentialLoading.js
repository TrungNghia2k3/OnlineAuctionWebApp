import { useState, useCallback, useEffect } from 'react'

/**
 * Sequential Loading States
 */
export const LOADING_STATES = {
  INITIAL: 'initial',
  HEADER: 'header',
  BODY: 'body', 
  FOOTER: 'footer',
  COMPLETE: 'complete'
}

/**
 * Custom hook for managing sequential page loading
 * Ensures components load in order: Header -> Body -> Footer
 */
export const useSequentialLoading = () => {
  const [loadingState, setLoadingState] = useState(LOADING_STATES.INITIAL)
  const [completedStates, setCompletedStates] = useState(new Set())

  // Mark a section as loaded
  const markSectionLoaded = useCallback((section) => {
    setCompletedStates(prev => new Set([...prev, section]))
  }, [])

  // Check if a section is loaded
  const isSectionLoaded = useCallback((section) => {
    return completedStates.has(section)
  }, [completedStates])

  // Check if we can show a section (previous sections are loaded)
  const canShowSection = useCallback((section) => {
    switch (section) {
      case LOADING_STATES.HEADER:
        return true // Header can always show first
      case LOADING_STATES.BODY:
        return completedStates.has(LOADING_STATES.HEADER)
      case LOADING_STATES.FOOTER:
        return completedStates.has(LOADING_STATES.HEADER) && 
               completedStates.has(LOADING_STATES.BODY)
      default:
        return false
    }
  }, [completedStates])

  // Update loading state based on completed sections
  useEffect(() => {
    if (completedStates.has(LOADING_STATES.FOOTER) && 
        completedStates.has(LOADING_STATES.BODY) && 
        completedStates.has(LOADING_STATES.HEADER)) {
      setLoadingState(LOADING_STATES.COMPLETE)
    } else if (completedStates.has(LOADING_STATES.BODY) && 
               completedStates.has(LOADING_STATES.HEADER)) {
      setLoadingState(LOADING_STATES.FOOTER)
    } else if (completedStates.has(LOADING_STATES.HEADER)) {
      setLoadingState(LOADING_STATES.BODY)
    } else if (completedStates.size === 0) {
      setLoadingState(LOADING_STATES.HEADER)
    }
  }, [completedStates])

  // Reset loading state
  const resetLoading = useCallback(() => {
    setLoadingState(LOADING_STATES.INITIAL)
    setCompletedStates(new Set())
  }, [])

  // Check if page is fully loaded
  const isPageLoaded = loadingState === LOADING_STATES.COMPLETE

  // Check if still in initial loading
  const isInitialLoading = loadingState === LOADING_STATES.INITIAL

  return {
    loadingState,
    markSectionLoaded,
    isSectionLoaded,
    canShowSection,
    resetLoading,
    isPageLoaded,
    isInitialLoading
  }
}
