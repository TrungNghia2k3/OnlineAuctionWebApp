import { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import NotificationApi from '../../../api/notification'
import { AuthContext } from '../../../contexts/AuthContext'
import Label from '../../atoms/Label'
import Image from '../../atoms/Image'
import ProtectedRoute from '../../protected-route'
import Template from '../../templates/default/no-separation-template'
import './style.scss'

const Notification = () => {
  const [notifications, setNotifications] = useState([])
  const navigate = useNavigate()
  const { currentUser } = useContext(AuthContext)
  let token = null
  let fullName = null
  if (currentUser) {
    token = currentUser.token
    fullName = currentUser.fullName
  }

  useEffect(() => {
    if (token) {
      const getListNotifications = async () => {
        const result = await NotificationApi.getAllNotificationsByIdUser(token)
        setNotifications(result)
      }
      getListNotifications()
    }
  }, [token])

  let readNotifications = []
  if (notifications) {
    readNotifications = notifications.filter((notification) => notification.markRead)
    readNotifications.sort((a, b) => new Date(b.notificationDate) - new Date(a.notificationDate))
  }

  const handleChangeDate = (date) => {
    const apiDate = new Date(date)
    const options = {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    }
    return apiDate.toLocaleString('en-GB', options)
  }

  const handleRatingView = (id) => {
    navigate(`/bid-detail?id=${id}&mode=view`)
  }
  const content = (
    <>
      <div className="container-fluid">
        {readNotifications.length === 0 ? <Label text='Currently, you have no notifications' /> : null}
        {readNotifications.map((notification, index) => (
          <div
            key={index}
            className='card notification-card-mark my-3'
            onClick={() => handleRatingView(notification.itemId)}
          >
            <div className='card-body nofitication-card-body'>
              <Image path='images/bookmark-solid.svg' className="bookMarkIcon" />
              <div className='notification-info-card-body'>
                <p className='username-react-item m-0'>
                  <span className='userName'>{fullName}</span> commented on your recent post{' '}
                  <span className='itemName'>{notification.itemName}</span>
                </p>
                <p className='message m-0'>{notification.message}</p>
                <p className='notification-date m-0'>
                  {handleChangeDate(notification.notificationDate)}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  )

  return (
    <>
      <ProtectedRoute />
      <Template headerIcon={'images/bell-solid.svg'} headerTitle={'Notification page'} content={content} />
    </>
  )
}

export default Notification
