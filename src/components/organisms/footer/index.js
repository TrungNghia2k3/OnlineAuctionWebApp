import React from 'react'
import { Container } from 'react-bootstrap'
import './style.scss'

const Footer = () => {
  return (
    <footer>
      <Container className='footer-container p-0' fluid>
        <p className='mb-0 bg-dark text-white text-center border border-1'>
          Copyright &copy; 2024 AUCTION TEAM, Inc. Contact: 0905060606
        </p>
      </Container>
    </footer>
  )
}
export default Footer
