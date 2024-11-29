import React, { useState, useEffect } from 'react';
import SearchBar from '@/components/searchbar';
import { useTimelineContext } from '@/contexts/TimelineContext';
import NavBar from '@/components/navbar';
import TimelineReviewCard, { TimelineReviewProps } from '@/components/timeline_review_card';

export interface Book{
    id: string,
    title: string,
    author: string,
    description: string,
    genres: string[],
    avgstars: number,
    numreviews: number
}

const reviews: TimelineReviewProps[] = [
    {
        userId: '0001',
        username: 'bookworm',
        bookId: '1000',
        bookTitle: 'The Hunger Games',
        author: 'Suzanne Collins',
        rating: 5,
        comment: 'What an increadible story!',
        date: '12/05/2024',
        time: '14:32:07'
    },
    {
        userId: '0002',
        username: 'avid-reader',
        bookId: '8468d0fe-5e08-4594-a86d-92a239e8ad6e',
        bookTitle: 'The Nativity Story',
        author: 'Voiland, Stephanie (EDT)',
        rating: 4,
        date: '10/05/2024',
        time: '18:13:22'
    }
];

const Timeline = () => {
    const {timelineState} = useTimelineContext();
    const [search, setSearch] = useState('');
    useEffect(() => {
        if (timelineState.page == "search") {
            setSearch(timelineState.data)
        }
      }, [timelineState]);

    return (
    <NavBar>
        <SearchBar placeholder="Search..." buttonLabel="Search">
            <main style={{ display: 'flex', flexDirection: 'column', gap: '16px', padding: '16px', width: '70%' }}>
                {reviews.length? (reviews.map((review) => {
                    return (
                        <TimelineReviewCard
                            userId={review.userId}
                            username={review.username}
                            bookId={review.bookId}
                            bookTitle={review.bookTitle}
                            author={review.author}
                            rating={review.rating}
                            comment={review.comment}
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