import { useContext, useEffect, useState } from 'react'
import { Container } from 'react-bootstrap'
import Card from 'react-bootstrap/Card'
import { useNavigate } from 'react-router-dom'
import NotificationApi from '../../../api/notification'
import { AuthContext } from '../../../contexts/AuthContext'
import Label from '../../atoms/forms/label'
import Image from '../../atoms/image'
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
      <Container fluid>
        {readNotifications.length === 0 ? <Label text='Currently, you have no notifications' /> : null}
        {readNotifications.map((notification, index) => (
          <Card
            key={index}
            className='notification-card-mark my-3'
            onClick={() => handleRatingView(notification.itemId)}
          >
            <Card.Body className='nofitication-card-body'>
              <Image path='images/bookmark-solid.svg' className={{ bookMarkIcon: true }} />
              <div className='notification-info-card-body'>
                <Card.Text className='username-react-item m-0'>
                  <span className='userName'>{fullName}</span> commented on your recent post{' '}
                  <span className='itemName'>{notification.itemName}</span>
                </Card.Text>
                <Card.Text className='message m-0'>{notification.message}</Card.Text>
                <Card.Text className='notification-date m-0'>
                  {handleChangeDate(notification.notificationDate)}
                </Card.Text>
              </div>
            </Card.Body>
          </Card>
        ))}
      </Container>
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
