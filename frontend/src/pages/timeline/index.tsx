import React, { useState, useEffect } from 'react';
import SearchBar from '@/components/searchbar';
import ListBooks from '@/components//list_books';
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
            {search ? (
            <div style={{margin: '5px', width: '100%'}}> 
                <ListBooks search={search} />
            </div>
        ) : (
            <TimelineReviewCard
                userId={reviews[0].userId}
                username={reviews[0].username}
                bookId={reviews[0].bookId}
                bookTitle={reviews[0].bookTitle}
                author={reviews[0].author}
                rating={reviews[0].rating}
                comment={reviews[0].comment}
                date={reviews[0].date}
                time={reviews[0].time}
            />
            // <div style={{margin: '5px', textAlign: 'center', justifyContent: 'center', height: '80vh', display: 'flex', flexDirection: 'column'}}> 
            //     <h2 style={{fontSize: '2em', color: 'grey'}}>Find a book!</h2>
            //     <h3 style={{color: 'grey'}}>Search you favourite book to add a review.</h3>
            // </div>
        )}
        </SearchBar>
    </NavBar>
    );
};

export default Timeline;