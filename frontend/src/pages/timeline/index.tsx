import React, { useState, useEffect } from 'react';
import SearchBar from '@/components/searchbar';
import NavBar from '@/components/navbar';
import TimelineReviewCard, { TimelineReviewProps } from '@/components/timeline_review_card';
import ReviewService from '@/services/reviewService';

const Timeline = () => {
    const [reviews, setReviews] = useState<TimelineReviewProps[]>([]);

    useEffect(() => {
        const userId = localStorage.getItem('userId');
        if (userId)
            ReviewService.getTimelineReviews(userId)
            .then(reviews => {
                setReviews(reviews);
            })
            .catch(except => {
                console.log(except);
                setReviews([]);
            })
    }, [])

    return (
    <NavBar>
        <SearchBar placeholder="Search..." buttonLabel="Search" id='searchbar'>
            <main style={{ display: 'flex', flexDirection: 'column', gap: '16px', padding: '16px', width: '70%' }}>
                {reviews.length? (reviews.map((review, index) => {
                    return (
                        <TimelineReviewCard key={index}
                            user_id={review.user_id}
                            username={review.username}
                            book_id={review.book_id}
                            title={review.title}
                            author={review.author}
                            rating={review.rating}
                            description={review.description}
                            date={review.date}
                            time={review.time}
                        />
                    );
                })) : (
                    <div style={{margin: '5px', textAlign: 'center', justifyContent: 'center', height: '80vh', display: 'flex', flexDirection: 'column'}}> 
                        <h2 style={{fontSize: '2em', color: 'grey'}}>No recent reviews found</h2>
                        <h3 style={{color: 'grey'}}>Search your favourite book to add a review</h3>
                    </div>
                )}
            </main>
        </SearchBar>
    </NavBar>
    );
};

export default Timeline;