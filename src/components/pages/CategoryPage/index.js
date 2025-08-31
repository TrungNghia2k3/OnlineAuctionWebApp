import { Breadcrumb } from '@/components/atoms';
import { AuctionCard, SubCategoryCard } from '@/components/molecules';
import { CategoryNavigation } from '@/components/organisms';
import { PageLayout } from '@/components/templates';
import { categories, items } from '@/data';
import { useNavigation } from '@/hooks';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './CategoryPage.scss';

/**
 * CategoryPage Component
 * Displays items and subcategories for a specific category
 */
const CategoryPage = () => {
    const { categoryId } = useParams();
    const [category, setCategory] = useState(null);
    const { navigateToBidDetail } = useNavigation();

    useEffect(() => {
        // Find the category by ID
        const foundCategory = categories.find(cat => cat.id === parseInt(categoryId));
        setCategory(foundCategory);
    }, [categoryId]);

    const handleAuctionClick = (item) => {
        // Navigate to bid detail page with item ID
        navigateToBidDetail(item.id);
    };

    const handleSubCategoryClick = (subCategory) => {
        console.log('Subcategory clicked:', subCategory);
        // Future: Navigate to subcategory page or filter by subcategory
    };

    const handleCategoryChange = (category) => {
        console.log('Selected category:', category);
        // Handle category change logic here
    };

    // Generate breadcrumb for the category
    const getBreadcrumb = () => {
        if (!category) return [];

        return [
            { name: 'Home', path: '/' },
            { name: 'Categories', path: '/category-browser' },
            { name: category.name, path: `/category/${category.id}` }
        ];
    };

    if (!category) {
        return (
            <PageLayout loadingMessage="Loading category...">


                <div className="category-page">
                    <div className="container">
                        <div className="category-page__loading">
                            <p>Loading category...</p>
                        </div>
                    </div>
                </div>
            </PageLayout>
        );
    }

    return (
        <PageLayout loadingMessage={`Loading ${category.name} category...`}>

            {/* Category Navigation */}
            <CategoryNavigation onCategoryChange={handleCategoryChange} />


            <div className="category-page">
                <div className="container">
                    {/* Breadcrumb */}
                    <div className="category-page__breadcrumb">
                        <Breadcrumb items={getBreadcrumb()} />
                    </div>

                    {/* Category Content Section */}
                    <div className="category-page__content">
                        <div className="category-content">
                            <h1 className="category-content__title">{category.name}</h1>

                            {/* Special categories with auction items */}
                            {(category.name === "This week" || category.name === "For you" || category.name === "Trending") && (
                                <div className="category-content__auction-items">
                                    <div className="row">
                                        {items[category.name]?.map((item) => (
                                            <div key={item.id} className="col-lg-3 col-md-6 col-sm-6 mb-4">
                                                <AuctionCard
                                                    item={item}
                                                    onClick={handleAuctionClick}
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Regular categories with subcategories */}
                            {category.sub && category.sub.length > 0 && category.name !== "This week" && category.name !== "For you" && category.name !== "Trending" && (
                                <div className="category-content__subcategories">
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
                            )}

                            {/* Empty state for categories without content */}
                            {!items[category.name] && (!category.sub || category.sub.length === 0) && (
                                <div className="category-content__empty">
                                    <p>No items available in this category yet.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </PageLayout>
    );
};

export default CategoryPage;
