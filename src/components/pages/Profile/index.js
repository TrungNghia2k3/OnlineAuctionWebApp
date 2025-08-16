import { useFormik } from 'formik'
import { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import * as yup from 'yup'
import UserApi from '../../../api/user'
import { errorMessages } from '../../../common'
import { AuthContext } from '../../../contexts/AuthContext'
import Label from '../../atoms/Label'
import InformationModal from '../../atoms/modals/Information'
import LockAccountModal from '../../atoms/modals/confirmation'
import AlertFail from '../../molecules/AlertFail'
import Button from '../../molecules/Button'
import PasswordField from '../../molecules/PasswordField'
import TextField from '../../molecules/TextField'
import ProtectedRoute from '../../protected-route'
import Template from '../../templates/default/no-separation-template'
import './style.scss'

const Profile = () => {
  const [showInformationModal, setShowInformationModal] = useState(false)
  const [showLockAccountModel, setShowLockAccountModel] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [user, setUser] = useState(null)
  const navigate = useNavigate()
  const { currentUser, updateCurrentUser } = useContext(AuthContext)
  let token = null
  let userId = null
  if (currentUser) {
    token = currentUser.token
    userId = currentUser.id
  }

  useEffect(() => {
    if (token) {
      const getListItems = async () => {
        const result = await UserApi.getById(userId, token)
        formik.setValues(result)
        setUser(result)
      }
      getListItems()
    }
  }, [token])
  const formik = useFormik({
    initialValues: {
      id: 0,
      username: '',
      password: '',
      email: '',
      fullName: '',
      phoneNumber: '',
      address: '',
      isActive: true,
    },
    validationSchema: yup.object().shape({
      id: yup.number(),
      username: yup.string().required(errorMessages.userName.required),
      password: yup.string(),
      email: yup.string().required(errorMessages.email.required).email(errorMessages.email.isValid),
      fullName: yup.string().required(errorMessages.fullName.required),
      phoneNumber: yup.string().required(errorMessages.phoneNumber.required),
      address: yup.string().required(errorMessages.address.required),
      isActive: yup.bool(),
    }),
  })
  const handleRefresh = () => {
    formik.setValues(user)
  }

  const handleSaveChange = async () => {
    const data = formik.values
    if (data.isActive === false) {
      setShowLockAccountModel(true)
      return
    }
    const errorString = await UserApi.update(data, token)
    if (errorString) {
      const errorMessageFormat = formatErrorMessage(errorString)
      setErrorMessage(errorMessageFormat)
      return
    }
    setShowInformationModal(true)
  }

  const handleConfirmLockAccount = async () => {
    const data = formik.values
    const errorString = await UserApi.update(data, token)
    if (errorString) {
      const errorMessageFormat = formatErrorMessage(errorString)
      setErrorMessage(errorMessageFormat)
      setShowLockAccountModel(false)
    } else {
      sessionStorage.removeItem('CurrentUser')
      localStorage.removeItem('CurrentUser')
      await updateCurrentUser(null)
      navigate('/login')
    }
  }
  const handleCancelLockAccount = () => {
    formik.setFieldValue('isActive', true)
    setShowLockAccountModel(false)
  }
  const handleCloseModal = () => {
    setShowInformationModal(false)
    navigate(-1)
  }

  const formatErrorMessage = (errorString) => {
    if (errorString != null && errorString.length > 0) {
      return errorString
        .substring(0, errorString.length - 2)
        .split('\r\n')
        .map((line) => <li>{line}</li>)
    }
  }

  const content = (
    <>
      <div className="container">
        <form noValidate onSubmit={formik.handleSubmit}>
          <AlertFail message={errorMessage} show={!!errorMessage} />
          <div className="row">
            <div className="col">
              <TextField label='Username' name='username' {...formik} />
            </div>
          </div>
          <div className="row">
            <div className="col">
              <PasswordField label='Password' name='password' {...formik} />
            </div>
          </div>
          <div className="row">
            <div className="col">
              <TextField label='Email address' name='email' {...formik} />
            </div>
          </div>
          <div className="row">
            <div className="col">
              <TextField label='FullName' name='fullName' {...formik} />
            </div>
          </div>
          <div className="row">
            <div className="col">
              <TextField label='PhoneNumber' name='phoneNumber' {...formik} />
            </div>
          </div>
          <div className="row">
            <div className="col">
              <TextField label='Address' name='address' {...formik} />
            </div>
          </div>
          <div className="row">
            <div className="col buttons-profile">
              <div className='checkbox-lock-account'>
                <Label text='Lock account' />
                <div className="form-check form-switch">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    role="switch"
                    checked={formik.values.isActive}
                    onChange={(e) => formik.setFieldValue('isActive', e.target.checked)}
                  />
                </div>
              </div>
              <div className='box-buttons-profile'>
                <Button
                  className='buttons-refresh-profile'
                  type='submit'
                  text='Refresh'
                  iconPath='images/refresh.svg'
                  onClick={handleRefresh}
                />

                <Button
                  type='submit'
                  variant='success'
                  text='Save changes'
                  iconPath='images/save.svg'
                  onClick={handleSaveChange}
                  disabled={!(formik.isValid && formik.dirty)}
                />
              </div>
            </div>
          </div>
          <InformationModal body='Account updated successfully' onHide={handleCloseModal} show={showInformationModal} />
          <LockAccountModal
            body='Are you sure you want to lock your account?'
            show={showLockAccountModel}
            onHide={handleCancelLockAccount}
            onClick={handleConfirmLockAccount}
          />
        </form>
      </div>
    </>
  )

  return (
    <>
      <ProtectedRoute />
      <Template headerIcon={'images/user-solid.svg'} headerTitle={'Profile page'} content={content} />
    </>
  )
}

export default Profile
