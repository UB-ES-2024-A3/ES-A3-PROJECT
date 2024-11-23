import React, { useState, useEffect } from 'react';
import SearchService from '@/services/searchService';
import BookBar from './bookbar';
import ListSearchNavBar from './list_search_navbar';
import { useTimelineContext } from '@/contexts/TimelineContext';
import { useRouter } from 'next/router';

interface ListSearchProps{
    search: string;
}

interface Book {
    id: string;
    title: string;
    author: string;
    avgstars: number;
}

interface User {
  id: string;
  username: string;
}


const ListSearch: React.FC<ListSearchProps> = ({search}) => {
    const [bookResults, setBookResults] = useState<Book[]>([]);
    const [userResults, setUserResults] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const {setTimelineState} = useTimelineContext();
    const router = useRouter();
    const [activeTab, setActiveTab] = useState('books');

     
    const handleOpenBook = (id: string) =>{
      setBookResults([]);
      setTimelineState({page: "book", data: id});
      router.push("/timeline/book/"+ id)
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
                  avgstars: book.avgstars
                }));
                setBookResults(books);
                setIsLoading(false);
              })
              .catch(errorMsgs => {
                console.log(errorMsgs);
                setBookResults([]);
                setIsLoading(false);
              });
          }, 300); // 300 ms debounce
          return () => clearTimeout(debounceTimeout);
        } else {
          setIsLoading(false);
          setBookResults([]);
        }
      }, [search]);

    return(
      <>
        <div>
          <ListSearchNavBar activeTab={activeTab} setActiveTab={setActiveTab} />
        </div>
        <div style={{ width: '100%', marginTop: '0px', display: 'flex', flexDirection: 'column', overflowY: 'auto'}}>
          {activeTab == 'books'? 
          (<>
            <div style={{ width: '100%', marginTop: '0px', display: 'flex', flexDirection: 'column', overflowY: 'auto'}}>
              {bookResults.length > 0 ? (
                <div style={{ width: '100%', display: 'flex', flexDirection: 'column' }}>
                  {bookResults.map((book) => (
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
          </>):(
          <> 
            {userResults.length > 0? 
            (
              <> </>
            ):(
              <div> No matches found </div>
            )
            }
          </>
          )}

        </div>
      </>

    );
}

export default ListSearch;