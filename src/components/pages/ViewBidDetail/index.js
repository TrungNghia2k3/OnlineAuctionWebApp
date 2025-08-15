import { useContext, useEffect, useRef, useState } from 'react'
import { Card, Col, Container, Form, Overlay, Popover, Row } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import bidApi from '../../../api/bid'
import { AuthContext } from '../../../contexts/AuthContext'
import Label from '../../atoms/forms/label'
import Text from '../../atoms/forms/text'
import Image from '../../atoms/image'
import './style.scss'

const ViewBidDetail = ({ item }) => {
  const [bids, setBids] = useState([])
  const [show, setShow] = useState(false)
  const target = useRef(null)

  const { currentUser } = useContext(AuthContext)
  let userId = null
  let roleUser = null
  let token = null
  if (currentUser) {
    userId = currentUser.id
    roleUser = currentUser.role
    token = currentUser.token
  }
  const navigate = useNavigate()

  useEffect(() => {
    if (token && item) {
      const getListBids = async () => {
        const result = await bidApi.GetAllBid(token, item.id)
        setBids(result)
      }
      getListBids()
    }
  }, [token, item])

  const getBidStatusColor = () => {
    switch (item?.bidStatus) {
      case 0:
        return 'Upcoming'
      case 1:
        return 'Happening'
      case 2:
        return 'Ended'
      default:
        return
    }
  }

  const displayFormatDate = (value) => {
    if (item == null) {
      return ''
    }

    const apiDate = new Date(value)
    const year = apiDate.getFullYear()
    const month = (apiDate.getMonth() + 1).toString().padStart(2, '0')
    const day = apiDate.getDate().toString().padStart(2, '0')

    return `${year}/${month}/${day}`
  }

  const displayFormatBidPrice = (value) => {
    if (!value) {
      return
    }

    const numberFormat = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    })
    return numberFormat.format(value)
  }

  const handleEditClick = () => {
    navigate(`/bid-detail?id=${item?.id}&mode=edit`)
  }
  const handleMaxLengthDescription = (text) => {
    if (text) {
      const words = text.split(' ')

      if (words.length <= 149) {
        return text
      } else {
        const truncatedText = words.slice(0, 149).join(' ') + '...'
        return truncatedText
      }
    }
  }

  return (
    <div>
      <Container fluid>
        <div>
          <Row>
            <Col sm={4}>
              <Image path={`data:image/;base64,${item?.imageFile}`} className={{ 'image-item-bid-bdpage': true }} />
            </Col>
            <Col sm={8}>
              <div className='item_name-bdpage'>
                <Label as='h4' className={{ 'mb-1 text-start': true }} text={item?.name} />
                {userId !== item?.sellerId || item?.bidStatus !== 0 ? null : (
                  <Image
                    path={'images/edit.svg'}
                    className={{ 'icon-edit-bdpage': true }}
                    handleClick={handleEditClick}
                    text='Edit'
                  />
                )}
              </div>
              <div className='item-description-bdpage'>
                <Text text={handleMaxLengthDescription(item?.description)} />
              </div>
              <Card className='bid-information-card-bdpage'>
                <Row>
                  <Col>
                    <Card.Title as={'h4'}>Bid information</Card.Title>
                  </Col>
                  {roleUser === 1 && bids.length > 0 && item?.bidStatus !== 0 ? (
                    <Col className='box-top-bids'>
                      <Form.Label
                        className='label-top-bids'
                        variant='success'
                        style={{ cursor: 'pointer' }}
                        ref={target}
                        onClick={() => setShow(!show)}
                      >
                        Top bids
                      </Form.Label>
                      <Overlay
                        show={show}
                        target={target.current}
                        placement='bottom'
                        rootClose={true}
                        onHide={() => setShow(false)}
                      >
                        <Popover id='popover-basic'>
                          <Popover.Header as='h3' className='header-popover-history'>
                            All Users Bid
                          </Popover.Header>
                          <Popover.Body>
                            {bids.map((bid, index) => {
                              if (index < 10) {
                                return (
                                  <Row>
                                    <Col xs={3}>User {index + 1}: </Col>
                                    <Col xs={5}>{displayFormatDate(bid.createdDate)}</Col>
                                    <Col xs={4}>{displayFormatBidPrice(bid.amount)}</Col>
                                  </Row>
                                )
                              }
                              return null
                            })}
                          </Popover.Body>
                        </Popover>
                      </Overlay>
                    </Col>
                  ) : null}
                </Row>
                <hr className='singleline' />
                <div className='bid-status-bdpage'>
                  <Row>
                    <Col>
                      <Label className={{ 'label-card': true }} text='Bid status:' />
                    </Col>
                    <Col className='content-card-bdpage'>
                      <Text className={getBidStatusColor()} text={getBidStatusColor()} />
                    </Col>
                  </Row>
                </div>
                <hr className='singleline' />
                <div className='date-bdpage'>
                  <Row>
                    <Col>
                      <Label className={{ 'label-card': true }} text='Start date:' />
                    </Col>
                    <Col className='content-card-bdpage'>
                      <Text className='time' text={displayFormatDate(item?.auctionStartDate)} />
                    </Col>
                  </Row>
                </div>
                <hr className='singleline' />
                <div className='date-bdpage'>
                  <Row>
                    <Col>
                      <Label className={{ 'label-card': true }} text='End date:' />
                    </Col>
                    <Col className='content-card-bdpage'>
                      <Text className='time' text={displayFormatDate(item?.auctionEndDate)} />
                    </Col>
                  </Row>
                </div>
                <hr className='singleline' />
                <div className='min-bid-bdpage'>
                  <Row>
                    <Col>
                      <Label className={{ 'label-card': true }} text='Min increase:' />
                    </Col>
                    <Col className='content-card-bdpage'>
                      <Text className='minPrice' text={displayFormatBidPrice(item?.minIncreasePrice)} />
                    </Col>
                  </Row>
                </div>
                <hr className='singleline' />
                <div className='current-bid-bdpage'>
                  <Row>
                    <Col>
                      <Label className={{ 'label-card': true }} text='Current bid:' />
                    </Col>
                    <Col className='content-card-bdpage'>
                      <Text className='currentPrice' text={displayFormatBidPrice(item?.currentBidPrice)} />
                    </Col>
                  </Row>
                </div>
                {item?.buyerBid?.amount && (
                  <>
                    <hr className='singleline' />
                    <div className='current-bid-bdpage'>
                      <Row>
                        <Col>
                          <Label className={{ 'label-card': true }} text='Your bid:' />
                        </Col>
                        <Col className='content-card-bdpage'>
                          <Text className='currentPrice' text={displayFormatBidPrice(item.buyerBid.amount)} />
                        </Col>
                      </Row>
                    </div>
                  </>
                )}
                {item?.buyerBid?.createdDate && (
                  <>
                    <hr className='singleline' />
                    <div className='date-bdpage'>
                      <Row>
                        <Col>
                          <Label className={{ 'label-card': true }} text='Date of bid:' />
                        </Col>
                        <Col className='content-card-bdpage'>
                          <Text className='time' text={displayFormatDate(item.buyerBid.createdDate)} />
                        </Col>
                      </Row>
                    </div>
                  </>
                )}
              </Card>
            </Col>
          </Row>
        </div>
      </Container>
    </div>
  )
}

export default ViewBidDetail
