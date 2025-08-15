import { useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import AppRoutes from '../AppRoutes'
import { AuthContext } from '../contexts/AuthContext'
import InformationModal from './atoms/modals/Information'

const ProtectedRoute = () => {
  const { currentUser } = useContext(AuthContext)
  let role = null
  if (currentUser) {
    role = currentUser.role
  }

  const navigate = useNavigate()
  const currentUrl = window.location.href
  const urlObject = new URL(currentUrl)
  const path = urlObject.pathname
  const backToHomePage = () => {
    navigate(-1)
  }
  const pathRoute = AppRoutes.find((route) => route.path === path)
  if (pathRoute.roles?.includes(role)) {
    return true
  } else {
    return (
      <InformationModal body='You do not have permission to access this page' onHide={backToHomePage} show={true} />
    )
  }
}

export default ProtectedRoute
