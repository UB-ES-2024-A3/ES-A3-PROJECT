import React, { useState, useEffect } from 'react';
import SearchBar from '@/components/searchbar';
import ListBooks from '@/components//list_books';
import { useTimelineContext } from '@/contexts/TimelineContext';
import NavBar from '@/components/navbar';

export interface Book{
    id: string,
    title: string,
    author: string,
    description: string,
    genres: string[],
    avgstars: number,
    numreviews: number
  }

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
            <div style={{margin: '5px', textAlign: 'center', justifyContent: 'center', height: '80vh', display: 'flex', flexDirection: 'column'}}> 
                <h2 style={{fontSize: '2em', color: 'grey'}}>Find a book!</h2>
                <h3 style={{color: 'grey'}}>Search you favourite book to add a review.</h3>
            </div>
        )}
        </SearchBar>
    </NavBar>
    );
};

export default Timeline;