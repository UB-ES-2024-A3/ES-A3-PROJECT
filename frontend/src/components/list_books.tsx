import React, { useState, useEffect } from 'react';
import SearchService from '@/services/searchService';
import BookBar from '../components/bookbar';

interface ListBooksProps{
    search: string;
    searchBook: (id: string) => void;
}

interface Book {
    id: string;
    title: string;
    author: string;
}


const ListBooks: React.FC<ListBooksProps> = ({search, searchBook}) => {
    const [searchResults, setSearchResults] = useState<Book[]>([]);
    const [isLoading, setIsLoading] = useState(false);
     
    const handleOpenBook = (id: string) =>{
      setSearchResults([]);
      searchBook(id);
    }
    useEffect(() => {
        if (search.trim()) {
          setIsLoading(true);
          const debounceTimeout = setTimeout(() => {
            SearchService.searchRequest(search, null)
              .then(results => {
                const books = results.map((book: Book) => ({
                  id: book.id,
                  title: book.title,
                  author: book.author,
                }));
                setSearchResults(books);
                setIsLoading(false);
              })
              .catch(errorMsgs => {
                console.log(errorMsgs);
                setSearchResults([]);
                setIsLoading(false);
              });
          }, 300); // 300 ms debounce
          return () => clearTimeout(debounceTimeout);
        } else {
          setIsLoading(false);
          setSearchResults([]);
        }
      }, [search]);

    return(
        <div style={{ width: '100%', marginTop: '0px', display: 'flex', flexDirection: 'column', overflowY: 'auto'}}>
            {searchResults.length > 0 ? (
              <div>
                {searchResults.map((book) => (
                  <div key={book.id} style={{margin: '3px'}}>
                    <BookBar key={book.id} id={book.id} title={book.title} author={book.author} showReviews={true} rating={4.5} handleOpenBook={handleOpenBook}/>
                  </div>
                ))}
              </div>
            ):(
              <div style={{padding: '5px'}}> 
                {isLoading ? (
                  <div> Loading... </div>
                ):(
                  <div> No matches found </div>
                )}
                
              </div>
            )}
            
        </div>

    );
}

export default ListBooks;