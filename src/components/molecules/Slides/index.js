import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import './Slides.scss';

/**
 * Generic Slides Component
 * Reusable slideshow component that can display any type of cards
 * Configurable number of cards per slide with navigation controls
 * 
 * @param {Array} items - Array of items to display
 * @param {React.ComponentType} CardComponent - The card component to render for each item
 * @param {Object} cardProps - Additional props to pass to each card
 * @param {string} className - Additional CSS classes
 * @param {string} title - Optional title for the slides section
 * @param {number} slidesPerView - Number of slides to show per view (3 or 4, defaults to 3)
 */
const Slides = ({ 
  items = [], 
  CardComponent, 
  cardProps = {}, 
  className = '', 
  title = '',
  slidesPerView = 3
}) => {
  // State to track slide position
  const [isBeginning, setIsBeginning] = React.useState(true);
  const [isEnd, setIsEnd] = React.useState(false);
  const [swiperInstance, setSwiperInstance] = React.useState(null);

  // Handle slide change events
  const handleSlideChange = (swiper) => {
    setIsBeginning(swiper.isBeginning);
    setIsEnd(swiper.isEnd);
  };

  // Handle navigation clicks
  const handlePrevClick = () => {
    if (swiperInstance) {
      swiperInstance.slidePrev();
    }
  };

  const handleNextClick = () => {
    if (swiperInstance) {
      swiperInstance.slideNext();
    }
  };

  if (!items.length || !CardComponent) {
    return null;
  }

  return (
    <div className={`slides ${className}`}>
      {title && (
        <div className="slides__header">
          <h3 className="slides__title">{title}</h3>
        </div>
      )}
      
      <div className={`slides__container slides-per-view-${slidesPerView}`}>
        <Swiper
          modules={[]}
          spaceBetween={20}
          slidesPerView={slidesPerView}
          slidesPerGroup={slidesPerView}
          onSlideChange={handleSlideChange}
          onSwiper={(swiper) => {
            setSwiperInstance(swiper);
            handleSlideChange(swiper);
          }}
          breakpoints={{
            320: {
              slidesPerView: 1,
              slidesPerGroup: 1,
              spaceBetween: 10,
            },
            768: {
              slidesPerView: Math.min(2, slidesPerView),
              slidesPerGroup: Math.min(2, slidesPerView),
              spaceBetween: 15,
            },
            1024: {
              slidesPerView: slidesPerView,
              slidesPerGroup: slidesPerView,
              spaceBetween: 20,
            },
          }}
          className="slides__swiper"
        >
          {items.map((item, index) => (
            <SwiperSlide key={item.id || index} className="slides__slide">
              <CardComponent 
                {...cardProps}
                item={item}
                index={index}
              />
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Navigation Buttons */}
        {!isBeginning && (
          <div className="slides__nav-prev" onClick={handlePrevClick}>
            <i className="bi bi-chevron-left"></i>
          </div>
        )}
        {!isEnd && (
          <div className="slides__nav-next" onClick={handleNextClick}>
            <i className="bi bi-chevron-right"></i>
          </div>
        )}
      </div>
    </div>
  );
};

export default Slides;
