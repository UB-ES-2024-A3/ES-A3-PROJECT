import React, { useState } from 'react';

interface BookBarProps{
    id: string;
    title: string;
    author: string;
    handleOpenBook: (id:string) => void;
}

const BookBar: React.FC<BookBarProps> = ({id, title, author, handleOpenBook}) => {
    const handleSearchBook = () => {
        handleOpenBook(id);
    };

    return (
        <button id={id} className="secondaryButton" onClick={handleSearchBook} style={{textAlign: 'left', borderBottom: '1px solid #ccc', width: '100%'}}>
            <div> {title} </div>
            <div style={{color: 'grey'}}> · {author} </div>
        </button>
    );
};

export default BookBar;