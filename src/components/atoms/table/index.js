import React from 'react';
import './style.scss';

function Table({ 
  headers = [], 
  data = [], 
  striped = false,
  bordered = false,
  borderless = false,
  hover = false,
  size,
  responsive = false,
  variant,
  className = '',
  ...props 
}) {
  let classes = 'table';
  
  // Add table modifiers
  if (striped) classes += ' table-striped';
  if (bordered) classes += ' table-bordered';
  if (borderless) classes += ' table-borderless';
  if (hover) classes += ' table-hover';
  if (size) classes += ` table-${size}`;
  if (variant) classes += ` table-${variant}`;
  
  // Add custom classes
  if (className) {
    classes += ` ${className}`;
  }

  const tableElement = (
    <table className={classes} {...props}>
      <thead>
        <tr>
          {headers.map((header, index) => (
            <th key={index}>{header}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((row, rowIndex) => (
          <tr key={rowIndex}>
            {row.map((cell, cellIndex) => (
              <td key={cellIndex}>{cell}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );

  if (responsive) {
    return (
      <div className="table-responsive">
        {tableElement}
      </div>
    );
  }

  return tableElement;
}

export default Table;