import React, { useState } from 'react'
import { Pagination as PaginationLib } from 'react-bootstrap'

function Pagination({ firstNumbers, betweenNumbers, lastNumbers, disabledNumbers, activeNumber, handleClick, number }) {
  const items = []

  for (let i = 0; i < firstNumbers.length; i++) {
    const number = firstNumbers[i]
    items.push(
      <PaginationLib.Item
        key={number}
        active={number === activeNumber}
        disabled={disabledNumbers.includes(number)}
        onClick={() => handleClick(number)}
      >
        {number}
      </PaginationLib.Item>,
    )
  }

  if (betweenNumbers[0] - firstNumbers[firstNumbers.length - 1] > 4) {
    items.push(<PaginationLib.Ellipsis key='ellipsis-first-between' />)
  }

  for (let i = 0; i < betweenNumbers.length; i++) {
    const number = betweenNumbers[i]
    items.push(
      <PaginationLib.Item
        key={number}
        active={number === activeNumber}
        disabled={disabledNumbers.includes(number)}
        onClick={() => handleClick(number)}
      >
        {number}
      </PaginationLib.Item>,
    )
  }

  if (lastNumbers[0] - betweenNumbers[betweenNumbers.length - 1] > 4) {
    items.push(<PaginationLib.Ellipsis key='ellipsis-between-last' />)
  }

  for (let i = 0; i < lastNumbers.length; i++) {
    const number = lastNumbers[i]
    items.push(
      <PaginationLib.Item
        key={number}
        active={number === activeNumber}
        disabled={disabledNumbers.includes(number)}
        onClick={() => handleClick(number)}
      >
        {number}
      </PaginationLib.Item>,
    )
  }

  return (
    <PaginationLib>
      <PaginationLib.Prev onClick={() => activeNumber > 1 && handleClick(activeNumber - 1)} />
      {items}
      <PaginationLib.Next
        onClick={() => activeNumber < lastNumbers[lastNumbers.length - 1] && handleClick(activeNumber + 1)}
      />
    </PaginationLib>
  )
}

export default Pagination
