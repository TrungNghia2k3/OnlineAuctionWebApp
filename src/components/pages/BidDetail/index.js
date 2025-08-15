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
    userId = currentUser.id
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
          const item = await ItemApi.getById(idItem, token)
          setItem(item)
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
            {item?.userId === userId || item?.buyerBid?.isAchieved === true ? <RatingInformation item={item}></RatingInformation> : null}
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
