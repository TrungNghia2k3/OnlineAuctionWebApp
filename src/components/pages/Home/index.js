import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ItemApi from '../../../api/item';
import { AuthContext } from '../../../contexts/AuthContext';
import Label from '../../atoms/Label';
import Image from '../../atoms/Image';
import Pagination from '../../atoms/Pagination';
import Body from '../../organisms/body';
import ProtectedRoute from '../../protected-route';
import ViewItemDetailLabel from '../ViewItemDetailLabel';
import './style.scss';

const Home = () => {
  const [listItems, setListItems] = useState([])
  const [activePaginationUpcoming, setActivePaginationUpcoming] = useState(1)
  const [activePaginationHappening, setActivePaginationHappening] = useState(1)

  const navigate = useNavigate()
  const { currentUser } = useContext(AuthContext)
  let token = null
  if (currentUser) {
    token = currentUser.token
  }

  const carouselItems = [
    {
      id: 1,
      path: 'images/Slider5.jpg',
      value:
        'The category of Art includes classical art, modern & contemporary art, photography, posters, prints & limited editions.',
    },
    {
      id: 6,
      path: 'images/Slider4.jpg',
      value:
        'The category Coins & Stamps includes ancient coins, banknotes, bullion, euro coins, modern coins, postcards, stamps, and world coins.',
    },
    {
      id: 8,
      path: 'images/Slider2.jpg',
      value:
        'The category Car & Motorbikes includes classic cars, classic motorcycles & scooters, automobilia & motobilia.',
    },
  ]

  useEffect(() => {
    const getListItems = async () => {
      try {
        console.log('Fetching items with token:', token)
        let response
        
        if (token) {
          // If user is authenticated, fetch with token
          response = await ItemApi.getAllItem(token)
        } else {
          // If user is not authenticated, try to fetch public items
          try {
            response = await ItemApi.getAllItemPublic()
          } catch (publicError) {
            console.log('Public API not available, setting empty items for guest users')
            setListItems([])
            return
          }
        }
        
        console.log('Raw API response:', response)
        
        // Handle the new API response format
        if (response && response.code === 200 && response.result) {
          console.log('Fetched items (result):', response.result)
          console.log('Is result an array?', Array.isArray(response.result))
          setListItems(response.result)
        } else if (response && Array.isArray(response)) {
          console.log('Response is direct array:', response)
          setListItems(response)
        } else {
          console.log('Unexpected response format, setting empty array')
          setListItems([])
        }
      } catch (error) {
        console.error('Error fetching items:', error)
        setListItems([])
      }
    }
    
    getListItems()
  }, [token])

  const upcomingItem = (array) => {
    console.log('upcomingItem called with:', array, 'Type:', typeof array, 'Is array:', Array.isArray(array))
    
    if (!array || !Array.isArray(array)) {
      console.log('Array is not valid, returning empty array')
      return []
    }
    
    const upcomingStatusArray = []
    array.forEach((item) => {
      if (item.status === 'UPCOMING') {
        upcomingStatusArray.push(item)
      }
    })

    const startIndex = (activePaginationUpcoming - 1) * 4
    const endIndex = activePaginationUpcoming * 4

    return upcomingStatusArray.slice(startIndex, endIndex)
  }

  const happeningItem = (array) => {
    console.log('happeningItem called with:', array, 'Type:', typeof array, 'Is array:', Array.isArray(array))
    
    if (!array || !Array.isArray(array)) {
      console.log('Array is not valid, returning empty array')
      return []
    }
    
    const activeStatusArray = []
    array.forEach((item) => {
      if (item.status === 'ACTIVE') {
        activeStatusArray.push(item)
      }
    })

    const startIndex = (activePaginationHappening - 1) * 4
    const endIndex = activePaginationHappening * 4

    return activeStatusArray.slice(startIndex, endIndex)
  }

  const handleBrowseCategory = (id) => {
    navigate(`/category-browser?id=${id}`)
  }

  const handleClickUpcomingItem = (number) => {
    setActivePaginationUpcoming(number)
  }

  const handleClickHappeningItem = (number) => {
    setActivePaginationHappening(number)
  }

  const content = (
    <>
      <div className='banner'>
        <h4 className='banner-heading'>
          Find big brands at bargain prices right here, the home of consumer goods and retail surplus auctions
        </h4>
      </div>
      <div className="container-fluid">
        <div className="col status-auctions py-1">
          <h5 className='status-auctions-title'>Happening auctions</h5>
          <hr className='singleline m-0 ' />
          <div className='view-item-homepage'>
            <ViewItemDetailLabel items={happeningItem(listItems)} />
          </div>
          <div className='pagination-home'>
            <Pagination
              firstNumbers={[1, 2, 3]}
              betweenNumbers={[4, 5]}
              lastNumbers={[6, 7]}
              activeNumber={activePaginationHappening}
              number={activePaginationHappening}
              handleClick={handleClickHappeningItem}
              disabledNumbers={[]}
            />
          </div>
        </div>
        <div className="row image-horizontal mb-4">
          <div id="homeCarousel" className="carousel slide" data-bs-ride="carousel">
            <div className="carousel-inner">
              {carouselItems.map((item, index) => (
                <div key={index} className={`carousel-item ${index === 0 ? 'active' : ''}`}>
                  <Label
                    onClick={() => handleBrowseCategory(item.id)}
                    text='See More'
                    className="label-carousel-category-menu"
                  />
                  <Image path={item.path} className="carouselImage d-block w-100" />
                </div>
              ))}
            </div>
            <button className="carousel-control-prev" type="button" data-bs-target="#homeCarousel" data-bs-slide="prev">
              <span className="carousel-control-prev-icon" aria-hidden="true"></span>
              <span className="visually-hidden">Previous</span>
            </button>
            <button className="carousel-control-next" type="button" data-bs-target="#homeCarousel" data-bs-slide="next">
              <span className="carousel-control-next-icon" aria-hidden="true"></span>
              <span className="visually-hidden">Next</span>
            </button>
          </div>
        </div>
        <div className="col status-auctions py-1">
          <h5 className='status-auctions-title'>Upcoming auctions</h5>
          <hr className='singleline m-0' />
          <div className='view-item-homepage'>
            <ViewItemDetailLabel items={upcomingItem(listItems)} />
          </div>
          <div className='pagination-home'>
            <Pagination
              firstNumbers={[1, 2, 3]}
              betweenNumbers={[4, 5]}
              lastNumbers={[6, 7]}
              activeNumber={activePaginationUpcoming}
              number={activePaginationUpcoming}
              handleClick={handleClickUpcomingItem}
              disabledNumbers={[]}
            />
          </div>
        </div>
      </div>
    </>
  )

  return (
    <>
      <ProtectedRoute />
      <Body className={{ 'body-layout': true }} children={content} />
    </>
  )
}

export default Home
