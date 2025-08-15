import { useContext, useEffect, useState } from 'react'
import { Col, Row } from 'react-bootstrap'
import Carousel from 'react-bootstrap/Carousel'
import { useNavigate } from 'react-router-dom'
import { Container } from 'reactstrap'
import ItemApi from '../../../api/item'
import { AuthContext } from '../../../contexts/AuthContext'
import Label from '../../atoms/forms/label'
import Image from '../../atoms/image'
import Pagination from '../../atoms/pagination'
import Body from '../../organisms/body'
import ProtectedRoute from '../../protected-route'
import ViewItemDetailLabel from '../ViewItemDetailLabel'
import './style.scss'

const Home = () => {
  const [listItems, setListItems] = useState([])
  const [paginationItem, setPaginationItem] = useState([])
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
    if (token) {
      const getListItems = async () => {
        const result = await ItemApi.getAllItem(token)
        setListItems(result)
      }
      getListItems()
    }
  }, [token])

  const upcomingItem = (array) => {
    const bidStatusArray = []
    array.map((item) => {
      if (item.bidStatus === 0) {
        bidStatusArray.push(item)
      }
    })

    const startIndex = (activePaginationUpcoming - 1) * 4
    const endIndex = activePaginationUpcoming * 4

    return bidStatusArray.slice(startIndex, endIndex)
  }

  const happeningItem = (array) => {
    const bidStatusArray = []
    array.map((item) => {
      if (item.bidStatus === 1) {
        bidStatusArray.push(item)
      }
    })

    const startIndex = (activePaginationHappening - 1) * 4
    const endIndex = activePaginationHappening * 4

    return bidStatusArray.slice(startIndex, endIndex)
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
      <Container fluid>
        <Col className='status-auctions py-1'>
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
        </Col>
        <Row className='image-horizontal mb-4'>
          <Carousel>
            {carouselItems.map((item, index) => (
              <Carousel.Item key={index}>
                <Label
                  onClick={() => handleBrowseCategory(item.id)}
                  text='See More'
                  className={{ 'label-carousel-category-menu': true }}
                />
                <Image path={item.path} className={{ carouselImage: true }} />
              </Carousel.Item>
            ))}
          </Carousel>
        </Row>
        <Col className='status-auctions py-1'>
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
        </Col>
      </Container>
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
