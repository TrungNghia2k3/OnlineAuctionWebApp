import { useNavigate } from 'react-router-dom'
import Label from '../../atoms/Label'
import Image from '../../atoms/Image'
import Button from '../../molecules/Button'
import './style.scss'

const ViewItemDetailLabel = ({ items }) => {
  const navigate = useNavigate()

  const handleChangeBidStatus = (status) => {
    return status === 'UPCOMING' ? 'UPCOMING' : status === 'ACTIVE' ? 'HAPPENING' : 'ENDING'
  }

  const handleChangeTitleDate = (status) => {
    return status === 'UPCOMING' ? 'Starts in:' : status === 'ACTIVE' ? 'Ends in:' : 'End date:'
  }

  const handleChangeDate = (status, auctionStartDate, auctionEndDate) => {
    // Handle the new date format [year, month, day, hour, minute]
    const dateArray = status === 'UPCOMING' ? auctionStartDate : auctionEndDate
    if (Array.isArray(dateArray) && dateArray.length >= 3) {
      const [year, month, day] = dateArray
      return `${year}/${month.toString().padStart(2, '0')}/${day.toString().padStart(2, '0')}`
    }
    // Fallback for old date format
    const apiDate = new Date(status === 'UPCOMING' ? auctionStartDate : auctionEndDate)
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

  const getMainImage = (item) => {
    // Handle new API format with images array
    if (item.images && Array.isArray(item.images)) {
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
    if (item.imageFile) {
      return `data:image/;base64,${item.imageFile}`
    }
    
    // Default placeholder if no image
    return 'images/placeholder.jpg'
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
          <div key={item.id} className="row">
            <div className='card happening-item-category-card my-3'>
              <div className='left-side-card'>
                <div className={`tag-status-${handleChangeBidStatus(item.status).toLowerCase()}`}>
                  <span className='ribbon__content'>{handleChangeBidStatus(item.status)}</span>
                </div>
                <Image path={getMainImage(item)} className="productImageCategoryPage" />
              </div>
              <div className='card-body right-side-card'>
                <h5 className='card-title name-item-category-page'>{handleMaxLengthName(item.name)}</h5>
                <h6 className='card-subtitle fullname-buyer-category-page'>
                  {handleMaxLengthDescription(item.description)}
                </h6>
                <p className='card-text description-item-category-page'>
                  Min increase:{displayFormatCurrentBidPrice(item.minIncreasePrice)}
                </p>
                <div className='bid-item-category-page'>
                  <Label className="label-bid-item-category-page" text={'Current bid:'} />
                  <p className='card-text bid-item-category-page'>
                    {displayFormatCurrentBidPrice(item.startingPrice)}
                  </p>
                </div>
                <div className='time-item-category-page'>
                  <Label
                    className="label-time-item-category-page"
                    text={handleChangeTitleDate(item.status)}
                  />
                  <p className='card-text date-item-category-page'>
                    {handleChangeDate(item.status, item.auctionStartDate, item.auctionEndDate)}
                  </p>
                </div>
              </div>
              <div className='btn-view-auction'>
                <Button
                  type='submit'
                  variant='success'
                  text='View auction detail'
                  onClick={() => handleViewDetailItem(item.id)}
                />
              </div>
            </div>
          </div>
        ))}
      {items?.length <= 0 && <div className='item-detail-no-data'>There is no data</div>}
    </>
  )
}
export default ViewItemDetailLabel
