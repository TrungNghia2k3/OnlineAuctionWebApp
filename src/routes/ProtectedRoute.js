import { useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import AppRoutes from './AppRoutes'
import { AuthContext } from '../contexts/AuthContext'
import InformationModal from '../components/atoms/modals/Information'

const ProtectedRoute = () => {
  const { currentUser } = useContext(AuthContext)
  let role = null
  if (currentUser) {
    role = currentUser.role
  } else {
    // Guest user (not logged in)
    role = 'guest'
  }

  const navigate = useNavigate()
  const currentUrl = window.location.href
  const urlObject = new URL(currentUrl)
  const path = urlObject.pathname
  const backToHomePage = () => {
    navigate('/')
  }
  
  const pathRoute = AppRoutes.find((route) => route.path === path)
  
  // If route is public, allow access regardless of authentication
  if (pathRoute?.isPublic) {
    return true
  }
  
  // If route requires specific roles and user has permission
  if (pathRoute?.roles?.includes(role)) {
    return true
  }
  
  // If no current user and route is not public, redirect to login
  if (!currentUser && pathRoute && !pathRoute.isPublic) {
    return (
      <InformationModal 
        body='Please log in to access this page' 
        onHide={() => navigate('/login')} 
        show={true} 
      />
    )
  }
  
  // If user doesn't have permission for this role-restricted page
  return (
    <InformationModal 
      body='You do not have permission to access this page' 
      onHide={backToHomePage} 
      show={true} 
    />
  )
}

export default ProtectedRoute
