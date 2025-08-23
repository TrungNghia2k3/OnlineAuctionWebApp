import { useCallback, useState } from 'react'

interface ModalState {
  type?: string
  show?: boolean
  [key: string]: any
}

interface UseModalReturn {
  currentModal: ModalState
  showModal: (modalType: string, modalProps?: Record<string, any>) => void
  hideModal: () => void
  updateModal: (updates: Partial<ModalState>) => void
}

/**
 * Custom hook for modal management
 * Follows SRP by handling only modal state logic
 */
export const useModal = (): UseModalReturn => {
  const [currentModal, setCurrentModal] = useState<ModalState>({})

  const showModal = useCallback((modalType: string, modalProps: Record<string, any> = {}) => {
    setCurrentModal({
      type: modalType,
      show: true,
      ...modalProps
    })
  }, [])

  const hideModal = useCallback(() => {
    setCurrentModal({})
  }, [])

  const updateModal = useCallback((updates: Partial<ModalState>) => {
    setCurrentModal(prev => ({
      ...prev,
      ...updates
    }))
  }, [])

  return {
    currentModal,
    showModal,
    hideModal,
    updateModal
  }
}
