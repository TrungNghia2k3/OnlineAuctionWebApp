import { CategoriesContext } from '@/contexts'
import { useCategories } from '@/hooks'

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
