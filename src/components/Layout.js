import React, { Component } from 'react'
import './_settings/_base.scss'
import './Layout.scss'
import { Container } from 'reactstrap'

export class Layout extends Component {
  static displayName = Layout.name

  render() {
    return (
      <div>
        <Container tag='main' className='main'>
          {this.props.children}
        </Container>
      </div>
    )
  }
}
