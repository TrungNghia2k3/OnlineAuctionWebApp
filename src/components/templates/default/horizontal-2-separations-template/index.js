import * as React from 'react'
import DefaultTemplate from '..'
import './styles.scss'

const Horizontal2SeparationTemplate = ({ top, middle, bottom, headerIcon, headerTitle }) => {
  return (
    <>
      <DefaultTemplate headerIcon={headerIcon} headerTitle={headerTitle}>
        <div>
          <div className='body-top'>{top}</div>
          <div className='body-middle'>{middle}</div>
          <div className='body-bottom'>{bottom}</div>
        </div>
      </DefaultTemplate>
    </>
  )
}

export default Horizontal2SeparationTemplate
