import { useFormik } from 'formik'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import * as yup from 'yup'
import UserApi from '../../../api/user'
import { constant, errorMessages } from '../../../common'
import Label from '../../atoms/Label'
import InformationModal from '../../atoms/modals/Information'
import AlertFail from '../../molecules/AlertFail'
import Button from '../../molecules/Button'
import PasswordField from '../../molecules/PasswordField'
import RadioBoxList from '../../molecules/RadioBoxList'
import TextField from '../../molecules/TextField'
import Template from '../../templates/without-login-template'
import './style.scss'

const Register = () => {
  const [showInformationModal, setShowInformationModal] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const navigate = useNavigate()
  const formik = useFormik({
    initialValues: {
      userName: '',
      passWord: '',
      role: 0,
      email: '',
      fullName: '',
      phoneNumber: '',
      address: '',
    },
    validationSchema: yup.object().shape({
      userName: yup.string().required(errorMessages.userName.required),
      passWord: yup.string().required(errorMessages.passWord.required),
      role: yup.number(),
      email: yup.string().required(errorMessages.email.required).email(errorMessages.email.isValid),
      fullName: yup.string().required(errorMessages.fullName.required),
      phoneNumber: yup.string().required(errorMessages.phoneNumber.required),
      address: yup.string().required(errorMessages.address.required),
    }),
  })

  const options = [
    { label: 'Buyer', value: 0 },
    { label: 'Seller', value: 1 },
  ]

  const handleRegister = async () => {
    const data = formik.values
    const errorString = await UserApi.register(data)
    if (errorString) {
      const errorMessageFormat = formatErrorMessage(errorString)
      setErrorMessage(errorMessageFormat)
    } else {
      setShowInformationModal(true)
    }
  }

  const formatErrorMessage = (errorString) => {
    if (errorString != null && errorString.length > 0) {
      return errorString
        .substring(0, errorString.length - 2)
        .split('\r\n')
        .map((line) => <li>{line}</li>)
    }
  }

  const handleClickLogin = () => {
    navigate('/login')
  }

  const content = (
    <>
      <form noValidate onSubmit={formik.handleSubmit} className='register'>
        <h1>Hello</h1>
        <h4>Sign up to get started</h4>
        <AlertFail message={errorMessage} show={!!errorMessage} />
        <div className="row">
          <div className="col">
            <TextField label='Username' name='userName' maxLength={constant.tenNguoiDungMax} {...formik} />
          </div>
        </div>
        <div className="row">
          <div className="col">
            <PasswordField label='Password' name='passWord' maxLength={constant.tenNguoiDungMax} {...formik} />
          </div>
        </div>
        <div className="row">
          <div className="col">
            <TextField label='Email address' name='email' maxLength={constant.tenNguoiDungMax} {...formik} />
          </div>
        </div>
        <div className="row">
          <div className="col">
            <TextField label='FullName' name='fullName' maxLength={constant.tenNguoiDungMax} {...formik} />
          </div>
        </div>
        <div className="row">
          <div className="col">
            <TextField label='PhoneNumber' name='phoneNumber' maxLength={constant.tenNguoiDungMax} {...formik} />
          </div>
        </div>
        <div className="row">
          <div className="col">
            <TextField label='Address' name='address' maxLength={constant.tenNguoiDungMax} {...formik} />
          </div>
        </div>
        <div className="row">
          <div className="col">
            <RadioBoxList label='Choose a role' options={options} name='role' {...formik} />
          </div>
        </div>
        <div className="row">
          <div className="col buttons">
            <Button
              className={'w-100'}
              type='submit'
              variant='success'
              iconPath='images/register.png'
              text='Register'
              onClick={handleRegister}
              disabled={!(formik.isValid && formik.dirty)}
            />
          </div>
        </div>
        <div className="row text-center my-2">
          <p>
            Already have an account? <Label text='Log in' className="log-in" onClick={handleClickLogin} />
          </p>
        </div>
        <InformationModal body='Account successfully created' onHide={handleClickLogin} show={showInformationModal} />
      </form>
    </>
  )

  return (
    <>
      <Template content={content} headerTitle='Register' headerIcon='images/register.png' />
    </>
  )
}

export default Register
