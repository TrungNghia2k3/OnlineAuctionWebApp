import CategoryNavigation from '../../organisms/CategoryNavigation';
import { PageLayout } from '../../templates';

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
    <PageLayout loadingMessage="Loading Home Page..." noContainer={true}>
      <div>
        {/* Category Navigation */}
        <div className="container">
          <CategoryNavigation onCategoryChange={handleCategoryChange} />
        </div>
      </div>
    </PageLayout>
  )
}

export default HomePage
