import React, { useState, useEffect } from 'react';
import SearchBar from '@/components/searchbar';
import ListBooks from '@/components//list_books';
import BookInformation from './book_information';
import AddReviewButton from './add_review';
import ShowBookService from '@/services/showBookService';

interface TimelineProps{
    showList: boolean
    setShowList: (show: boolean) => void;
}
export interface Book{
    id: string,
    title: string,
    author: string,
    description: string
    genres: string[]
}

const Timeline: React.FC<TimelineProps> = ({showList, setShowList}) => {
    const [search, setSearch] = useState('');
    const [showBook, setShowBook] = useState(false);
    const [bookId, setBookId] = useState('');
    const [book, setBook] = useState<Book>({author: "", title: "", description: "", genres: [], id:""})
 
    useEffect(() => {
        ShowBookService.getBookRequest(bookId)
            .then(result => {
                setBook(result);
            })
            .catch(errorMsgs => {
                console.error(errorMsgs);
                setBook({ author: "", title: "", description: "", genres: [], id: "" });
            });
    }, [bookId]);
    
    const searchBook = (bookId: string) => {
        setBookId(bookId);
        setShowList(false);
        setShowBook(true);
    }

    const onSearch = (search: string) => {
        setShowBook(false);
        setShowList(true);
        setSearch(search);
    }

    return (
        <div style={{ display: 'flex', padding: '20px' , flexDirection: 'column', alignItems: 'center', height: '100vh', width: "100%"}}>
            <div style={{width: '100%'}}>
                <SearchBar placeholder="Search..." buttonLabel="Search" onSearchResults={onSearch} searchBook={searchBook}/>
            </div>
            {showBook? (
                <>
                    <BookInformation book={book} />
                    <AddReviewButton author={book.author} title={book.title} bookId={bookId}/>
                </>
            ):
            (
                <>
                {showList ? (
                    <div style={{margin: '5px', width: '100%'}}> 
                        <ListBooks search={search} searchBook={searchBook}/>
                    </div>
                ) : (
                    <div style={{margin: '5px', textAlign: 'center', justifyContent: 'center', height: '80vh', display: 'flex', flexDirection: 'column'}}> 
                        <h2 style={{fontSize: '2em', color: 'grey'}}>Find a book!</h2>
                        <h3 style={{color: 'grey'}}>Search you favourite book to add a review.</h3>
                    </div>
                )}
                </>
            )}

        </div>
        
    );
};

export default Timeline;