import * as React from 'react'
import DefaultTemplate from '..'

const NoSeparationTemplate = ({ content, headerIcon, headerTitle }) => {
  return (
    <>
      <DefaultTemplate headerIcon={headerIcon} headerTitle={headerTitle}>
        <div className='body-middle'>{content}</div>
      </DefaultTemplate>
    </>
  )
}

export default NoSeparationTemplate
