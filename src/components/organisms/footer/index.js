import React from 'react'
import './style.scss'

/**
 * Footer Organism Component
 * Application footer with links and copyright information
 */
const Footer = () => {
  return (
    <footer className="app-footer">
      <div className="container py-4">
        <div className="row">
          <div className="col-md-4 mb-3">
            <h5 className="text-primary">🏆 Online Auction</h5>
            <p className="text-muted">
              Your trusted platform for online auctions. Find great deals and sell your items with confidence.
            </p>
          </div>
          
          <div className="col-md-2 mb-3">
            <h6>Quick Links</h6>
            <ul className="list-unstyled">
              <li><a href="/" className="text-muted text-decoration-none">Home</a></li>
              <li><a href="/categories" className="text-muted text-decoration-none">Categories</a></li>
              <li><a href="/auctions" className="text-muted text-decoration-none">Auctions</a></li>
            </ul>
          </div>
          
          <div className="col-md-2 mb-3">
            <h6>Account</h6>
            <ul className="list-unstyled">
              <li><a href="/login" className="text-muted text-decoration-none">Login</a></li>
              <li><a href="/register" className="text-muted text-decoration-none">Register</a></li>
              <li><a href="/profile" className="text-muted text-decoration-none">Profile</a></li>
            </ul>
          </div>
          
          <div className="col-md-4 mb-3">
            <h6>Contact Info</h6>
            <p className="text-muted mb-1">📧 support@onlineauction.com</p>
            <p className="text-muted mb-1">📞 +1 (555) 123-4567</p>
            <p className="text-muted">🏢 123 Auction Street, Commerce City</p>
          </div>
        </div>
        
        <hr className="border-secondary my-4" />
        
        <div className="row align-items-center">
          <div className="col-md-6">
            <p className="text-muted mb-0">
              &copy; 2025 Online Auction. All rights reserved.
            </p>
          </div>
          <div className="col-md-6 text-md-end">
            <a href="/privacy" className="text-muted text-decoration-none me-3">Privacy Policy</a>
            <a href="/terms" className="text-muted text-decoration-none">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer