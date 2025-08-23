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
} as const

type LoadingState = typeof LOADING_STATES[keyof typeof LOADING_STATES]

interface UseSequentialLoadingReturn {
  loadingState: LoadingState
  markSectionLoaded: (section: LoadingState) => void
  isSectionLoaded: (section: LoadingState) => boolean
  canShowSection: (section: LoadingState) => boolean
  resetLoading: () => void
  isPageLoaded: boolean
  isInitialLoading: boolean
}

/**
 * Custom hook for managing sequential page loading
 * Ensures components load in order: Header -> Body -> Footer
 */
export const useSequentialLoading = (): UseSequentialLoadingReturn => {
  const [loadingState, setLoadingState] = useState<LoadingState>(LOADING_STATES.INITIAL)
  const [completedStates, setCompletedStates] = useState<Set<LoadingState>>(new Set())

  // Mark a section as loaded
  const markSectionLoaded = useCallback((section: LoadingState) => {
    setCompletedStates(prev => {
      const newSet = new Set(prev)
      newSet.add(section)
      return newSet
    })
  }, [])

  // Check if a section is loaded
  const isSectionLoaded = useCallback((section: LoadingState) => {
    return completedStates.has(section)
  }, [completedStates])

  // Check if we can show a section (previous sections are loaded)
  const canShowSection = useCallback((section: LoadingState) => {
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
    setCompletedStates(new Set<LoadingState>())
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
