import { useFormik } from 'formik'
import { useEffect, useState } from 'react'
import { Form } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import * as yup from 'yup'
import UserApi from '../../../api/user'
import { errorMessages } from '../../../common'
import InformationModal from '../../atoms/modals/Information'
import AlertFail from '../../molecules/alerts/alert-fail'
import Button from '../../molecules/buttons/button'
import TextField from '../../molecules/forms/text-field'
import Template from '../../templates/without-login-template'
import './style.scss'

const ForgotPassword = () => {
  const navigate = useNavigate()
  const [errorMessage, setErrorMessage] = useState('')
  const [showInformationModal, setShowInformationModal] = useState(false)
  const [showBadge, setShowBadge] = useState(true)
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowBadge(false)
    }, 3000)

    return () => {
      clearTimeout(timer)
    }
  }, [showBadge])

  const formik = useFormik({
    initialValues: {
      email: '',
    },
    validationSchema: yup.object().shape({
      email: yup.string().required(errorMessages.email.required).email(errorMessages.email.isValid),
    }),
  })
  const handleForgotPassword = async () => {
    const data = formik.values
    const errorString = await UserApi.forgotPassword(data.email)
    if (errorString) {
      const errorMessageFormat = formatErrorMessage(errorString)
      setErrorMessage(errorMessageFormat)
      formik.resetForm()
      setShowBadge(true)
    } else {
      setShowInformationModal(true)
    }
  }
  const formatErrorMessage = (errorString) => {
    return <li>{errorString}</li>
  }

  const handleClickLogin = () => {
    navigate('/login')
  }

  const login = (
    <>
      <Form onSubmit={formik.handleSubmit} className='forgot-password-page'>
        <h1>Forgot Password</h1>
        {showBadge && <AlertFail message={errorMessage} show={!!errorMessage} />}
        <TextField label='Enter your email' name='email' {...formik} />
        <Button
          className='button-forgot-password'
          type='submit'
          iconPath='images/forgot.png'
          onClick={handleForgotPassword}
          variant='success'
          text='Send login code'
          disabled={!(formik.isValid && formik.dirty)}
        />
      </Form>
      <InformationModal
        body='Password and username have been sent to your email, please check your email !!!'
        onHide={handleClickLogin}
        show={showInformationModal}
      />
    </>
  )

  return <Template content={login} />
}

export default ForgotPassword
