import React, { useState } from 'react';
import SearchBar from '@/components/searchbar';
import ListBooks from '@/components//list_books';

const Timeline: React.FC = () => {

    const [showList, setShowList] = useState(false);
    const [search, setSearch] = useState('');
    
    const onSearch = (search: string, show: boolean) => {
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