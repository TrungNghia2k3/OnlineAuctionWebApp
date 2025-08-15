import { useRef } from 'react'
import { Form } from 'react-bootstrap'
import { useNavigate, useSearchParams } from 'react-router-dom'
import Input from '../../../atoms/forms/input'
import Image from '../../../atoms/image'
import Button from '../../../molecules/buttons/button'
import './style.scss'

const SearchBoxHeader = () => {
  let [searchParams, setSearchParams] = useSearchParams()
  const keyWord = searchParams.get('keyword')

  const navigate = useNavigate()

  const inputRef = useRef()
  const handleSearch = (event) => {
    event.preventDefault()
    const keyWord = inputRef.current.value
    navigate(`/search-results?keyword=${keyWord}`)
  }

  return (
    <Form>
      <div className='header-sreachbox'>
        <Image path='/images/logo.jpg' className={{ 'header-logo': true }} handleClick={() => navigate('/')} />
        <Input type='text' innerRef={inputRef} className='searching-header-homepage' defaultValue={keyWord} />
        <Button
          type='submit'
          variant='success'
          className='searching-button-homepage'
          onClick={handleSearch}
          iconPath={'images/search.svg'}
        />
      </div>
    </Form>
  )
}

export default SearchBoxHeader
