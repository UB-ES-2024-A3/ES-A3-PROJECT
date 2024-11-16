import React, { useState } from 'react';
import {renderStars} from './stars_rating';
import { floated } from '@material-tailwind/react/types/components/card';

interface BookBarProps{
    id: string;
    title: string;
    author: string;
    rating: number;
    showReviews: boolean;
    handleOpenBook: (id:string) => void;
}

const BookBar: React.FC<BookBarProps> = ({id, title, author, rating, showReviews, handleOpenBook}) => {
    const handleSearchBook = () => {
        handleOpenBook(id);
    };

    return (
        <button id={id} className="secondaryButton" onClick={handleSearchBook} style={{textAlign: 'left', borderBottom: '1px solid #ccc', width: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'space-between'}}>
            <div style = {{display: 'flex', flexDirection: 'column'}}> 
                <div> {title} </div>
                <div style={{color: 'grey'}}> · {author} </div>
            </div>
            {showReviews? (
                <div style={{display: 'flex', flexDirection: 'row', right: '0px', padding: '5px'}}>
                    {renderStars(rating)}
                </div>
            ): (
                <></>
            )}
            
        </button>
    );
};

export default BookBar;