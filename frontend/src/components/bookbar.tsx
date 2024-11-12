import React, { useState } from 'react';

interface BookBarProps{
    id: string;
    title: string;
    author: string;
}

const BookBar: React.FC<BookBarProps> = ({id, title, author}) => {
    const handleSearchBook = () => {
        //Go to book page
    };

    return (
        <button id={id} className="secondaryButton" onClick={handleSearchBook} style={{textAlign: 'left'}}>
            {title} · {author}
        </button>
    );
};

export default BookBar;