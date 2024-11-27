import React, { useState, useEffect } from 'react';
import SearchService from '@/services/searchService';
import BookBar from '../components/bookbar';
import { useTimelineContext } from '@/contexts/TimelineContext';
import { useRouter } from 'next/router';

interface ListBooksProps{
    search: string;
}

interface Book {
    id: string;
    title: string;
    author: string;
    avgstars: number;
}


const ListBooks: React.FC<ListBooksProps> = ({search}) => {
    const [searchResults, setSearchResults] = useState<Book[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const {setTimelineState} = useTimelineContext();
    const router = useRouter();

     
    const handleOpenBook = (id: string) =>{
      setSearchResults([]);
      setTimelineState({page: "book", data: id});
      router.push("/timeline/book/"+ id)
    }
    useEffect(() => {
        if (search.trim()) {
          setIsLoading(true);
          const debounceTimeout = setTimeout(() => {
            SearchService.bookRequest(search, null)
              .then(results => {
                const books = results.map((book: Book) => ({
                  id: book.id,
                  title: book.title,
                  author: book.author,
                  avgstars: book.avgstars
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
              <div style={{ width: '100%', display: 'flex', flexDirection: 'column' }}>
                {searchResults.map((book) => (
                  <div key={book.id} style={{margin: '3px'}}>
                    <BookBar key={book.id} id={book.id} title={book.title} author={book.author} showRating={true} rating={book.avgstars} handleOpenBook={handleOpenBook}/>
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