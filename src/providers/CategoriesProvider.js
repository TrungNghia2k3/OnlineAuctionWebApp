import { CategoriesContext } from '../contexts/CategoriesContext'
import { useCategories } from '../hooks/useCategories'

/**
 * Categories Provider Component
 * Follows DIP by depending on abstractions (hooks) rather than concrete implementations
 */
export const CategoriesProvider = ({ children }) => {
  const categoriesValue = useCategories()

  return (
    <CategoriesContext.Provider value={categoriesValue}>
      {children}
    </CategoriesContext.Provider>
  )
}
