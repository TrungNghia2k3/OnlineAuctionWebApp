import React from 'react';
import './style.scss';

function Pagination({ firstNumbers, betweenNumbers, lastNumbers, disabledNumbers, activeNumber, handleClick, number }) {
  const items = [];

  for (let i = 0; i < firstNumbers.length; i++) {
    const number = firstNumbers[i];
    const isActive = number === activeNumber;
    const isDisabled = disabledNumbers.includes(number);
    
    let itemClasses = 'page-link';
    if (isDisabled) {
      itemClasses += ' disabled';
    }
    
    items.push(
      <li key={number} className={`page-item ${isActive ? 'active' : ''} ${isDisabled ? 'disabled' : ''}`}>
        <button 
          className={itemClasses}
          disabled={isDisabled}
          onClick={() => !isDisabled && handleClick(number)}
        >
          {number}
        </button>
      </li>
    );
  }

  if (betweenNumbers[0] - firstNumbers[firstNumbers.length - 1] > 4) {
    items.push(
      <li key="ellipsis-first-between" className="page-item disabled">
        <span className="page-link">...</span>
      </li>
    );
  }

  for (let i = 0; i < betweenNumbers.length; i++) {
    const number = betweenNumbers[i];
    const isActive = number === activeNumber;
    const isDisabled = disabledNumbers.includes(number);
    
    let itemClasses = 'page-link';
    if (isDisabled) {
      itemClasses += ' disabled';
    }
    
    items.push(
      <li key={number} className={`page-item ${isActive ? 'active' : ''} ${isDisabled ? 'disabled' : ''}`}>
        <button 
          className={itemClasses}
          disabled={isDisabled}
          onClick={() => !isDisabled && handleClick(number)}
        >
          {number}
        </button>
      </li>
    );
  }

  if (lastNumbers[0] - betweenNumbers[betweenNumbers.length - 1] > 4) {
    items.push(
      <li key="ellipsis-between-last" className="page-item disabled">
        <span className="page-link">...</span>
      </li>
    );
  }

  for (let i = 0; i < lastNumbers.length; i++) {
    const number = lastNumbers[i];
    const isActive = number === activeNumber;
    const isDisabled = disabledNumbers.includes(number);
    
    let itemClasses = 'page-link';
    if (isDisabled) {
      itemClasses += ' disabled';
    }
    
    items.push(
      <li key={number} className={`page-item ${isActive ? 'active' : ''} ${isDisabled ? 'disabled' : ''}`}>
        <button 
          className={itemClasses}
          disabled={isDisabled}
          onClick={() => !isDisabled && handleClick(number)}
        >
          {number}
        </button>
      </li>
    );
  }

  const canGoPrev = activeNumber > 1;
  const canGoNext = activeNumber < lastNumbers[lastNumbers.length - 1];

  return (
    <nav aria-label="Page navigation">
      <ul className="pagination">
        <li className={`page-item ${!canGoPrev ? 'disabled' : ''}`}>
          <button 
            className="page-link"
            disabled={!canGoPrev}
            onClick={() => canGoPrev && handleClick(activeNumber - 1)}
            aria-label="Previous"
          >
            <span aria-hidden="true">&laquo;</span>
          </button>
        </li>
        {items}
        <li className={`page-item ${!canGoNext ? 'disabled' : ''}`}>
          <button 
            className="page-link"
            disabled={!canGoNext}
            onClick={() => canGoNext && handleClick(activeNumber + 1)}
            aria-label="Next"
          >
            <span aria-hidden="true">&raquo;</span>
          </button>
        </li>
      </ul>
    </nav>
  );
}

export default Pagination;
