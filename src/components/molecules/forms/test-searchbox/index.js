import './style.scss'
import AutoSuggestAtom from '../../../atoms/forms/auto-suggest'
import { React, useState } from 'react'

const SearchBox = ({ data }) => {
  const [selected, setSelected] = useState([])

  return (
    <div>
      <AutoSuggestAtom
        id='search-box'
        labelKey='name'
        options={data}
        placeholder='Search for a product...'
        onChange={setSelected}
        selected={selected}
      />
      {selected.map((item) => (
        <div key={item.id}>
          <img src={`data:image;base64,${item.imageFile}`} alt={item.name} />
          <span>{item.name}</span>
        </div>
      ))}
    </div>
  )
}

export default SearchBox
