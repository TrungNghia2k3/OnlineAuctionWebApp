import React from 'react';
import './style.scss';

function ConfirmationModal({ 
  body, 
  onHide, 
  show = false, 
  onClick,
  title = 'Confirmation',
  acceptText = 'Accept',
  cancelText = 'Cancel',
  backdrop = true,
  keyboard = true 
}) {
  const handleBackdropClick = (e) => {
    if (backdrop && e.target === e.currentTarget) {
      onHide && onHide();
    }
  };

  React.useEffect(() => {
    const handleKeyDown = (e) => {
      if (keyboard && e.key === 'Escape') {
        onHide && onHide();
      }
    };

    if (show && keyboard) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [show, keyboard, onHide]);

  if (!show) return null;

  return (
    <div 
      className="modal fade show"
      style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}
      tabIndex="-1"
      onClick={handleBackdropClick}
    >
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">{title}</h5>
            <button
              type="button"
              className="btn-close"
              aria-label="Close"
              onClick={onHide}
            ></button>
          </div>
          <div className="modal-body">
            {body}
          </div>
          <div className="modal-footer">
            <button 
              type="button" 
              className="btn btn-primary" 
              onClick={onClick}
            >
              {acceptText}
            </button>
            <button 
              type="button" 
              className="btn btn-secondary" 
              onClick={onHide}
            >
              {cancelText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ConfirmationModal
