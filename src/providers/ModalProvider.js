import { ModalContext } from '../contexts/ModalContext'
import { useModal } from '../hooks/useModal'

/**
 * Modal Provider Component
 * Follows DIP by depending on abstractions (hooks) rather than concrete implementations
 */
export const ModalProvider = ({ children }) => {
  const modalValue = useModal()

  return (
    <ModalContext.Provider value={modalValue}>
      {children}
    </ModalContext.Provider>
  )
}
