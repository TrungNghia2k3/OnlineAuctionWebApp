import React, { useEffect, useState, useRef } from 'react'
import { LOADING_STATES } from '../../../hooks/useSequentialLoading'
import './SequentialSection.scss'

/**
 * Sequential Section Component
 * Wraps page sections and manages their loading state
 */
const SequentialSection = ({ 
  section,
  children,
  canShow,
  onLoaded,
  delay = 0,
  className = ''
}) => {
  const [isVisible, setIsVisible] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)
  const sectionRef = useRef(null)
  const timeoutRef = useRef(null)

  useEffect(() => {
    if (canShow && !isLoaded) {
      // Add delay before showing section
      timeoutRef.current = setTimeout(() => {
        setIsVisible(true)
        
        // Simulate loading time based on section type
        const loadingTime = getLoadingTime(section)
        
        setTimeout(() => {
          setIsLoaded(true)
          onLoaded(section)
        }, loadingTime)
      }, delay)
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [canShow, section, onLoaded, delay, isLoaded])

  // Reset when canShow becomes false
  useEffect(() => {
    if (!canShow) {
      setIsVisible(false)
      setIsLoaded(false)
    }
  }, [canShow])

  /**
   * Get loading time based on section type
   */
  const getLoadingTime = (sectionType) => {
    switch (sectionType) {
      case LOADING_STATES.HEADER:
        return 300 // Header loads quickly (static content)
      case LOADING_STATES.BODY:
        return 800 // Body takes longer (API calls, dynamic content)
      case LOADING_STATES.FOOTER:
        return 200 // Footer loads quickly (static content)
      default:
        return 500
    }
  }

  const sectionClasses = `
    sequential-section
    ${isVisible ? 'visible' : 'hidden'}
    ${isLoaded ? 'loaded' : 'loading'}
    ${className}
  `.trim()

  return (
    <div 
      ref={sectionRef}
      className={sectionClasses}
      data-section={section}
    >
      {isVisible && children}
    </div>
  )
}

export default SequentialSection
