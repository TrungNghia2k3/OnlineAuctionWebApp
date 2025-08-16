import { useFormik } from 'formik'
import { useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import * as yup from 'yup'
import bidApi from '../../../api/bid'
import { errorMessages } from '../../../common'
import { AuthContext } from '../../../contexts/AuthContext'
import Button from '../../molecules/Button'
import NumberField from '../../molecules/NumberField'
import './style.scss'

const PlaceAmount = ({ item }) => {
  const navigate = useNavigate()
  const { currentUser } = useContext(AuthContext)
  let userId = null
  let roleUser = null
  let token = null
  if (currentUser) {
    userId = currentUser.username // Use username for new format
    roleUser = currentUser.role
    token = currentUser.token
  }
  const formik = useFormik({
    initialValues: {
      id: 0,
      buyerId: userId,
      itemId: item?.id || 0,
      amount: '',
    },
    enableReinitialize: true,
    validationSchema: yup.object().shape({
      id: yup.number(),
      buyerId: yup.string(), // Changed to string since userId is now username
      itemId: yup.number(),
      amount: yup
        .number()
        .min((item?.startingPrice || 0) + (item?.minIncreasePrice || 1), errorMessages.amount.isValid)
        .integer()
        .required(errorMessages.amount.required),
    }),
  })

  const handleCreateBid = async () => {
    const data = formik.values
    if (data.amount !== 0) {
      await bidApi.create(data, token)
      navigate(`/bid-detail?id=${data.itemId}&mode=viewamount`)
    }
  }
  return (
    <form noValidate onSubmit={formik.handleSubmit}>
      <div>
        {userId !== item?.sellerId && item?.bidStatus === 1 && roleUser === 0 && item?.buyerBid === null ? (
          <>
            <div className='place-bid-bdpage'>
              <NumberField label='Your bid' name='amount' {...formik} />
              <Button
                className={'place-bid-btn-bdpage mt-2'}
                variant='warning'
                type='submit'
                text='Place bid'
                onClick={handleCreateBid}
                disabled={!(formik.isValid && formik.dirty)}
              />
            </div>
          </>
        ) : null}
      </div>
    </form>
  )
}

export default PlaceAmount
