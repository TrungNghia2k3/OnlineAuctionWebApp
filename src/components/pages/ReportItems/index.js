import { useFormik } from 'formik'
import { useContext, useState } from 'react'
import * as yup from 'yup'
import ItemApi from '../../../api/item'
import { errorMessages } from '../../../common'
import { AuthContext } from '../../../contexts/AuthContext'
import Label from '../../atoms/Label'
import Button from '../../molecules/Button'
import DatePicker from '../../molecules/DatePicker'
import RadioBoxList from '../../molecules/RadioBoxList'
import ProtectedRoute from '../../protected-route'
import Template from '../../templates/default/horizontal-separation-template'
import './style.scss'

const ReportItems = () => {
  const [listItems, setListItems] = useState([])

  const { currentUser } = useContext(AuthContext)
  let token = null
  if (currentUser) {
    token = currentUser.token
  }

  const options = [
    { label: 'Happening', value: 1 },
    { label: 'Ended', value: 2 },
  ]

  const formik = useFormik({
    initialValues: {
      startDate: new Date(),
      endDate: new Date(),
      bidStatus: 1,
    },
    validationSchema: yup.object().shape({
      startDate: yup.date().required(errorMessages.auctionStartDate.required),
      endDate: yup
        .date()
        .required(errorMessages.auctionEndDate.required)
        .min(yup.ref('startDate'), errorMessages.auctionEndDate.isValid),
      bidStatus: yup.number(),
    }),
  })

  const handleGetStatistics = async () => {
    const data = formik.values
    const result = await ItemApi.getStatisticsItem(data, token)
    setListItems(result)
  }

  const displayFormatDate = (value) => {
    const apiDate = new Date(value)
    const year = apiDate.getFullYear()
    const month = (apiDate.getMonth() + 1).toString().padStart(2, '0')
    const day = apiDate.getDate().toString().padStart(2, '0')

    return `${year}/${month}/${day}`
  }

  const displayFormatCurrentBidPrice = (value) => {
    const numberFormat = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    })
    return numberFormat.format(value)
  }

  const top = (
    <>
      <div className='row input-item-export'>
        <div className='col-3'>
          <DatePicker label='Start date' name='startDate' className={{ 'form-control': true }} {...formik} />
        </div>
        <div className='col-3'>
          <DatePicker label='End date' name='endDate' className={{ 'form-control': true }} {...formik} />
        </div>
        <div className='col-2 bid-status-export'>
          <Label text='Select a status' />
          <RadioBoxList options={options} className='bid-status-value-export' name='bidStatus' {...formik} />
        </div>
        <div className='col-3 button-bid-status-export'>
          <Button
            className='button-export'
            type='submit'
            variant='info'
            disabled={!(formik.isValid && formik.dirty)}
            text='Export'
            iconPath='images/export.svg'
            onClick={handleGetStatistics}
          />
        </div>
      </div>
    </>
  )
  const bottom = (
    <>
      <table className='table table-striped table-item'>
        <thead>
          <tr>
            <th>#Id</th>
            <th>Item Name</th>
            <th className='label-export'>Min Increase Price</th>
            <th className='label-export'>Current Bid Price</th>
            <th className='label-export'>Auction Start Date</th>
            <th className='label-export'>Auction End Date</th>
            {formik.values.bidStatus === 2 ? <th className='label-export'>Buyer Name</th> : null}
          </tr>
        </thead>
        <tbody>
          {listItems.map((item) => (
            <tr key={item.id}>
              <td>{item.id}</td>
              <td>{item.name}</td>
              <td className='value-export'>{displayFormatCurrentBidPrice(item.minIncreasePrice)}</td>
              <td className='value-export'>{displayFormatCurrentBidPrice(item.currentBidPrice)}</td>
              <td className='value-export'>{displayFormatDate(item.auctionStartDate)}</td>
              <td className='value-export'>{displayFormatDate(item.auctionEndDate)}</td>
              <td className='value-export'>{item.buyerName}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  )
  return (
    <>
      <ProtectedRoute />
      <form onSubmit={formik.handleSubmit}>
        <Template headerIcon='images/export.svg' headerTitle='Report Items' top={top} bottom={bottom} />
      </form>
    </>
  )
}

export default ReportItems
