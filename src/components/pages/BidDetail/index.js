import { useContext, useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import ItemApi from '../../../api/item'
import { AuthContext } from '../../../contexts/AuthContext'
import ProtectedRoute from '../../protected-route'
import Template from '../../templates/default/no-separation-template'
import BidDetailSeller from '../BidDetailSeller'
import PlaceAmount from '../PlaceAmount'
import RatingInformation from '../RatingInformation'
import ViewBidDetail from '../ViewBidDetail'

const BidDetail = () => {
  const [item, setItem] = useState(null)
  const [mode, setMode] = useState('view')
  const [idItem, setIdItem] = useState('')
  const [titleBidDetailPage, setTitleBidDetailPage] = useState('')
  const [toastImage, settoastImage] = useState('')
  let [searchParams, setSearchParams] = useSearchParams()
  const termIdItem = searchParams.get('id')
  const modeQueryParam = searchParams.get('mode')

  const { currentUser, listCategory } = useContext(AuthContext)
  let token = null
  let userId = null
  if (currentUser) {
    token = currentUser.token
    userId = currentUser.username // Use username instead of id for the new format
  }

  useEffect(() => {
    if (termIdItem == null) {
      setItem(termIdItem)
    }
    setIdItem(termIdItem)

    setMode(modeQueryParam)
    if (modeQueryParam === 'create') {
      setTitleBidDetailPage('Add new item')
      settoastImage('images/square-plus-solid.svg')
    } else if (modeQueryParam === 'edit') {
      setTitleBidDetailPage('Edit item')
      settoastImage('images/edit.svg')
    } else {
      setTitleBidDetailPage('View item')
      settoastImage('images/bag.svg')
    }

    if (token) {
      const getItem = async () => {
        if (idItem) {
          try {
            const response = await ItemApi.getById(idItem, token)
            console.log('BidDetail API response:', response)
            
            // Handle the new API response format
            if (response && response.code === 200 && response.result) {
              console.log('Setting item from result:', response.result)
              setItem(response.result)
            } else if (response && !response.code) {
              // Fallback for old format
              console.log('Setting item from direct response:', response)
              setItem(response)
            } else {
              console.error('Unexpected API response format:', response)
              setItem(null)
            }
          } catch (error) {
            console.error('Error fetching item:', error)
            setItem(null)
          }
        }
      }
      getItem()
    }
  }, [token, idItem, modeQueryParam, termIdItem])
  const content = (
    <>
      {mode === 'create' || mode === 'edit' ? (
        <BidDetailSeller titleBidDetailPage={titleBidDetailPage} listCategory={listCategory} item={item} />
      ) : (
        <>
          <div>
            <ViewBidDetail item={item} />
            <PlaceAmount item={item} />
            {item?.seller?.username === userId || item?.buyerBid?.isAchieved === true ? <RatingInformation item={item}></RatingInformation> : null}
          </div>
        </>
      )}
    </>
  )

  return (
    <>
      <ProtectedRoute />
      <Template headerIcon={toastImage} headerTitle={titleBidDetailPage} content={content} />
    </>
  )
}

export default BidDetail
