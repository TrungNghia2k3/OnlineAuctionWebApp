import React, { useEffect } from 'react'
import LoadingSpinner from '../../atoms/LoadingSpinner'
import SequentialSection from '../../molecules/SequentialSection'
import { useSequentialLoading, LOADING_STATES } from '../../../hooks/useSequentialLoading'
import Header from '../../organisms/Header'
import Footer from '../../organisms/Footer'
import './PageLayout.scss'
import '../../molecules/SequentialSection/SequentialSection.scss'

/**
 * Page Layout Template
 * Manages sequential loading of Header -> Body -> Footer
 * Follows Atomic Design template pattern
 * 
 * @param {ReactNode} children - Content to render in the body section
 * @param {boolean} showHeader - Whether to show the header (default: true)
 * @param {boolean} showFooter - Whether to show the footer (default: true)
 * @param {string} loadingMessage - Message to display during loading
 * @param {string} className - Additional CSS classes for the layout
 * @param {boolean} noContainer - If true, children won't be wrapped in Bootstrap container (default: false)
 */
const PageLayout = ({ 
  children,
  showHeader = true,
  showFooter = true,
  loadingMessage = "Loading page...",
  className = '',
  noContainer = false
}) => {
  const {
    markSectionLoaded,
    canShowSection,
    isPageLoaded,
    resetLoading
  } = useSequentialLoading()

  // Reset loading when component mounts
  useEffect(() => {
    resetLoading()
  }, [resetLoading])

  const handleSectionLoaded = (section) => {
    markSectionLoaded(section)
  }

  const layoutClasses = `
    page-layout
    ${isPageLoaded ? 'fully-loaded' : 'loading'}
    ${className}
  `.trim()

  return (
    <div className={layoutClasses}>
      {/* Loading Spinner - shown until page is fully loaded */}
      <LoadingSpinner
        show={!isPageLoaded}
        fadeOut={isPageLoaded}
        message={loadingMessage}
        size="lg"
        variant="primary"
      />

      {/* Page Content - only visible when loading is complete */}
      <div className={`page-content ${isPageLoaded ? 'visible' : 'hidden'}`}>
        {/* Header Section */}
        {showHeader && (
          <SequentialSection
            section={LOADING_STATES.HEADER}
            canShow={canShowSection(LOADING_STATES.HEADER)}
            onLoaded={handleSectionLoaded}
            delay={100}
            className="header-section"
          >
            <Header />
          </SequentialSection>
        )}

        {/* Main Content Section */}
        <SequentialSection
          section={LOADING_STATES.BODY}
          canShow={canShowSection(LOADING_STATES.BODY)}
          onLoaded={handleSectionLoaded}
          delay={200}
          className="main-section"
        >
          <main className="main-content">
            {noContainer ? (
              children
            ) : (
              <div className="container">
                {children}
              </div>
            )}
          </main>
        </SequentialSection>

        {/* Footer Section */}
        {showFooter && (
          <SequentialSection
            section={LOADING_STATES.FOOTER}
            canShow={canShowSection(LOADING_STATES.FOOTER)}
            onLoaded={handleSectionLoaded}
            delay={100}
            className="footer-section"
          >
            <Footer />
          </SequentialSection>
        )}
      </div>
    </div>
  )
}

export default PageLayout
