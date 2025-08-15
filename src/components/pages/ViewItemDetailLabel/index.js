import { Row } from 'react-bootstrap'
import Card from 'react-bootstrap/Card'
import { useNavigate } from 'react-router-dom'
import Label from '../../atoms/forms/label'
import Image from '../../atoms/image'
import Button from '../../molecules/buttons/button'
import './style.scss'

const ViewItemDetailLabel = ({ items }) => {
  const navigate = useNavigate()

  const handleChangeBidStatus = (bidStatus) => {
    return bidStatus === 0 ? 'UPCOMING' : bidStatus === 1 ? 'HAPPENING' : 'ENDING'
  }

  const handleChangeTitleDate = (bidStatus) => {
    return bidStatus === 0 ? 'Starts in:' : bidStatus === 1 ? 'Ends in:' : 'End date:'
  }

  const handleChangeDate = (bidStatus, auctionStartDate, auctionEndDate) => {
    const apiDate = new Date(bidStatus === 0 ? auctionStartDate : auctionEndDate)
    const year = apiDate.getFullYear()
    const month = (apiDate.getMonth() + 1).toString().padStart(2, '0')
    const day = apiDate.getDate().toString().padStart(2, '0')

    return `${year}/${month}/${day}`
  }

  const handleViewDetailItem = (idItem) => {
    navigate(`/bid-detail?id=${idItem}&mode=view`)
  }

  const handleMaxLengthDescription = (text) => {
    const words = text.split(' ')

    if (words.length <= 20) {
      return text
    } else {
      const truncatedText = words.slice(0, 20).join(' ') + '...'
      return truncatedText
    }
  }

  const handleMaxLengthName = (text) => {
    const words = text.split(' ')

    if (words.length <= 8) {
      return text
    } else {
      const truncatedText = words.slice(0, 8).join(' ') + '...'
      return truncatedText
    }
  }

  const displayFormatCurrentBidPrice = (item) => {
    if (item == null) {
      return ''
    }

    const numberFormat = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    })
    return numberFormat.format(item)
  }

  return (
    <>
      {items &&
        items.map((item) => (
          <Row key={item.id}>
            <Card className='happening-item-category-card my-3'>
              <div className='left-side-card'>
                <div className={`tag-status-${handleChangeBidStatus(item.bidStatus).toLowerCase()}`}>
                  <span className='ribbon__content'>{handleChangeBidStatus(item.bidStatus)}</span>
                </div>
                <Image path={`data:image/;base64,${item.imageFile}`} className={{ productImageCategoryPage: true }} />
              </div>
              <Card.Body className='right-side-card'>
                <Card.Title className='name-item-category-page'>{handleMaxLengthName(item.name)}</Card.Title>
                <Card.Subtitle className='fullname-buyer-category-page'>
                  {handleMaxLengthDescription(item.description)}
                </Card.Subtitle>
                <Card.Text className='description-item-category-page'>
                  Min increase:{displayFormatCurrentBidPrice(item.minIncreasePrice)}
                </Card.Text>
                <div className='bid-item-category-page'>
                  <Label className={{ 'label-bid-item-category-page': true }} text={'Current bid:'} />
                  <Card.Text className='bid-item-category-page'>
                    {displayFormatCurrentBidPrice(item.currentBidPrice)}
                  </Card.Text>
                </div>
                <div className='time-item-category-page'>
                  <Label
                    className={{ 'label-time-item-category-page': true }}
                    text={handleChangeTitleDate(item.bidStatus)}
                  />
                  <Card.Text className='date-item-category-page'>
                    {handleChangeDate(item.bidStatus, item.auctionStartDate, item.auctionEndDate)}
                  </Card.Text>
                </div>
              </Card.Body>
              <div className='btn-view-auction'>
                <Button
                  type='submit'
                  variant='success'
                  text='View auction detail'
                  onClick={() => handleViewDetailItem(item.id)}
                />
              </div>
            </Card>
          </Row>
        ))}
      {items?.length <= 0 && <div className='item-detail-no-data'>There is no data</div>}
    </>
  )
}
export default ViewItemDetailLabel
