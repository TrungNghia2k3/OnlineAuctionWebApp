import React from 'react'
import './style.scss'
import classnames from 'classnames'
import { Typeahead } from 'react-bootstrap-typeahead'

function AutoSuggest(props) {
  return <Typeahead {...props} className={classnames(props.className)} />
}

export default AutoSuggest
