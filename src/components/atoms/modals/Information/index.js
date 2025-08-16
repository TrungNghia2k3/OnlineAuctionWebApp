import React from 'react';
import './style.scss';

function InformationModal({ 
  body, 
  children,
  onHide, 
  show = false,
  title = 'Information',
  size = 'lg',
  closeButton = true,
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

  let modalClasses = 'modal fade show';
  let dialogClasses = 'modal-dialog';
  
  if (size === 'sm') {
    dialogClasses += ' modal-sm';
  } else if (size === 'lg') {
    dialogClasses += ' modal-lg';
  } else if (size === 'xl') {
    dialogClasses += ' modal-xl';
  }

  return (
    <div 
      className={modalClasses}
      style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}
      tabIndex="-1"
      onClick={handleBackdropClick}
    >
      <div className={dialogClasses}>
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">{title}</h5>
            {closeButton && (
              <button
                type="button"
                className="btn-close"
                aria-label="Close"
                onClick={onHide}
              ></button>
            )}
          </div>
          <div className="modal-body">
            {body || children}
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onHide}>
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default InformationModal;
