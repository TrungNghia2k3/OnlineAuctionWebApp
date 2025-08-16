import { useContext, useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import CategoryApi from '../../../api/categories'
import { AuthContext } from '../../../contexts/AuthContext'
import Select from '../../atoms/Select'
import Pagination from '../../atoms/Pagination'
import ProtectedRoute from '../../protected-route'
import Template from '../../templates/default/no-separation-template'
import ViewItemDetailLabel from '../ViewItemDetailLabel'
import './style.scss'

const CategoryBrowser = () => {
  const [category, setCategory] = useState(null)
  const [activeNumber, setActiveNumber] = useState(1)
  const [filteredItems, setFilteredItems] = useState(category?.itemResponses)
  let [searchParams] = useSearchParams()
  const termIdCategory = searchParams.get('id')

  const { currentUser } = useContext(AuthContext)
  let token = null
  if (currentUser) {
    token = currentUser.token
  }
  useEffect(() => {
    if (token) {
      const getListItem = async () => {
        const result = await CategoryApi.getAllItemByCategoryId(termIdCategory, token, activeNumber)
        setCategory(result)
        setFilteredItems(result.itemResponses.sort((a, b) => a.bidStatus - b.bidStatus))
      }
      getListItem()
    }
  }, [token, termIdCategory, activeNumber])

  const options = [
    { value: 'date', label: 'Auction Date' },
    { value: 'price', label: 'Auction Price' },
  ]

  const handleSelectedSortBy = (event) => {
    const sortBy = event.target.value
    if (sortBy === 'price') {
      const sortedItems = [...category.itemResponses].sort((a, b) => {
        if (a.bidStatus !== b.bidStatus) {
          return a.bidStatus - b.bidStatus
        }
        if ((a.bidStatus && b.bidStatus) !== 0) {
          return b.currentBidPrice - a.currentBidPrice
        } else {
          return b.minIncreasePrice - a.minIncreasePrice
        }
      })
      setFilteredItems(sortedItems)
    }
    if (sortBy === 'date') {
      const sortedItems = [...category.itemResponses].sort((a, b) => {
        if (a.bidStatus !== b.bidStatus) {
          return a.bidStatus - b.bidStatus
        }
        if ((a.bidStatus && b.bidStatus) === 0) {
          return new Date(a.auctionStartDate) - new Date(b.auctionStartDate)
        } else {
          return new Date(a.auctionEndDate) - new Date(b.auctionEndDate)
        }
      })
      setFilteredItems(sortedItems)
    }
  }
  const handleClick = (number) => {
    setActiveNumber(number)
  }

  const content = (
    <>
      <div className="container-fluid">
        <div className="row">
          <div className='sort-by-category-page'>
            <h5 className='mt-1'>Sort by</h5>
            <div className='selected-category'>
              <Select options={options} onChange={handleSelectedSortBy} />
            </div>
          </div>
        </div>
        <div className='view-item-detail'>
          <ViewItemDetailLabel items={filteredItems}></ViewItemDetailLabel>
        </div>
      </div>
      <div className='pagination-category-browser'>
        <Pagination
          firstNumbers={[1, 2, 3]}
          betweenNumbers={[4]}
          lastNumbers={[5]}
          activeNumber={activeNumber}
          handleClick={handleClick}
          disabledNumbers={[]}
        />
      </div>
    </>
  )

  return (
    <>
      <ProtectedRoute />
      <Template headerIcon='images/category-browser.png' headerTitle={category?.name} content={content} />
    </>
  )
}

export default CategoryBrowser
