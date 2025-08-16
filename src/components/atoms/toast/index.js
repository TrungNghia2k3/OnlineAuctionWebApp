import React from 'react';
import ImageRounded from '../../molecules/Rounded';
import './style.scss';

function Toast({ 
  headerIcon, 
  headerTitle, 
  children, 
  show = true,
  autohide = false,
  delay = 5000,
  onClose,
  className,
  ...props 
}) {
  const [isVisible, setIsVisible] = React.useState(show);

  React.useEffect(() => {
    setIsVisible(show);
  }, [show]);

  React.useEffect(() => {
    if (autohide && isVisible) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        onClose && onClose();
      }, delay);
      return () => clearTimeout(timer);
    }
  }, [autohide, isVisible, delay, onClose]);

  if (!isVisible) return null;

  let classes = 'toast show';
  if (className) {
    classes += ' ' + className;
  }

  return (
    <div className={classes} role="alert" aria-live="assertive" aria-atomic="true" {...props}>
      <div className="toast-header">
        {headerIcon && (
          <ImageRounded 
            path={headerIcon} 
            className="image-rounded me-2" 
            alt="Toast icon"
          />
        )}
        <strong className="me-auto">{headerTitle}</strong>
        <button
          type="button"
          className="btn-close"
          aria-label="Close"
          onClick={() => {
            setIsVisible(false);
            onClose && onClose();
          }}
        ></button>
      </div>
      <div className="toast-body">
        {children}
      </div>
    </div>
  );
}

export default Toast;
