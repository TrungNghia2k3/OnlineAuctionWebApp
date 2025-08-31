import React from 'react';
import { AuctionCard } from '@/components/molecules';
import { items } from '@/data';
import { useNavigation, useAuth } from '@/hooks';
import './ForYou.scss';

/**
 * ForYou Component
 * Displays personalized "For you" category content
 */
const ForYou = () => {
    const { navigateToBidDetail } = useNavigation();
    const { isAuthenticated } = useAuth();

    const handleAuctionClick = (item) => {
        navigateToBidDetail(item.id);
    };

    const forYouItems = items["For you"] || [];

    if (!isAuthenticated()) {
        return (
            <div className="for-you">
                <div className="for-you__content">
                    <div className="for-you__auth-required">
                        <h2 className="for-you__title">Personalized Recommendations</h2>
                        <p className="for-you__description">
                            Please log in to see auctions curated just for you based on your interests and bidding history.
                        </p>
                        <button className="for-you__login-btn" onClick={() => window.location.href = '/login'}>
                            Login to See Recommendations
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="for-you">
            <div className="for-you__content">
                <h2 className="for-you__title">Curated For You</h2>
                <p className="for-you__description">
                    Handpicked auctions based on your interests and bidding history
                </p>
                
                <div className="for-you__items">
                    <div className="row">
                        {forYouItems.map((item) => (
                            <div key={item.id} className="col-lg-3 col-md-6 col-sm-6 mb-4">
                                <AuctionCard
                                    item={item}
                                    onClick={handleAuctionClick}
                                />
                            </div>
                        ))}
                    </div>
                </div>

                {forYouItems.length === 0 && (
                    <div className="for-you__empty">
                        <p>We're still learning your preferences. Check back soon for personalized recommendations!</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ForYou;
