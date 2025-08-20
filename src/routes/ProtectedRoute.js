import {useContext} from 'react'
import {useNavigate} from 'react-router-dom'
import AppRoutes from './AppRoutes'
import {AuthContext} from '@/contexts'

const ProtectedRoute = () => {
    const {currentUser} = useContext(AuthContext)
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
            <></>
        )
    }

    // If user doesn't have permission for this role-restricted page
    return (
        <></>
    )
}

export default ProtectedRoute
