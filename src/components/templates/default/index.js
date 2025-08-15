import * as React from 'react'
import Body from '../../organisms/body'
import Toast from '../../atoms/toast'
import './styles.scss'

const DefaultTemplate = ({ headerIcon, headerTitle, children }) => {
  return (
    <>
      <Body className={{ 'body-layout': true }}>
        <Toast className={{ 'toast-template': true }} headerIcon={headerIcon} headerTitle={headerTitle}>
          {children}
        </Toast>
      </Body>
    </>
  )
}

export default DefaultTemplate
