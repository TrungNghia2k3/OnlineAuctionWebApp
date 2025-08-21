import { Navigation } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import { sampleAuctionItems } from '@/data';
import { useCategoryNavigation, useNavigation } from '@/hooks';
import { AuctionCard, CategoryItem, SubCategoryCard } from '@/components/molecules';
import { Breadcrumb } from '@/components/atoms';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import './style.css';

/**
 * CategoryNavigation Organism Component
 * Smart component that manages category navigation with swiper
 */
const CategoryNavigation = ({ onCategoryChange }) => {
    const {
        activeCategory,
        allCategories,
        breadcrumb,
        setActiveCategory
    } = useCategoryNavigation();

    const { navigateToBidDetail } = useNavigation();

    const handleCategoryClick = (category) => {
        // Handle regular category selection
        setActiveCategory(category);

        // Notify parent component about category change
        if (onCategoryChange) {
            onCategoryChange(category);
        }
    };

    const handleAuctionClick = (item) => {
        // Navigate to bid detail page with item ID
        navigateToBidDetail(item.id);
    };

    return (
        <div className="category-navigation">
            {/* Category Navigation */}
            <div className="category-navigation__container">
                <Swiper
                    modules={[Navigation]}
                    spaceBetween={0}
                    slidesPerView="auto"
                    freeMode={true}
                    className="category-swiper"
                    navigation={{
                        nextEl: '.swiper-button-next-custom',
                        prevEl: '.swiper-button-prev-custom',
                    }}
                >
                    {allCategories.map((category) => (
                        <SwiperSlide key={category.id} className="category-slide">
                            <CategoryItem
                                category={category}
                                isActive={activeCategory?.id === category.id}
                                onClick={handleCategoryClick}
                            />
                        </SwiperSlide>
                    ))}
                </Swiper>
                
                {/* Custom Navigation Buttons */}
                <div className="swiper-button-prev-custom">
                    <i className="bi bi-chevron-left"></i>
                </div>
                <div className="swiper-button-next-custom">
                    <i className="bi bi-chevron-right"></i>
                </div>
            </div>

             {/* Breadcrumb */}
            <div className="category-navigation__breadcrumb">
                <Breadcrumb items={breadcrumb} />
            </div>

            {/* Category Content Section */}
            <div className="category-navigation__content">
                {activeCategory && (
                    <div className="category-content">
                        <h2 className="category-content__title">{activeCategory.name}</h2>

                        {/* Special categories with auction items */}
                        {(activeCategory.name === "This week" || activeCategory.name === "For you" || activeCategory.name === "Trending") && (
                            <div className="category-content__auction-items">
                                <div className="row">
                                    {sampleAuctionItems[activeCategory.name]?.map((item) => (
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
                        {activeCategory.sub && activeCategory.sub.length > 0 && activeCategory.name !== "This week" && activeCategory.name !== "For you" && activeCategory.name !== "Trending" && (
                            <div className="category-content__subcategories">
                                <div className="row g-2 g-lg-1">
                                    {activeCategory.sub.map((subCategory, index) => (
                                        <div key={index} className="col-xl-3 col-lg-3 col-md-6 col-sm-6 col-12 mb-4">
                                            <SubCategoryCard
                                                subCategory={subCategory}
                                                categoryColor={activeCategory.color}
                                                onClick={(subCategory) => console.log('Subcategory clicked:', subCategory)}
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default CategoryNavigation;
