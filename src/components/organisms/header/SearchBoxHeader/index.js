import { useRef } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import Input from '../../../atoms/Input'
import Image from '../../../atoms/Image'
import Button from '../../../molecules/Button'
import './style.scss'

const SearchBoxHeader = () => {
  let [searchParams] = useSearchParams()
  const keyWord = searchParams.get('keyword')

  const navigate = useNavigate()

  const inputRef = useRef()
  const handleSearch = (event) => {
    event.preventDefault()
    const keyWord = inputRef.current.value
    navigate(`/search-results?keyword=${keyWord}`)
  }

  return (
    <form onSubmit={handleSearch}>
      <div className='header-sreachbox'>
        <Image path='/images/logo.jpg' className="header-logo" handleClick={() => navigate('/')} />
        <Input type='text' innerRef={inputRef} className='searching-header-homepage' defaultValue={keyWord} />
        <Button
          type='submit'
          variant='success'
          className='searching-button-homepage'
          onClick={handleSearch}
          iconPath={'images/search.svg'}
        />
      </div>
    </form>
  )
}

export default SearchBoxHeader
