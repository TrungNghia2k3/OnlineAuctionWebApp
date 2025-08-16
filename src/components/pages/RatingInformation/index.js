import { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import RatingApi from '../../../api/rating'
import { AuthContext } from '../../../contexts/AuthContext'
import Button from '../../molecules/Button'
import './style.scss'

const RatingInformation = ({ item }) => {
  const [rating, setRating] = useState(null)
  const [hoverRating, setHoverRating] = useState(null)
  const navigate = useNavigate()

  const { currentUser } = useContext(AuthContext)
  let token = null
  let userId = null
  if (currentUser) {
    token = currentUser.token
    userId = currentUser.id
  }

  useEffect(() => {
    setRating(item.scoreRating)
  }, [item.scoreRating, setRating])

  const handleRatingChange = (currentRating) => {
    setRating(currentRating)
  }

  const handleStarHover = (currentRating) => {
    setHoverRating(currentRating)
  }
  const handleCreateRating = async () => {
    const dataSaving = {
      itemId: item.id,
      score: rating,
    }
    await RatingApi.update(dataSaving, token)
    navigate(`/bid-detail?id=${dataSaving.itemId}&mode=viewrating`)
  }

  const renderStars = () => {
    return [...Array(5)].map((_, index) => {
      const currentRating = index + 1
      return (
        <label key={currentRating}>
          <input
            type='radio'
            name='rating'
            value={currentRating}
            onClick={!item?.scoreRating ? () => handleRatingChange(currentRating) : null}
          />
          <i
            className={`bi bi-star${currentRating <= (hoverRating || rating) ? '-fill' : ''} star`}
            style={{ 
              fontSize: '40px', 
              color: currentRating <= (hoverRating || rating) ? '#ffc107' : '#e4d5e9',
              cursor: !item?.scoreRating ? 'pointer' : 'default'
            }}
            onMouseEnter={!item?.scoreRating ? () => handleStarHover(currentRating) : null}
            onMouseLeave={!item?.scoreRating ? () => handleStarHover(null) : null}
          />
        </label>
      )
    })
  }
  return (
    <div className='form-user-reviews'>
      <h5>User reviews</h5>
      <div className='radio-rating'>{renderStars()}</div>
      <p className='fs-6 mt-2'>Your rating is {rating}</p>
      {!item?.scoreRating ? (
        <Button variant='danger' text='Submit your review' onClick={() => handleCreateRating()} />
      ) : null}
    </div>
  )
}

export default RatingInformation
