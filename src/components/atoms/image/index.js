import './style.scss';

function Image({ 
  path, 
  src,
  alt = '',
  rounded = false, 
  roundedCircle = false, 
  fluid = false,
  thumbnail = false,
  className = '', 
  handleClick,
  onClick,
  ...props 
}) {
  let classes = '';
  
  if (rounded) {
    classes += ' rounded';
  }
  if (roundedCircle) {
    classes += ' rounded-circle';
  }
  if (fluid) {
    classes += ' img-fluid';
  }
  if (thumbnail) {
    classes += ' img-thumbnail';
  }
  if (className) {
    classes += ` ${className}`;
  }

  const handleImageClick = handleClick || onClick;
  const imageSrc = path || src;

  return (
    <img
      src={imageSrc}
      alt={alt}
      className={classes.trim()}
      onClick={handleImageClick}
      {...props}
    />
  );
}

export default Image;
