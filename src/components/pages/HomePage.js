import React from 'react'
import { PageLayout } from '../templates'
import CategoryNavigation from '../organisms/CategoryNavigation'
import ApiItemsList from '../organisms/ApiItemsList'

/**
 * Home Page Component
 * Now uses PageLayout template for sequential loading
 */
const HomePage = () => {
  const handleCategoryChange = (category) => {
    console.log('Selected category:', category);
    // Handle category change logic here
  };

  return (
    <PageLayout loadingMessage="Loading Home Page...">
      <div>
        {/* Category Navigation */}
        <CategoryNavigation onCategoryChange={handleCategoryChange} />

        {/* Main Content */}
        <div className="container mt-4">
          {/* API Items Section */}
          <ApiItemsList />
        </div>
      </div>
    </PageLayout>
  )
}

export default HomePage
