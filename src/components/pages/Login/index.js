import { useFormik } from 'formik';
import { jwtDecode } from 'jwt-decode';
import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthApi from '../../../api/authentication';
import { constant } from '../../../common';
import { AuthContext } from '../../../contexts/AuthContext';
import Badge from '../../atoms/Badge';
import Label from '../../atoms/Label';
import Button from '../../molecules/Button';
import CheckBox from '../../molecules/CheckBoxSingle';
import PasswordField from '../../molecules/PasswordField';
import TextField from '../../molecules/TextField';
import Template from '../../templates/without-login-template';
import './style.scss';

const Login = () => {
  const navigate = useNavigate();
  const { updateCurrentUser, setShowLoadingPage } = useContext(AuthContext);
  const [errorMessage, setErrorMessage] = useState('');

  const formik = useFormik({
    initialValues: {
      username: '',
      password: '',
      rememberPassword: false,
    },
  });

  const handleClickRegister = () => {
    navigate('/register');
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setShowLoadingPage(true);

    try {
      const data = formik.values;
      if (!data.username || !data.password) {
        setErrorMessage('Please enter username and password');
        setShowLoadingPage(false);
        return;
      }

      const response = await AuthApi.authenticate(data.username, data.password);
      if (!response || response.code !== 1000) {
        setErrorMessage('Username or Password is invalid');
        setShowLoadingPage(false);
        return;
      }

      // Extract the token from the new API response format
      const token = response.result.token;

      console.log('Login successful, token:', token);

      // Update current user with the token (App.js will decode it)
      await updateCurrentUser(token);
      
      // Store only the token
      sessionStorage.setItem('CurrentUser', JSON.stringify(token));
      if (data.rememberPassword) {
        localStorage.setItem('CurrentUser', JSON.stringify(token));
      }
      
      // Decode token to get role for navigation
      try {
        const decoded = jwtDecode(token);
        const userRole = decoded.scope; // Use 'scope' field which contains role info
        if (userRole === 'ROLE_ADMIN') {
          navigate('/category-management');
          setShowLoadingPage(false);
          return;
        }
        // For ROLE_USER, navigate to home page
        navigate('/');
      } catch (decodeError) {
        console.error('Error decoding token:', decodeError);
        navigate('/'); // Default navigation if decode fails
      }
    } catch (error) {
      setErrorMessage();
    }

    setShowLoadingPage(false);
  };

  const handleForgotPassword = () => {
    navigate('/forgot-password');
  };

  const login = (
    <>
      <form className="login-page">
        <h1>Hello Again!</h1>
        <h4>Welcome Back</h4>
        <div className="row">
          <div className="col">
            <TextField label="Username" name="username" maxLength={constant.usernameMax} {...formik} />
          </div>
        </div>
        <div className="row">
          <div className="col">
            <PasswordField label="Password" name="password" maxLength={constant.passwordMax} {...formik} />
          </div>
        </div>
        <div className="col error-message">
          <Badge text={errorMessage} variant="danger" />
        </div>
        <div className="row">
          <div className="col remember">
            <CheckBox className="remember-password" name="rememberPassword" labelCheckBox="Remember" {...formik} />
            <Label
              text="Forgot Password?"
              onClick={() => handleForgotPassword()}
              className="forgot-password"
            />
          </div>
        </div>

        <div className="row">
          <div className="col buttons">
            <Button
              className="button-login"
              type="submit"
              iconPath="images/login.png"
              variant="success"
              text="Login"
              onClick={handleLogin}
            />
          </div>
        </div>
        <div className="row text-center my-2">
          <p>
            Don't have a Clarity account?{' '}
            <Label text="Register here" className="register-now" onClick={handleClickRegister} />
          </p>
        </div>
      </form>
    </>
  );

  return <Template content={login} />;
};

export default Login;
