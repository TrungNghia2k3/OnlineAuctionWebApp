import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import NotificationApi from '../../../api/notification';
import { confirmMessages } from '../../../common';
import { AuthContext } from '../../../contexts/AuthContext';
import Button from '../../molecules/Button';
import SignOutModal from '../../atoms/modals/confirmation';
import './index.scss';
import SearchBoxHeader from './SearchBoxHeader';
import UserInformation from './UserInformation';

function Header() {
  const [showLogOutModel, setShowLogOutModel] = useState(false);
  const { currentUser, updateCurrentUser, listCategory, countNotifications, setCountNotifications } =
    useContext(AuthContext);
  const navigate = useNavigate();

  let token = null;
  if (currentUser) {
    token = currentUser.token;
  }

  const handleLogOut = () => {
    setShowLogOutModel(true);
  };

  const handleConfirmLogout = async () => {
    sessionStorage.removeItem('CurrentUser');
    localStorage.removeItem('CurrentUser');
    await updateCurrentUser(null);
    setShowLogOutModel(false);
    navigate('/login');
  };

  const handleCreateItem = () => {
    navigate('/bid-detail?mode=create');
  };

  const handleLogin = () => {
    navigate('/login');
  };

  const handleRegister = () => {
    navigate('/register');
  };

  const handleCategoryBrowser = (categoryName) => {
    const foundCategory = listCategory.find((item) => item.name === categoryName);
    navigate(`/category-browser?id=${foundCategory.id}`);
  };

  const handleClick = async (item) => {
    if (!item) {
      return;
    }

    if (item.name === 'notification') {
      await NotificationApi.updateNotification(token);
    }
    setCountNotifications(0);
    navigate(item.path);
  };

  return (
    <>
      <div className="d-flex align-items-center header-container">
        <SearchBoxHeader />
        {currentUser ? (
          <UserInformation
            maxIndex={countNotifications}
            handleClick={handleClick}
            text={currentUser?.fullName}
            handleDangXuat={handleLogOut}
            role={currentUser?.role}
            currentUser={currentUser}
            handleCreateItem={handleCreateItem}
          />
        ) : (
          <div className="guest-buttons d-flex gap-2 align-items-center">
            <Button
              variant="outline-primary"
              text="Login"
              onClick={handleLogin}
              className="login-btn"
            />
            <Button
              variant="primary"
              text="Register"
              onClick={handleRegister}
              className="register-btn"
            />
          </div>
        )}
      </div>
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <div className="container-fluid justify-content-center">
          {currentUser?.role !== 2 && (
            <div className="navbar-nav">
              {listCategory.map((item, index) => (
                <button
                  key={index}
                  type="button"
                  className="nav-link btn btn-link text-white px-4"
                  onClick={() => handleCategoryBrowser(item.name)}
                >
                  {item.name}
                </button>
              ))}
            </div>
          )}
        </div>
      </nav>
      <SignOutModal
        body={confirmMessages.signOut}
        show={showLogOutModel}
        onHide={() => setShowLogOutModel(false)}
        onClick={handleConfirmLogout}
      />
    </>
  );
}

export default Header;
