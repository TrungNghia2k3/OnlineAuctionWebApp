import React from 'react';
import { SubCategoryCard } from '@/components/molecules';
import { Breadcrumb } from '@/components/atoms';
import './RegularCategories.scss';

/**
 * RegularCategories Component
 * Displays regular category content with subcategories and breadcrumb
 */
const RegularCategories = ({ category, breadcrumb }) => {
    const handleSubCategoryClick = (subCategory) => {
        console.log('Subcategory clicked:', subCategory);
        // TODO: Implement subcategory navigation logic
    };

    if (!category) {
        return null;
    }

    return (
        <div className="regular-categories">
            {/* Breadcrumb for regular categories */}
            <div className="regular-categories__breadcrumb">
                <Breadcrumb items={breadcrumb} />
            </div>

            <div className="regular-categories__content">
                <h2 className="regular-categories__title">{category.name}</h2>
                
                {category.sub && category.sub.length > 0 ? (
                    <div className="regular-categories__subcategories">
                        <div className="row g-2 g-lg-1">
                            {category.sub.map((subCategory, index) => (
                                <div key={index} className="col-xl-3 col-lg-3 col-md-6 col-sm-6 col-12 mb-4">
                                    <SubCategoryCard
                                        subCategory={subCategory}
                                        categoryColor={category.color}
                                        onClick={handleSubCategoryClick}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className="regular-categories__empty">
                        <p>No subcategories available for this category.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default RegularCategories;
