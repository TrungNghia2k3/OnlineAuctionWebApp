import * as React from 'react'
// import classnames from 'classnames'
// import styles from './style.scss'
import { Table as TableLib } from 'react-bootstrap';

function Table({ headers, data }) {
  return (
      <TableLib striped bordered hover>
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
    </TableLib>
  );
}

export default Table;