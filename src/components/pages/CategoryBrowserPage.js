import React from 'react'
import {PageLayout} from '../templates'

/**
 * Category Browser Page Component
 * Now uses PageLayout template for sequential loading and consistent container alignment
 */
const CategoryBrowserPage = () => {
  return (
    <PageLayout loadingMessage="Loading Categories...">
      <div className="mt-4">
        <h1>Browse Categories</h1>
        <p className="lead">Explore different auction categories</p>
        
        {/* Example category grid */}
        <div className="row mt-4">
          <div className="col-md-3 mb-4">
            <div className="card h-100">
              <div className="card-body text-center">
                <h5 className="card-title">Electronics</h5>
                <p className="card-text">Gadgets, computers, and tech items</p>
                <button className="btn btn-primary">Browse</button>
              </div>
            </div>
          </div>
          <div className="col-md-3 mb-4">
            <div className="card h-100">
              <div className="card-body text-center">
                <h5 className="card-title">Collectibles</h5>
                <p className="card-text">Rare items and collectible treasures</p>
                <button className="btn btn-primary">Browse</button>
              </div>
            </div>
          </div>
          <div className="col-md-3 mb-4">
            <div className="card h-100">
              <div className="card-body text-center">
                <h5 className="card-title">Fashion</h5>
                <p className="card-text">Clothing, accessories, and jewelry</p>
                <button className="btn btn-primary">Browse</button>
              </div>
            </div>
          </div>
          <div className="col-md-3 mb-4">
            <div className="card h-100">
              <div className="card-body text-center">
                <h5 className="card-title">Home & Garden</h5>
                <p className="card-text">Furniture, decor, and garden items</p>
                <button className="btn btn-primary">Browse</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  )
}

export default CategoryBrowserPage
