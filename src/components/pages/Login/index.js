import { useFormik } from 'formik'
import { jwtDecode } from 'jwt-decode'
import { useContext, useState } from 'react'
import { Col, Form, Row } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import UserApi from '../../../api/user'
import { constant } from '../../../common'
import { AuthContext } from '../../../contexts/AuthContext'
import Badge from '../../atoms/badge'
import Label from '../../atoms/forms/label'
import Button from '../../molecules/buttons/button'
import CheckBox from '../../molecules/forms/check-box-single'
import PasswordField from '../../molecules/forms/password-field'
import TextField from '../../molecules/forms/text-field'
import Template from '../../templates/without-login-template'
import './style.scss'

const Login = () => {
  const navigate = useNavigate()
  const { updateCurrentUser, setShowLoadingPage } = useContext(AuthContext)
  const [errorMessage, setErrorMessage] = useState('')

  const formik = useFormik({
    initialValues: {
      userName: '',
      passWord: '',
      rememberPassword: false,
    },
  })

  const handleClickRegister = () => {
    navigate('/register')
  }
  const handleLogin = async (e) => {
    e.preventDefault()
    setShowLoadingPage(true)

    try {
      const data = formik.values
      if (!data.userName || !data.passWord) {
        setErrorMessage('Please enter Username and Password')
        setShowLoadingPage(false)
        return
      }

      const nguoiDung = await UserApi.authentication(data.userName, data.passWord)
      if (!nguoiDung) {
        setErrorMessage('Username or Password is invalid')
        setShowLoadingPage(false)
        return
      }

      // Extract just the token from the response
      const token = nguoiDung.token
      
      // Update current user with the token (App.js will decode it)
      await updateCurrentUser(token)
      
      // Store only the token
      sessionStorage.setItem('CurrentUser', JSON.stringify(token))
      if (data.rememberPassword) {
        localStorage.setItem('CurrentUser', JSON.stringify(token))
      }
      
      // Decode token to get role for navigation
      try {
        const decoded = jwtDecode(token)
        const userRole = parseInt(decoded.Role)
        if (userRole === 2) {
          navigate('/category-management')
          setShowLoadingPage(false)
          return
        }
      } catch (decodeError) {
        console.error('Error decoding token:', decodeError)
      }
      
      navigate('/')
    } catch (error) {
      setErrorMessage()
    }

    setShowLoadingPage(false)
  }

  const handleForgotPassword = () => {
    navigate('/forgot-password')
  }

  const login = (
    <>
      <Form className='login-page'>
        <h1>Hello Again!</h1>
        <h4>Welcome Back</h4>
        <Row>
          <Col>
            <TextField label='Username' name='userName' maxLength={constant.tenNguoiDungMax} {...formik} />
          </Col>
        </Row>
        <Row>
          <Col>
            <PasswordField label='Password' name='passWord' maxLength={constant.tenNguoiDungMax} {...formik} />
          </Col>
        </Row>
        <Col className='error-message'>
          <Badge text={errorMessage} variant='danger' />
        </Col>
        <Row>
          <Col className='remember'>
            <CheckBox className='remember-password' name='rememberPassword' labelCheckBox='Remember' {...formik} />
            <Label
              text='Forgot Password?'
              onClick={() => handleForgotPassword()}
              className={{ 'forgot-password': true }}
            ></Label>
          </Col>
        </Row>

        <Row>
          <Col className='buttons'>
            <Button
              className='button-login'
              type='submit'
              iconPath='images/login.png'
              variant='success'
              text='Login'
              onClick={handleLogin}
            />
          </Col>
        </Row>
        <Row className='text-center my-2'>
          <p>
            Don't have a Clarity account?{' '}
            <Label text='Register here' className={{ 'register-now': true }} onClick={handleClickRegister} />
          </p>
        </Row>
      </Form>
    </>
  )

  return <Template content={login} />
}

export default Login
