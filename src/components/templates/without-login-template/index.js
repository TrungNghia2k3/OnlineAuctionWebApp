import * as React from 'react'
import './styles.scss'
import Body from '../../organisms/body'

const WithoutLoginTemplate = ({ content }) => {
  return (
    <>
      <Body className={{ 'body-layout': true, 'no-header-footer-template': true }}>
        <div className='body-content'>
          <div className='left'></div>
          <div className='right'>{content}</div>
        </div>
      </Body>
    </>
  )
}

export default WithoutLoginTemplate
