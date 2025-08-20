import { useState, useCallback } from 'react'

/**
 * useDropdown Hook
 * Single Responsibility: Handle dropdown state logic
 * Separated from UI components
 */
export const useDropdown = (initialState = false) => {
  const [isOpen, setIsOpen] = useState(initialState)

  const toggle = useCallback(() => {
    setIsOpen(prev => !prev)
  }, [])

  const open = useCallback(() => {
    setIsOpen(true)
  }, [])

  const close = useCallback(() => {
    setIsOpen(false)
  }, [])

  const handleItemClick = useCallback((callback) => {
    return (...args) => {
      if (callback) {
        callback(...args)
      }
      close()
    }
  }, [close])

  return {
    isOpen,
    toggle,
    open,
    close,
    handleItemClick
  }
}
