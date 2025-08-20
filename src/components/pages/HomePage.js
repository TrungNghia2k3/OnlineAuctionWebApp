import React from 'react'
import {PageLayout} from '../templates'

/**
 * Home Page Component
 * Now uses PageLayout template for sequential loading
 */
const HomePage = () => {
  return (
    <PageLayout loadingMessage="Loading Home Page...">
      <div className="mt-4">
        <h1 className="text-danger">Welcome to Online Auction</h1>
        <p>Browse our latest auctions and find great deals!</p>
        
        {/* Example content sections that would load with the body */}
        <div className="row mt-4">
          <div className="col-md-4">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">Featured Auctions</h5>
                <p className="card-text">Check out our most popular items up for auction.</p>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">Categories</h5>
                <p className="card-text">Browse items by category to find what you're looking for.</p>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">How It Works</h5>
                <p className="card-text">Learn how to participate in our online auctions.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  )
}

export default HomePage
