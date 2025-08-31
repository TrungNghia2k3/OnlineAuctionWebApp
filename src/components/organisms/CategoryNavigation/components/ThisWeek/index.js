import Hero from '../../../Hero';
import IconicBrands from '../../../IconicBrands';
import { AuctionCard, Slides } from '@/components/molecules';
import { items } from '@/data';
import { useNavigation } from '@/hooks';
import './ThisWeek.scss';

/**
 * ThisWeek Component
 * Displays "This week" category content
 */
const ThisWeek = () => {
    const { navigateToBidDetail } = useNavigation();

    const handleAuctionClick = (item) => {
        navigateToBidDetail(item.id);
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
            </div>
        </div>
    );
};

export default ThisWeek;
