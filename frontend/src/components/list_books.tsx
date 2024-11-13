import React, { useState, useEffect } from 'react';
import SearchService from '@/services/searchService';
import BookBar from '../components/bookbar';

interface ListBooksProps{
    search: string;
}

interface Book {
    id: string;
    title: string;
    author: string;
}


const ListBooks: React.FC<ListBooksProps> = ({search}) => {
    const [searchResults, setSearchResults] = useState<Book[]>([]);

    useEffect(() => {
        if (search.trim()) {
          const debounceTimeout = setTimeout(() => {
            SearchService.searchRequest(search, null)
              .then(results => {
                const books = results.map((book: Book) => ({
                  id: book.id,
                  title: book.title,
                  author: book.author,
                }));
                setSearchResults(books);
              })
              .catch(errorMsgs => {
                console.log(errorMsgs);
                setSearchResults([]);
              });
          }, 300); // 300 ms debounce
    
          return () => clearTimeout(debounceTimeout);
        } else {
          setSearchResults([]);
        }
      }, [search]);

    return(
        <div style={{ width: '100%', marginTop: '0px', display: 'flex', flexDirection: 'column', overflowY: 'auto'}}>
            {searchResults.map((book) => (
              <div style={{margin: '2px'}}>
                <BookBar key={book.id} id={book.id} title={book.title} author={book.author}/>
              </div>
            ))}
        </div>

    );
}

export default ListBooks;