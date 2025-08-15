import { useContext, useState } from 'react'
import { Nav, Navbar } from 'react-bootstrap'
import Stack from 'react-bootstrap/Stack'
import { useNavigate } from 'react-router-dom'
import NotificationApi from '../../../api/notification'
import { confirmMessages } from '../../../common'
import { AuthContext } from '../../../contexts/AuthContext'
import SignOutModal from '../../atoms/modals/confirmation'
import './index.scss'
import SearchBoxHeader from './SearchBoxHeader'
import UserInformation from './UserInformation'

function Header() {
  const [showLogOutModel, setShowLogOutModel] = useState(false)
  const { currentUser, updateCurrentUser, listCategory, countNotifications, setCountNotifications } =
    useContext(AuthContext)
  const navigate = useNavigate()

  let token = null
  if (currentUser) {
    token = currentUser.token
  }

  const handleLogOut = () => {
    setShowLogOutModel(true)
  }

  const handleConfirmLogout = async () => {
    sessionStorage.removeItem('CurrentUser')
    localStorage.removeItem('CurrentUser')
    await updateCurrentUser(null)
    setShowLogOutModel(false)
    navigate('/login')
  }

  const handleCreateItem = () => {
    navigate('/bid-detail?mode=create')
  }

  const handleCategoryBrowser = (categoryName) => {
    const foundCategory = listCategory.find((item) => item.name === categoryName)
    navigate(`/category-browser?id=${foundCategory.id}`)
  }

  const handleClick = async (item) => {
    if (!item) {
      return
    }

    if (item.name === 'notification') {
      await NotificationApi.updateNotification(token)
    }
    setCountNotifications(0)
    navigate(item.path)
  }

  return (
    <>
      <Stack direction='horizontal' className='header-container'>
        <SearchBoxHeader></SearchBoxHeader>
        <UserInformation
          maxIndex={countNotifications}
          handleClick={handleClick}
          text={currentUser?.fullName}
          handleDangXuat={handleLogOut}
          role={currentUser?.role}
          currentUser={currentUser}
          handleCreateItem={handleCreateItem}
        ></UserInformation>
      </Stack>
      <Navbar bg='dark' data-bs-theme='dark' className='d-flex justify-content-center'>
        {currentUser?.role !== 2 ? (
          <div>
            <Nav className='me-auto'>
              {listCategory.map((item, index) => (
                <Nav.Link key={index} className='px-4  text-white' onClick={() => handleCategoryBrowser(item.name)}>
                  {item.name}
                </Nav.Link>
              ))}
            </Nav>
          </div>
        ) : null}
      </Navbar>
      <SignOutModal
        body={confirmMessages.signOut}
        show={showLogOutModel}
        onHide={() => setShowLogOutModel(false)}
        onClick={handleConfirmLogout}
      />
    </>
  )
}

export default Header
