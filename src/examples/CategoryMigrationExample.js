/**
 * Example: How to update a component that currently uses static categories
 * 
 * BEFORE - Using static categories.js:
 */

// OLD WAY - DON'T USE THIS ANYMORE
/*
import React from 'react';
import categories from '@/data/categories';

const CategoryList = () => {
  return (
    <div className="category-list">
      {categories.map(category => (
        <div key={category.id} className="category-item" style={{ color: category.color }}>
          <i className={category.icon}></i>
          <span>{category.name}</span>
          {category.sub && category.sub.length > 0 && (
            <div className="subcategories">
              {category.sub.map(sub => (
                <div key={sub.name} className="subcategory">
                  <img src={`/images/${sub.image}`} alt={sub.name} />
                  <span>{sub.name}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};
*/

/**
 * AFTER - Using dynamic categories with API:
 */

import React from 'react';
import { useCategories } from '@/hooks/useCategories';

const CategoryList = () => {
  const { categories, isLoading, error, getSpecialCategories, getApiCategories } = useCategories(true); // true = active only

  if (isLoading) {
    return <div className="loading">Loading categories...</div>;
  }

  if (error) {
    return <div className="error">Error loading categories: {error}</div>;
  }

  // Optional: Separate special categories from API categories
  const specialCategories = getSpecialCategories();
  const apiCategories = getApiCategories();

  return (
    <div className="category-list">
      {/* Special categories (This week, For you, Trending) */}
      {specialCategories.map(category => (
        <div key={category.id} className="category-item special-category" style={{ color: category.color }}>
          <i className={category.icon}></i>
          <span>{category.name}</span>
        </div>
      ))}
      
      {/* API categories with subcategories */}
      {apiCategories.map(category => (
        <div key={category.id} className="category-item api-category" style={{ color: category.color }}>
          <i className={category.icon}></i>
          <span>{category.name}</span>
          
          {/* Display category image if available */}
          {category.image && (
            <img src={category.image} alt={category.name} className="category-image" />
          )}
          
          {/* Subcategories */}
          {category.sub && category.sub.length > 0 && (
            <div className="subcategories">
              {category.sub.map(sub => (
                <div key={sub.id || sub.name} className="subcategory">
                  <img src={sub.image} alt={sub.name} />
                  <span>{sub.name}</span>
                  {sub.description && <p className="subcategory-description">{sub.description}</p>}
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default CategoryList;

/**
 * Alternative: If you want to keep the exact same structure as before,
 * you can use this simpler approach:
 */

const SimpleCategoryList = () => {
  const { categories, isLoading, error } = useCategories();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="category-list">
      {categories.map(category => (
        <div key={category.id} className="category-item" style={{ color: category.color }}>
          <i className={category.icon}></i>
          <span>{category.name}</span>
          {category.sub && category.sub.length > 0 && (
            <div className="subcategories">
              {category.sub.map(sub => (
                <div key={sub.id || sub.name} className="subcategory">
                  <img src={sub.image} alt={sub.name} />
                  <span>{sub.name}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

// If you need to fetch categories outside of React components:
import categoryService from '@/services/categoryService';

const fetchCategoriesData = async () => {
  try {
    const categories = await categoryService.getAllCategories();
    console.log('All categories:', categories);
    
    const activeCategories = await categoryService.getAllActiveCategories();
    console.log('Active categories:', activeCategories);
    
    const specificCategory = await categoryService.getCategoryById(1);
    console.log('Category with ID 1:', specificCategory);
  } catch (error) {
    console.error('Error fetching categories:', error);
  }
};
