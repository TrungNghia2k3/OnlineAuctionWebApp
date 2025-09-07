import Hero from '../../../Hero';
import IconicBrands from '../../../IconicBrands';
import { AuctionCard, ExpertCard, Slides } from '@/components/molecules';
import { items } from '@/data';
import { useNavigation, useExperts } from '@/hooks';
import './ThisWeek.scss';

/**
 * ThisWeek Component
 * Displays "This week" category content
 */
const ThisWeek = () => {
    const { navigateToBidDetail } = useNavigation();
    const { experts, isLoading: expertsLoading } = useExperts(true); // Get active experts

    const handleAuctionClick = (item) => {
        navigateToBidDetail(item.id);
    };

    const handleExpertClick = (expert) => {
        // You can add navigation to expert detail page here
        console.log('Expert clicked:', expert);
    };

    const thisWeekItems = items["This week"] || [];

    return (
        <div className="this-week">
            <div className="this-week__content">

                {/* Hero Section */}
                <Hero />

                {/* Featured Auctions */}
                <Slides
                    items={thisWeekItems}
                    CardComponent={AuctionCard}
                    cardProps={{ onClick: handleAuctionClick }}
                    title="Featured This Week"
                    className="this-week__slides"
                    slidesPerView={4}
                />

                {/* Featured Auctions */}
                <Slides
                    items={thisWeekItems}
                    CardComponent={AuctionCard}
                    cardProps={{ onClick: handleAuctionClick }}
                    title="Featured This Week"
                    className="this-week__slides"
                    slidesPerView={3}
                />

                {/* Iconic brands */}
                <IconicBrands />

                {/* Experts Slides - Using API data */}
                {!expertsLoading && experts.length > 0 && (
                    <Slides
                        items={experts}
                        CardComponent={ExpertCard}
                        cardProps={{ onClick: handleExpertClick }}
                        title="Top Experts"
                        className="this-week__expert-slides"
                        slidesPerView={4}
                    />
                )}

            </div>
        </div>
    );
};

export default ThisWeek;
