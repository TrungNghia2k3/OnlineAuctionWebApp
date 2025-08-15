import Button from '../../../molecules/buttons/button'
import Modal from 'react-bootstrap/Modal'
import Image from '../../image'
import './style.scss'
import { screenInformation } from '../../../../common'

function BusinessModal({ body, onHide, show, onClick, titleIcon, useFormik, isValid, dirty, titleText, onRefresh }) {
  return (
    <>
      <Modal show={show} onHide={onHide} backdrop='static' centered={true}>
        <Modal.Header closeButton>
          <Modal.Title>
            <Image path={titleIcon} className={{ 'image-title': true }} />
            {titleText}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>{body}</Modal.Body>
        <Modal.Footer className='footer-buttons'>
          <div class='buttons-left'>
            {onRefresh && (
              <Button
                type='reset'
                onClick={onRefresh}
                text={screenInformation.common.buttons.clean.text}
                iconPath={screenInformation.common.buttons.clean.iconPath}
              />
            )}
          </div>
          <div class='buttons-right'>
            <Button
              type='submit'
              onClick={onClick}
              text={screenInformation.common.buttons.save.text}
              iconPath={screenInformation.common.buttons.save.iconPath}
              disabled={useFormik && !(isValid && dirty)}
            />
            <Button
              onClick={onHide}
              text={screenInformation.common.buttons.close.text}
              iconPath={screenInformation.common.buttons.close.iconPath}
            />
          </div>
        </Modal.Footer>
      </Modal>
    </>
  )
}

export default BusinessModal
