import { CategoryItem } from '@/components/molecules';
import { useCategoryNavigation } from '@/hooks';
import { Navigation } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import { ForYou, RegularCategories, ThisWeek, Trending } from './components';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import './CategoryNavigation.scss';

/**
 * CategoryNavigation Organism Component
 * Smart component that manages category navigation with swiper
 */
const CategoryNavigation = ({ onCategoryChange }) => {
    const {
        activeCategory,
        handleCategorySelect,
        getBreadcrumb,
        getFilteredCategories
    } = useCategoryNavigation();

    // Get filtered categories
    const allCategories = getFilteredCategories() || [];
    const breadcrumb = getBreadcrumb() || [];

    const handleCategoryClick = (category) => {
        // Handle regular category selection
        handleCategorySelect(category);

        // Notify parent component about category change
        if (onCategoryChange) {
            onCategoryChange(category);
        }
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

            {/* Category Content Section */}
            <div className="category-navigation__content">
                {activeCategory && (
                    <div className="category-content">
                        {/* Special Categories: This week, For you, Trending */}
                        {(activeCategory.id === 'this-week' || activeCategory.name === 'This week') && <ThisWeek />}
                        {(activeCategory.id === 'for-you' || activeCategory.name === 'For you') && <ForYou />}
                        {(activeCategory.id === 'trending' || activeCategory.name === 'Trending') && <Trending />}

                        {/* Regular Categories: API categories with numeric IDs */}
                        {(typeof activeCategory.id === 'number' || 
                          (typeof activeCategory.id === 'string' && !['this-week', 'for-you', 'trending'].includes(activeCategory.id))) && (
                            <RegularCategories 
                                category={activeCategory} 
                                breadcrumb={breadcrumb}
                            />
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default CategoryNavigation;
