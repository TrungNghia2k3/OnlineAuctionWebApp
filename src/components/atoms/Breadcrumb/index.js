import './Breadcrumb.scss';

/**
 * Breadcrumb Atom Component
 * Pure UI component for displaying navigation breadcrumbs
 */
const Breadcrumb = ({ items = [], className = '' }) => {
  if (!items.length) return null;

  return (
    <nav aria-label="breadcrumb" className={`breadcrumb-nav ${className}`}>
      <ol className="breadcrumb">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          
          return (
            <li 
              key={index} 
              className={`breadcrumb-item ${isLast ? 'active' : ''}`}
              aria-current={isLast ? 'page' : undefined}
            >
              {isLast ? (
                <span className="breadcrumb-text">{item.name}</span>
              ) : (
                <a href={item.path} className="breadcrumb-link">
                  {item.name}
                </a>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default Breadcrumb;
