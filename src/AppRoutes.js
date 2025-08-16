import BidDetail from './components/pages/BidDetail'
import CategoryBrowser from './components/pages/CategoryBrowser'
import CategoryManagement from './components/pages/CategoryManagement'
import ForgotPassword from './components/pages/ForgotPassword'
import Home from './components/pages/Home'
import Login from './components/pages/Login'
import MyBid from './components/pages/MyBid'
import Notification from './components/pages/Notification'
import Profile from './components/pages/Profile'
import Register from './components/pages/Register'
import ReportItems from './components/pages/ReportItems'
import ReportRating from './components/pages/ReportRating'
import SearchResult from './components/pages/SearchResult'
import UserManagement from './components/pages/UserManagement'

const AppRoutes = [
  {
    index: true,
    path: '/',
    element: <Home />,
    name: 'home',
    title: 'Home page',
    icon: 'images/iconnav/danh_muc.png',
    roles: [0, 1, 2], // Allow guests (no login), users, and admins
    isPublic: true, // Can access without authentication
  },
  {
    path: '/category-browser',
    element: <CategoryBrowser />,
    name: 'category-browser',
    roles: [0, 1, 2],
    isPublic: true, // Can access without authentication
  },
  {
    path: '/login',
    element: <Login />,
    name: 'login',
    isPublic: true,
  },
  {
    path: '/register',
    element: <Register />,
    name: 'register',
    isPublic: true,
  },
  {
    path: '/forgot-password',
    element: <ForgotPassword />,
    name: 'forgot-password',
    isPublic: true,
  },
  {
    path: '/category-management',
    element: <CategoryManagement />,
    name: 'category-management',
    title: 'Category Management',
    icon: 'images/list-solid.svg',
    isMenu: true,
    roles: [2],
  },
  {
    path: '/my-bid',
    element: <MyBid />,
    name: 'my-bid',
    title: 'My Bidder',
    icon: 'images/heart-solid.svg',
    isMenu: true,
    roles: [0, 1],
  },
  {
    path: '/bid-detail',
    element: <BidDetail />,
    name: 'bid-detail',
    roles: [0, 1, 2],
    isPublic: true, // Can view auction details without login
  },
  {
    path: '/search-results',
    element: <SearchResult />,
    name: 'search-results',
    roles: [0, 1, 2],
    isPublic: true, // Can search without login
  },
  {
    path: '/notification',
    element: <Notification />,
    name: 'notification',
    title: 'Notifications',
    icon: 'images/bell-solid.svg',
    isMenu: true,
    roles: [0, 1],
  },
  {
    path: '/user-management',
    element: <UserManagement />,
    name: 'Manage User',
    title: 'User Management',
    icon: 'images/iconnav/person-circle.svg',
    isMenu: true,
    roles: [2],
  },
  {
    path: '/profile',
    element: <Profile />,
    name: 'profile',
    title: 'My Profile',
    icon: 'images/user-solid.svg',
    isMenu: true,
    roles: [0, 1],
  },
  {
    path: '/report-items',
    element: <ReportItems />,
    name: 'report-items',
    title: 'Report Items',
    icon: 'images/export.svg',
    isMenu: true,
    roles: [1],
  },
  {
    path: '/report-ratings',
    element: <ReportRating />,
    name: 'report-ratings',
    title: 'User Leaderboard',
    icon: 'images/chart.svg',
    isMenu: true,
    roles: [0, 1, 2],
  },
]

export default AppRoutes
