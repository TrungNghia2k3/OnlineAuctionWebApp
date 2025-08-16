import { useContext, useEffect, useState } from 'react'
import ItemApi from '../../../api/item'
import { AuthContext } from '../../../contexts/AuthContext'
import ProtectedRoute from '../../protected-route'
import Template from '../../templates/default/no-separation-template'
import ViewItemDetailLabel from '../ViewItemDetailLabel'
import './style.scss'

const MyBid = () => {
  const [items, setItems] = useState(null)
  const [filteredItems, setFilteredItems] = useState(null)

  const { currentUser } = useContext(AuthContext)
  let token = null
  if (currentUser) {
    token = currentUser.token
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
      <div className='container-fluid'>
        <ul className='nav nav-my-bid'>
          <li className='nav-item'>
            <button 
              className='nav-link btn btn-link' 
              type='button'
              onClick={() => handleSelect('All')}
            >
              All
            </button>
          </li>
          <li className='nav-item'>
            <button 
              className='nav-link btn btn-link' 
              type='button'
              onClick={() => handleSelect('0')}
            >
              Upcoming
            </button>
          </li>
          <li className='nav-item'>
            <button 
              className='nav-link btn btn-link' 
              type='button'
              onClick={() => handleSelect('1')}
            >
              Happening
            </button>
          </li>
          <li className='nav-item'>
            <button 
              className='nav-link btn btn-link' 
              type='button'
              onClick={() => handleSelect('2')}
            >
              Ending
            </button>
          </li>
        </ul>
        <div className='my-bid-items'>
          <ViewItemDetailLabel items={filteredItems}></ViewItemDetailLabel>
        </div>
      </div>
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
