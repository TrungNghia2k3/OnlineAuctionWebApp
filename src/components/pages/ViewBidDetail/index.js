import { useContext, useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import bidApi from '../../../api/bid'
import { AuthContext } from '../../../contexts/AuthContext'
import Label from '../../atoms/Label'
import Text from '../../atoms/Text'
import Image from '../../atoms/Image'
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
    userId = currentUser.username // Use username for new format
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
    switch (item?.status) {
      case 'UPCOMING':
        return 'Upcoming'
      case 'ACTIVE':
        return 'Happening'
      case 'SOLD':
      case 'EXPIRED':
      case 'CANCELLED':
        return 'Ended'
      default:
        return item?.status || 'Unknown'
    }
  }

  const displayFormatDate = (value) => {
    if (item == null || !value) {
      return ''
    }

    // Handle new array format [year, month, day, hour, minute]
    if (Array.isArray(value) && value.length >= 3) {
      const [year, month, day] = value
      return `${year}/${month.toString().padStart(2, '0')}/${day.toString().padStart(2, '0')}`
    }

    // Fallback for old date format
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

  const getMainImage = () => {
    // Handle new API format with images array
    if (item?.images && Array.isArray(item.images)) {
      const mainImage = item.images.find(img => img.type === 'MAIN')
      if (mainImage) {
        return mainImage.imageUrl
      }
      // Fallback to first image if no main image found
      if (item.images.length > 0) {
        return item.images[0].imageUrl
      }
    }
    
    // Fallback for old format
    if (item?.imageFile) {
      return `data:image/;base64,${item.imageFile}`
    }
    
    // Default placeholder if no image
    return 'images/placeholder.jpg'
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
      <div className='container-fluid'>
        <div>
          <div className='row'>
            <div className='col-sm-4'>
              <Image path={getMainImage()} className={{ 'image-item-bid-bdpage': true }} />
            </div>
            <div className='col-sm-8'>
              <div className='item_name-bdpage'>
                <Label as='h4' className={{ 'mb-1 text-start': true }} text={item?.name} />
                {userId !== item?.seller?.username || item?.status !== 'UPCOMING' ? null : (
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
              <div className='card bid-information-card-bdpage'>
                <div className='row'>
                  <div className='col'>
                    <h4 className='card-title'>Bid information</h4>
                  </div>
                  {roleUser === 1 && bids.length > 0 && item?.status !== 'UPCOMING' ? (
                    <div className='col box-top-bids'>
                      <label
                        className='label-top-bids'
                        style={{ cursor: 'pointer', color: '#198754' }}
                        ref={target}
                        onClick={() => setShow(!show)}
                      >
                        Top bids
                      </label>
                      {show && (
                        <div className='position-absolute bg-white border rounded shadow p-3' style={{ zIndex: 1000, minWidth: '300px' }}>
                          <h5 className='header-popover-history mb-2'>All Users Bid</h5>
                          <div>
                            {bids.map((bid, index) => {
                              if (index < 10) {
                                return (
                                  <div className='row' key={index}>
                                    <div className='col-3'>User {index + 1}: </div>
                                    <div className='col-5'>{displayFormatDate(bid.createdDate)}</div>
                                    <div className='col-4'>{displayFormatBidPrice(bid.amount)}</div>
                                  </div>
                                )
                              }
                              return null
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  ) : null}
                </div>
                <hr className='singleline' />
                <div className='bid-status-bdpage'>
                  <div className='row'>
                    <div className='col'>
                      <Label className={{ 'label-card': true }} text='Bid status:' />
                    </div>
                    <div className='col content-card-bdpage'>
                      <Text className={getBidStatusColor()} text={getBidStatusColor()} />
                    </div>
                  </div>
                </div>
                <hr className='singleline' />
                <div className='date-bdpage'>
                  <div className='row'>
                    <div className='col'>
                      <Label className={{ 'label-card': true }} text='Start date:' />
                    </div>
                    <div className='col content-card-bdpage'>
                      <Text className='time' text={displayFormatDate(item?.auctionStartDate)} />
                    </div>
                  </div>
                </div>
                <hr className='singleline' />
                <div className='date-bdpage'>
                  <div className='row'>
                    <div className='col'>
                      <Label className={{ 'label-card': true }} text='End date:' />
                    </div>
                    <div className='col content-card-bdpage'>
                      <Text className='time' text={displayFormatDate(item?.auctionEndDate)} />
                    </div>
                  </div>
                </div>
                <hr className='singleline' />
                <div className='min-bid-bdpage'>
                  <div className='row'>
                    <div className='col'>
                      <Label className={{ 'label-card': true }} text='Min increase:' />
                    </div>
                    <div className='col content-card-bdpage'>
                      <Text className='minPrice' text={displayFormatBidPrice(item?.minIncreasePrice)} />
                    </div>
                  </div>
                </div>
                <hr className='singleline' />
                <div className='current-bid-bdpage'>
                  <div className='row'>
                    <div className='col'>
                      <Label className={{ 'label-card': true }} text='Current bid:' />
                    </div>
                    <div className='col content-card-bdpage'>
                      <Text className='currentPrice' text={displayFormatBidPrice(item?.startingPrice)} />
                    </div>
                  </div>
                </div>
                {item?.buyerBid?.amount && (
                  <>
                    <hr className='singleline' />
                    <div className='current-bid-bdpage'>
                      <div className='row'>
                        <div className='col'>
                          <Label className={{ 'label-card': true }} text='Your bid:' />
                        </div>
                        <div className='col content-card-bdpage'>
                          <Text className='currentPrice' text={displayFormatBidPrice(item.buyerBid.amount)} />
                        </div>
                      </div>
                    </div>
                  </>
                )}
                {item?.buyerBid?.createdDate && (
                  <>
                    <hr className='singleline' />
                    <div className='date-bdpage'>
                      <div className='row'>
                        <div className='col'>
                          <Label className={{ 'label-card': true }} text='Date of bid:' />
                        </div>
                        <div className='col content-card-bdpage'>
                          <Text className='time' text={displayFormatDate(item.buyerBid.createdDate)} />
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ViewBidDetail
