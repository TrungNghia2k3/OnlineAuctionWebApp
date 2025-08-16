import './style.scss'
import * as React from 'react'
import { Accordion } from 'react-bootstrap'

function AccordionList({ headerId, headerName, bodyName, items, alwaysOpen, defaultActiveKey, handleHeaderClick }) {
  return (
    <>
      {items.map((item) => (
        <Accordion alwaysOpen={alwaysOpen} defaultActiveKey={defaultActiveKey}>
          <Accordion.Item key={item[headerId]} eventKey={item[headerId]}>
            <Accordion.Header> {item[headerName]}</Accordion.Header>
            <Accordion.Body>{item[bodyName]}</Accordion.Body>
          </Accordion.Item>
        </Accordion>
      ))}
    </>
  )
}

export default AccordionList
