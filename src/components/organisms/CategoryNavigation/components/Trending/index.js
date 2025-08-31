import React from 'react';
import { AuctionCard } from '@/components/molecules';
import { items } from '@/data';
import { useNavigation } from '@/hooks';
import './Trending.scss';

/**
 * Trending Component
 * Displays trending category content
 */
const Trending = () => {
    const { navigateToBidDetail } = useNavigation();

    const handleAuctionClick = (item) => {
        navigateToBidDetail(item.id);
    };

    const trendingItems = items["Trending"] || [];

    return (
        <div className="trending">
            <div className="trending__content">
                <h2 className="trending__title">🔥 Trending Now</h2>
                <p className="trending__description">
                    The hottest auctions everyone is talking about
                </p>
                
                <div className="trending__items">
                    <div className="row">
                        {trendingItems.map((item) => (
                            <div key={item.id} className="col-lg-3 col-md-6 col-sm-6 mb-4">
                                <AuctionCard
                                    item={item}
                                    onClick={handleAuctionClick}
                                />
                            </div>
                        ))}
                    </div>
                </div>

                {trendingItems.length === 0 && (
                    <div className="trending__empty">
                        <p>No trending auctions at the moment. Check back later!</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Trending;
