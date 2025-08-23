import { useState, useCallback } from 'react'

interface UseDropdownReturn {
  isOpen: boolean
  toggle: () => void
  open: () => void
  close: () => void
  handleItemClick: <T extends any[]>(callback?: (...args: T) => void) => (...args: T) => void
}

/**
 * useDropdown Hook
 * Single Responsibility: Handle dropdown state logic
 * Separated from UI components
 */
export const useDropdown = (initialState: boolean = false): UseDropdownReturn => {
  const [isOpen, setIsOpen] = useState<boolean>(initialState)

  const toggle = useCallback(() => {
    setIsOpen(prev => !prev)
  }, [])

  const open = useCallback(() => {
    setIsOpen(true)
  }, [])

  const close = useCallback(() => {
    setIsOpen(false)
  }, [])

  const handleItemClick = useCallback(<T extends any[]>(callback?: (...args: T) => void) => {
    return (...args: T) => {
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
