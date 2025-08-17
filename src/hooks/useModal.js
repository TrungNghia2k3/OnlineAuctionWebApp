import { useCallback, useState } from 'react'

/**
 * Custom hook for modal management
 * Follows SRP by handling only modal state logic
 */
export const useModal = () => {
  const [currentModal, setCurrentModal] = useState({})

  const showModal = useCallback((modalType, modalProps = {}) => {
    setCurrentModal({
      type: modalType,
      show: true,
      ...modalProps
    })
  }, [])

  const hideModal = useCallback(() => {
    setCurrentModal({})
  }, [])

  const updateModal = useCallback((updates) => {
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
