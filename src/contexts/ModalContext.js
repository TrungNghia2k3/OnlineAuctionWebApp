import { createContext, useContext } from 'react'

/**
 * Modal Context
 * Follows ISP by providing only modal-related functionality
 */
export const ModalContext = createContext({
  currentModal: {},
  showModal: () => {},
  hideModal: () => {},
  updateModal: () => {}
})

// Custom hook to use modal context with error handling
export const useModalContext = () => {
  const context = useContext(ModalContext)
  if (!context) {
    throw new Error('useModalContext must be used within a ModalProvider')
  }
  return context
}
