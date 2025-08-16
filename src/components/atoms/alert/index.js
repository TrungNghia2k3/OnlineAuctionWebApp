import './style.scss';

function Alert({ 
  variant = 'primary', 
  message, 
  children,
  show = true, 
  dismissible = false,
  onClose,
  className = '',
  ...props 
}) {
  if (!show) return null;

  let classes = `alert alert-${variant}`;
  
  if (dismissible) {
    classes += ' alert-dismissible';
  }
  
  if (className) {
    classes += ` ${className}`;
  }

  return (
    <div className={classes} role="alert" {...props}>
      {message || children}
      {dismissible && (
        <button
          type="button"
          className="btn-close"
          aria-label="Close"
          onClick={onClose}
        ></button>
      )}
    </div>
  );
}

export default Alert;
