import { useEffect, useState } from 'react';
import collections from '../../../data/collections';
import { AuctionCard } from '../../molecules';
import './Hero.scss';

/**
 * Hero Organism Component
 * Slideshow with collection information, image, and featured items
 */
const Hero = () => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [progressWidth, setProgressWidth] = useState(0);

    // Use the actual collections data
    const extendedCollections = collections;

    const totalSlides = extendedCollections.length;
    const slideDuration = 5000; // 5 seconds per slide

    // Get current collection
    const currentCollection = extendedCollections[currentSlide];

    // Get items for current collection (mock data for now)
    const getCurrentCollectionItems = () => {
        // Get items from "This week" category as example items
        const weekItems = currentCollection.items || [];
        return weekItems.slice(0, 4);
    };

    // Auto-advance slides
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % totalSlides);
            setProgressWidth(0); // Reset progress
        }, slideDuration);

        return () => clearInterval(interval);
    }, [totalSlides, slideDuration]);

    // Progress bar animation
    useEffect(() => {
        setProgressWidth(0);
        const progressInterval = setInterval(() => {
            setProgressWidth((prev) => {
                if (prev >= 100) {
                    return 100;
                }
                return prev + (100 / (slideDuration / 50)); // Update every 50ms
            });
        }, 50);

        const timeout = setTimeout(() => {
            clearInterval(progressInterval);
        }, slideDuration);

        return () => {
            clearInterval(progressInterval);
            clearTimeout(timeout);
        };
    }, [currentSlide, slideDuration]);

    // Manual slide navigation
    const goToSlide = (index) => {
        if (index !== currentSlide) {
            setCurrentSlide(index);
            setProgressWidth(0);
        }
    };

    return (
        <div className="hero">
            {/* Main Content Row */}
            <div className="row mb-5">
                {/* Left Column - Collection Info and Pagination */}
                <div className="col-lg-6 col-md-6 mb-4 mb-md-0">
                    <div
                        key={`content-${currentSlide}`}
                        className="hero__content"
                    >
                        <h1 className="hero__title">
                            {currentCollection.name} <span>Collection</span>
                        </h1>

                        <p className="hero__description">
                            {currentCollection.description}
                        </p>

                        {/* Pagination Bar */}
                        <div className="hero__pagination">
                            <div className="pagination-bars">
                                {extendedCollections.map((_, index) => (
                                    <div
                                        key={index}
                                        className={`pagination-bar ${index === currentSlide ? 'active' : ''}`}
                                        style={{ '--bar-index': index }}
                                        onClick={() => goToSlide(index)}
                                    >
                                        {index === currentSlide && (
                                            <div
                                                className="pagination-progress"
                                                style={{ width: `${progressWidth}%` }}
                                            />
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                </div>

                {/* Right Column - Collection Image */}
                <div className="col-lg-6 col-md-6">
                    <div
                        key={`image-${currentSlide}`}
                        className="hero__image-container"
                    >
                        <div className="hero__image">
                            <img
                                src={"images/" + currentCollection.image}
                                alt={currentCollection.name}
                                onError={(e) => {
                                    e.target.style.display = 'none';
                                    e.target.nextSibling.style.display = 'flex';
                                }}
                            />
                            <div className="hero__image-placeholder" style={{ display: 'none' }}>
                                <i className="bi bi-image"></i>
                                <span>Collection Image</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Featured Items Row */}
            <div className="hero__featured-items">
                <div className="row">
                    {getCurrentCollectionItems().map((item, index) => (
                        <div key={item.id || index} className="col-lg-3 col-md-6 col-sm-6 mb-4">
                            <AuctionCard
                                item={item}
                                onClick={(clickedItem) => {
                                    console.log('Clicked item:', clickedItem);
                                    // Handle item click navigation
                                }}
                            />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Hero;
