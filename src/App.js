import { Route, Routes, useNavigate, useLocation } from 'react-router-dom'
import { useState, useCallback, useMemo, useEffect } from 'react'
import _ from 'lodash'
import { jwtDecode } from 'jwt-decode'
import { AuthContext } from './contexts/AuthContext'
import AppRoutes from './AppRoutes'
import { Layout } from './components/Layout'
import LoadingPage from './components/atoms/loading-page'
import Header from './components/organisms/header'
import Footer from './components/organisms/footer'
import CategoryApi from './api/category'
import NotificationApi from './api/notification'

const App = () => {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const [currentUser, setCurrentUser] = useState(null)
  const [currentModal, setCurrentModal] = useState({})
  const [showLoadingPage, setShowLoadingPage] = useState(false)
  const [listCategory, setListCategory] = useState([])
  const [countNotifications, setCountNotifications] = useState(null)

  // Helper function to decode user data from token
  const getUserFromToken = useCallback((token) => {
    try {
      const decoded = jwtDecode(token)
      return {
        id: decoded.Id,
        username: decoded.Username,
        role: parseInt(decoded.Role),
        fullName: decoded.FullName,
        token: token
      }
    } catch (error) {
      console.error('Invalid token:', error)
      return null
    }
  }, [])

  const updateCurrentUser = useCallback(async (tokenOrUserData) => {
    if (!tokenOrUserData) {
      setCurrentUser(null)
      return
    }
    
    // If it's a string, treat it as a token
    if (typeof tokenOrUserData === 'string') {
      const userData = getUserFromToken(tokenOrUserData)
      setCurrentUser(userData)
      return
    }
    
    // If it's an object with a token, extract the token
    if (tokenOrUserData.token) {
      const userData = getUserFromToken(tokenOrUserData.token)
      setCurrentUser(userData)
      return
    }
  }, [getUserFromToken])

  const { path: indexRoute } = _.find(AppRoutes, { index: true })

  useEffect(() => {
    if (currentUser) {
      if (currentUser?.role === 2) {
        if (pathname === '/' || pathname === '/login') {
          navigate('/category-management')
        }
        return
      }
      if (pathname === '/' || pathname === '/login') {
        navigate(indexRoute)
      }
      return
    }

    const valueSessionStorage = sessionStorage.getItem('CurrentUser')
    if (valueSessionStorage) {
      try {
        const storedData = JSON.parse(valueSessionStorage)
        // Handle both old format (full user object) and new format (just token)
        const token = storedData.token || storedData
        const userData = getUserFromToken(token)
        if (userData) {
          setCurrentUser(userData)
          return
        }
      } catch (error) {
        console.error('Error parsing session storage:', error)
        sessionStorage.removeItem('CurrentUser')
      }
    }
    
    const valueLocalStorage = localStorage.getItem('CurrentUser')
    if (valueLocalStorage) {
      try {
        const storedData = JSON.parse(valueLocalStorage)
        // Handle both old format (full user object) and new format (just token)
        const token = storedData.token || storedData
        const userData = getUserFromToken(token)
        if (userData) {
          sessionStorage.setItem('CurrentUser', JSON.stringify(token))
          setCurrentUser(userData)
          return
        }
      } catch (error) {
        console.error('Error parsing local storage:', error)
        localStorage.removeItem('CurrentUser')
      }
    }

    if (pathname === '/register') {
      navigate('/register')
      return
    }

    if (pathname === '/forgot-password') {
      navigate('/forgot-password')
      return
    }

    navigate('/login')
  }, [currentUser, navigate, pathname, indexRoute, getUserFromToken])

  useEffect(() => {
    if (currentUser) {
      const getListCategory = async () => {
        const result = await CategoryApi.getAllCategoryActive(currentUser.token)
        setListCategory(result)
      }
      getListCategory()
    }
  }, [currentUser])

  useEffect(() => {
    if (currentUser) {
      const getListNotifications = async () => {
        const result = await NotificationApi.getAllNotificationsByIdUser(currentUser.token)
        handleFilterNotifications(result)
      }
      getListNotifications()
    }
  }, [currentUser])

  const handleFilterNotifications = (data) => {
    const foundNotifications = data.filter((notification) => notification.markRead === false)
    let maxIndex = 0
    foundNotifications.forEach((item, index) => {
      if (index >= maxIndex) {
        maxIndex = index + 1
      }
    })
    setCountNotifications(maxIndex)
  }

  const authContextValue = useMemo(
    () => ({
      currentUser,
      updateCurrentUser,
      currentModal,
      setCurrentModal,
      setShowLoadingPage,
      listCategory,
      countNotifications,
      setCountNotifications,
    }),
    [
      currentUser,
      updateCurrentUser,
      currentModal,
      setCurrentModal,
      setShowLoadingPage,
      listCategory,
      countNotifications,
      setCountNotifications,
    ],
  )

  return (
    <AuthContext.Provider value={authContextValue}>
      {currentUser && <Header />}
      <Layout>
        <Routes>
          {AppRoutes.map((route, index) => {
            const { element, ...rest } = route
            return <Route key={index} {...rest} element={element} />
          })}
        </Routes>
      </Layout>
      {showLoadingPage && <LoadingPage />}
      {currentUser && <Footer />}
    </AuthContext.Provider>
  )
}

export default App
