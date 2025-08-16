import { useFormik } from 'formik'
import { useContext, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import * as yup from 'yup'
import ItemApi from '../../../api/item'
import { errorMessages } from '../../../common'
import { AuthContext } from '../../../contexts/AuthContext'
import Alert from '../../atoms/Alert'
import Input from '../../atoms/Input'
import Label from '../../atoms/Label'
import Image from '../../atoms/Image'
import InformationModal from '../../atoms/modals/Information'
import Button from '../../molecules/Button'
import AutoSuggest from '../../molecules/AutoSuggest'
import DatePicker from '../../molecules/DatePicker'
import NumberField from '../../molecules/NumberField'
import TextField from '../../molecules/TextField'
import './style.scss'

const BidDetailSeller = ({ item, listCategory, titleBidDetailPage }) => {
  const { currentUser } = useContext(AuthContext)
  let token = null
  let userId = null
  if (currentUser) {
    token = currentUser.token
    userId = currentUser.id
  }
  const navigate = useNavigate()
  const backToHomePage = () => {
    navigate('/')
  }
  const validatelistCategory = {
    name: 'listCategory',
    skipAbsent: true,
    test(value, ctx) {
      if (Array.isArray(value) && value.length > 0) {
        const inputData = value[0].name
        if (!inputData) {
          return ctx.createError({ message: 'Please select a category' })
        } else if (!listCategory.some((category) => category.name === inputData)) {
          return ctx.createError({ message: 'Category is invalid' })
        } else {
          return true
        }
      }
      return ctx.createError({ message: 'Please select a category' })
    },
  }
  const setItemValues = (items) => {
    let itemValues = {}
    if (items != null && userId === items.sellerId) {
      let selectedCategory = listCategory?.find((b) => b?.id === item?.categoryId)

      if (!selectedCategory) {
        selectedCategory = { id: item?.categoryId, name: item?.categoryName }
        listCategory.push(selectedCategory)
      }

      itemValues = {
        id: item?.id,
        name: item?.name,
        description: item?.description,
        imageName: item?.imageName,
        imageFile: item?.imageFile,
        documentName: item?.documentName,
        documentFile: item?.documentFile,
        minIncreasePrice: item?.minIncreasePrice,
        currentBidPrice: item?.currentBidPrice,
        auctionStartDate: new Date(item?.auctionStartDate),
        auctionEndDate: new Date(item?.auctionEndDate),
        sellerId: item?.sellerId,
        categoryId: item?.categoryId,
        listCategory: [selectedCategory],
        bidStatus: item?.bidStatus,
      }
      formik.setValues(itemValues)
    }
  }

  useEffect(() => {
    setItemValues(item)
    if (titleBidDetailPage === 'Add new item') {
      formik.resetForm()
    }
  }, [item, titleBidDetailPage])

  let date = new Date()
  date.setDate(date.getDate() + 1)
  const formik = useFormik({
    initialValues: {
      id: 0,
      name: '',
      description: '',
      imageName: '',
      imageFile: null,
      documentName: '',
      documentFile: '',
      minIncreasePrice: '',
      currentBidPrice: '',
      auctionStartDate: date,
      auctionEndDate: date,
      sellerId: userId,
      listCategory: [],
      categoryId: 0,
      bidStatus: 0,
    },
    validationSchema: yup.object().shape({
      id: yup.number(),
      name: yup.string().required(errorMessages.name.required),
      description: yup.string().required(errorMessages.description.required),
      imageFile: yup.mixed().required(errorMessages.imageFile.required),
      documentFile: yup.mixed(),
      minIncreasePrice: yup
        .number()
        .required(errorMessages.minIncreasePrice.required)
        .integer(errorMessages.minIncreasePrice.isValid),
      currentBidPrice: yup
        .number()
        .required(errorMessages.currentBidPrice.required)
        .integer(errorMessages.currentBidPrice.required),
      auctionStartDate: yup
        .date()
        .required(errorMessages.auctionStartDate.required)
        .min(new Date(), errorMessages.auctionStartDate.required),
      auctionEndDate: yup
        .date()
        .required(errorMessages.auctionEndDate.required)
        .min(yup.ref('auctionStartDate'), errorMessages.auctionEndDate.required),
      sellerId: yup.number(),
      listCategory: yup.array().test(validatelistCategory),
      categoryId: yup.number(),
      bidStatus: yup.number(),
    }),
  })

  function fileChangedHandler(event) {
    if (event.target.value) {
      const file = event.target.files[0]
      const reader = new FileReader()
      reader.onloadend = () => {
        const base64String = reader.result.replace('data:', '').replace(/^.+,/, '')
        if (event.target.name === 'imageFile') {
          formik.setFieldValue('imageName', file.name)
          formik.setFieldValue('imageFile', base64String)
        } else if (event.target.name === 'documentFile') {
          formik.setFieldValue('documentName', file.name)
          formik.setFieldValue('documentFile', base64String)
        }
      }
      reader.readAsDataURL(file)
    }
  }

  const handleCreateItem = async (event) => {
    event.preventDefault()
    const data = formik.values
    data.categoryId = data.listCategory[0].id
    if (data.id) {
      const updateItem = await ItemApi.update(data, token)
      if (updateItem) {
        navigate(`/bid-detail?id=${data.id}&mode=view`)
      }
    } else {
      const createItem = await ItemApi.create(data, token)
      if (createItem) {
        navigate(`/bid-detail?id=${createItem.id}&mode=view`)
      }
    }
  }
  const filterActiveItems = (items) => {
    return items.filter((item) => item.isActive === true)
  }

  const handleRefresh = (items, title) => {
    if (title === 'Add item') {
      formik.resetForm()
      return
    }
    if (items) {
      setItemValues(item)
    }
  }

  return (
    <>
      {currentUser?.role === 1 ? (
        <div>
          <div className='container fs-6'>
            <form noValidate onSubmit={formik.handleSubmit}>
              <Alert
                variant='info'
                message={
                  <>
                    {titleBidDetailPage === 'Add new item' && (
                      <li>
                        This page allows you to create new auctions based on your trading needs or for any item you
                        believe can be sold, provided it is legal.
                      </li>
                    )}
                    <li>
                      You must fill in all required fields (marked with<span style={{ color: 'red' }}>*</span>) below to{' '}
                      {titleBidDetailPage.toLowerCase()}.
                    </li>
                  </>
                }
              />
              <TextField label='Item name' name='name' isRequired={true} {...formik} />
              <TextField label='Item description' name='description' isRequired={true} {...formik} />
              <AutoSuggest
                label='Select category'
                id='categoryId'
                labelKey='name'
                items={filterActiveItems(listCategory)}
                name='listCategory'
                isRequired={true}
                {...formik}
              />
              <NumberField label='Min increase price' name='minIncreasePrice' isRequired={true} {...formik} />
              <NumberField label='Starting price' name='currentBidPrice' isRequired={true} {...formik} />
              <DatePicker
                label='Start date'
                name='auctionStartDate'
                isRequired={true}
                className={{ 'form-control': true }}
                {...formik}
              />
              <DatePicker
                label='End date'
                name='auctionEndDate'
                isRequired={true}
                className={{ 'form-control': true }}
                {...formik}
              />
              <Label text='Item image' isRequired={true} />
              <Input
                name='imageFile'
                id='uploadImage'
                type='file'
                hidden
                onChange={fileChangedHandler}
                isValid={formik.touched.imageFile && !formik.errors.imageFile}
                isInvalid={formik.errors.imageFile}
              />
              <div className='box-file-upload'>
                <Image path={'images/file-regular.svg'} className={{ 'icon-file-upload': true }} />
                <Label
                  htmlFor='uploadImage'
                  text={formik.values.imageName ? formik.values.imageName : 'Click here to upload an image'}
                />
              </div>
              <div className='invalid-feedback d-block'>{formik.errors.imageFile}</div>

              <Label text='Document file' />
              <Input name='documentFile' id='uploadDocument' type='file' hidden onChange={fileChangedHandler} />
              <div className='box-file-upload'>
                <Image path={'images/file-regular.svg'} className={{ 'icon-file-upload': true }} />
                <Label
                  htmlFor='uploadDocument'
                  text={formik.values.documentName ? formik.values.documentName : 'Click here to upload a document'}
                />
              </div>
              <div className='text-end mt-3'>
                <Button
                  className='button-refresh-item-detail'
                  text='Refresh'
                  iconPath='images/refresh.svg'
                  onClick={() => handleRefresh(item, titleBidDetailPage)}
                />
                <Button
                  variant='success'
                  type='submit'
                  disabled={!(formik.isValid && formik.dirty)}
                  text='Save information'
                  iconPath='images/save.svg'
                  onClick={handleCreateItem}
                />
              </div>
            </form>
          </div>
        </div>
      ) : (
        <InformationModal
          body='You need to have a seller account to access this site'
          onHide={() => backToHomePage()}
          show={true}
        />
      )}
    </>
  )
}

export default BidDetailSeller
