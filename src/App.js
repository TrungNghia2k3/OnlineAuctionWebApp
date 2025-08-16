import "bootstrap-icons/font/bootstrap-icons.css"
import "bootstrap/dist/css/bootstrap.min.css"
import { jwtDecode } from 'jwt-decode'
import _ from 'lodash'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import AppRoutes from './AppRoutes'
import CategoriesApi from './api/categories'
import { Layout } from './components/Layout'
import LoadingPage from './components/atoms/LoadingPage'
import Footer from './components/organisms/footer'
import Header from './components/organisms/header'
import { AuthContext } from './contexts/AuthContext'

const App = () => {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const [currentUser, setCurrentUser] = useState(null)
  const [currentModal, setCurrentModal] = useState({})
  const [showLoadingPage, setShowLoadingPage] = useState(false)
  const [listCategory, setListCategory] = useState([])
  const [countNotifications, setCountNotifications] = useState(null)

  // Helper function to convert string roles to numeric roles for backward compatibility
  const getRoleNumber = useCallback((roleString) => {
    switch (roleString) {
      case 'ROLE_ADMIN':
        return 2
      case 'ROLE_USER':
        return 1
      default:
        return 0 // Guest or unknown role
    }
  }, [])

  // Helper function to decode user data from token
  const getUserFromToken = useCallback((token) => {
    try {
      const decoded = jwtDecode(token)
      const roleString = decoded.scope // 'scope' field contains role (ROLE_USER or ROLE_ADMIN)
      return {
        username: decoded.sub, // 'sub' field contains username
        role: getRoleNumber(roleString), // Convert to numeric for backward compatibility
        roleString: roleString, // Keep original string role for new logic
        issuer: decoded.iss, // 'iss' field contains issuer
        tokenId: decoded.jti, // 'jti' field contains token ID
        issuedAt: decoded.iat, // 'iat' field contains issued at timestamp
        expiresAt: decoded.exp, // 'exp' field contains expiration timestamp
        token: token
      }
    } catch (error) {
      console.error('Invalid token:', error)
      return null
    }
  }, [getRoleNumber])

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
      if (currentUser?.role === 2) { // Admin role (converted from ROLE_ADMIN)
        if (pathname === '/login') {
          navigate('/category-management')
        }
        return
      }
      if (pathname === '/login') {
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

    // Allow access to these pages without authentication
    const publicPages = ['/', '/register', '/forgot-password', '/category-browser', '/bid-detail', '/search-results']
    if (publicPages.includes(pathname)) {
      return
    }

    navigate('/login')
  }, [currentUser, navigate, pathname, indexRoute, getUserFromToken])

  useEffect(() => {
    const getListCategory = async () => {
      try {
        // Try to get categories without authentication first for public access
        const response = await CategoriesApi.getAllCategory()
        setListCategory(response.result)
      } catch (error) {
        console.error('Error fetching categories:', error)
        setListCategory([])
      }
    }
    getListCategory()
  }, [])

  // useEffect(() => {
  //   if (currentUser) {
  //     const getListNotifications = async () => {
  //       const result = await NotificationApi.getAllNotificationsByIdUser(currentUser.token)
  //       handleFilterNotifications(result)
  //     }
  //     getListNotifications()
  //   }
  // }, [currentUser])

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

  // Pages that should not show Header and Footer
  const authPages = ['/login', '/register', '/forgot-password']
  const isAuthPage = authPages.includes(pathname)

  return (
    <AuthContext.Provider value={authContextValue}>
      {!isAuthPage && <Header />}
      <Layout>
        <Routes>
          {AppRoutes.map((route, index) => {
            const { element, ...rest } = route
            return <Route key={index} {...rest} element={element} />
          })}
        </Routes>
      </Layout>
      {showLoadingPage && <LoadingPage />}
      {!isAuthPage && <Footer />}
    </AuthContext.Provider>
  )
}

export default App
