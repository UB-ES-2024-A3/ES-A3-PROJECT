import React, { useState } from 'react';
import SearchBar from '@/components/searchbar';
import ListBooks from '@/components//list_books';

interface TimelineProps{
    showList: boolean
    setShowList: (show: boolean) => void;
}

const Timeline: React.FC<TimelineProps> = ({showList, setShowList}) => {
    const [search, setSearch] = useState('');
    
    const onSearch = (search: string) => {
        setShowList(true);
        setSearch(search);
    }

    return (
        <div style={{ display: 'flex', padding: '20px' , flexDirection: 'column', alignItems: 'center', height: '100vh', width: "100%"}}>
            <div style={{width: '100%'}}>
                <SearchBar placeholder="Search..." buttonLabel="Search" onSearchResults={onSearch}/>
            </div>
            <>
                {showList ? (
                    <div style={{margin: '5px'}}> 
                        <ListBooks search={search}/>
                    </div>
                ) : (
                    <div> </div>
                )}
            </>

        </div>
        
    );
};

export default Timeline;