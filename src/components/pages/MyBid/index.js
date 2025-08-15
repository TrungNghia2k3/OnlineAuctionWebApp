import { useContext, useEffect, useState } from 'react'
import { Container, Nav } from 'react-bootstrap'
import ItemApi from '../../../api/item'
import { AuthContext } from '../../../contexts/AuthContext'
import ProtectedRoute from '../../protected-route'
import Template from '../../templates/default/no-separation-template'
import ViewItemDetailLabel from '../ViewItemDetailLabel'
import './style.scss'

const MyBid = () => {
  const [items, setItems] = useState(null)
  const [filteredItems, setFilteredItems] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  const { currentUser } = useContext(AuthContext)
  let token = null
  let role = null
  if (currentUser) {
    token = currentUser.token
    role = currentUser.role
  }

  useEffect(() => {
    if (token) {
      const getListItemByUserId = async () => {
        const result = await ItemApi.getItemByUserId(token)
        setItems(result)
        setFilteredItems(result)
      }
      getListItemByUserId()
    }
  }, [token])

  const handleSelect = (selectedKey) => {
    switch (selectedKey) {
      case 'All':
        setFilteredItems(items)
        break
      case '0':
        setFilteredItems(items.filter((item) => item.bidStatus === 0))
        break
      case '1':
        setFilteredItems(items.filter((item) => item.bidStatus === 1))
        break
      case '2':
        setFilteredItems(items.filter((item) => item.bidStatus === 2))
        break
      default:
        setFilteredItems(items)
    }
  }

  const content = (
    <>
      <Container fluid>
        <Nav className='nav-my-bid' activeKey='/my-bid' onSelect={handleSelect}>
          <Nav.Item>
            <Nav.Link eventKey='All'>All</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey='0'>Upcoming</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey='1'>Happening</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey='2'>Ending</Nav.Link>
          </Nav.Item>
        </Nav>
        <div className='my-bid-items'>
          <ViewItemDetailLabel items={filteredItems}></ViewItemDetailLabel>
        </div>
      </Container>
    </>
  )

  return (
    <>
      <ProtectedRoute />
      <Template headerIcon={'images/heart-solid.svg'} headerTitle={'My bidder page'} content={content} />
    </>
  )
}

export default MyBid
