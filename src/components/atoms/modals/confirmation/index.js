import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal'

function ConfirmationModal({ body, onHide, show, onClick }) {
  return (
    <>
      <Modal show={show} onHide={onHide}>
        <Modal.Header closeButton>
          <Modal.Title>Confirmation</Modal.Title>
        </Modal.Header>

        <Modal.Body>{body}</Modal.Body>

        <Modal.Footer>
          <Button variant='primary' onClick={onClick}>
            Accept
          </Button>
          <Button variant='secondary' onClick={onHide}>
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}

export default ConfirmationModal
