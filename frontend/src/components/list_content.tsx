import { useTimelineContext } from '@/contexts/TimelineContext';
import { useRouter } from 'next/router';
import React, { useState, useEffect } from 'react';
import BookBar from '@/components/bookbar';
//TODO: temporal service
import SearchService from '@/services/searchService';

interface ListContentsProps{

}
interface Book {
    id: string;
    title: string;
    author: string;
}

const ListContents: React.FC<ListContentsProps> = () => {
    const [bookResults, setBookResults] = useState<Book[]>([]);
    const [isLoadingBooks, setIsLoadingBooks] = useState(false);
    const {timelineState,setTimelineState} = useTimelineContext();
    // TODO: for the moment we use this query
    const search = 'scholastic';
    const router = useRouter();
    const { listId } = router.query;
    const name = router.query.name as string; 
    const [username, setUsername] = useState('username');

     
    const handleOpenBook = (id: string) =>{
      setBookResults([]);
      setTimelineState({page: "book", data: id});
      router.push("/timeline/book/"+ id)
    }
    // Since I don't have the endpoint I am retrieving books like in the list of searched books
    useEffect(() => {
      if (search.trim()) {
        setIsLoadingBooks(true);
        const debounceTimeout = setTimeout(() => {
          SearchService.bookRequest(search, null)
            .then(results => {
              const books = results.map((book: Book) => ({
                id: book.id,
                title: book.title,
                author: book.author
              }));
              setBookResults(books);
              setIsLoadingBooks(false);
            })
            .catch(errorMsgs => {
              console.log(errorMsgs);
              setBookResults([]);
              setIsLoadingBooks(false);
            });
        }, 300); // 300 ms debounce
        return () => clearTimeout(debounceTimeout);
      } else {
        setBookResults([]);
      }
    }, [search]);

    return(
        <div style={{ width: '100%', marginTop: '0px', display: 'flex', flexDirection: 'column'}}>
            <div style={{ 
                margin: '20px', 
                textAlign: 'center', 
                fontSize: '28pt', 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center'
            }}>
                <span>{name}</span>
                <span style={{ margin: '0 30px' }}>|</span>
                <span>{username}</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column'}}>
              {bookResults.length > 0 ? (
                <div style={{display: 'flex', flexDirection: 'column', margin: '0px 30px'}}>
                  {bookResults.map((book) => (
                    <div key={book.id} style={{margin: '3px'}}>
                      <BookBar key={book.id} id={book.id} title={book.title} author={book.author} showRating={false} rating={5} handleOpenBook={handleOpenBook}/>
                    </div>
                  ))}
                </div>
              ):(
                <div style={{padding: '5px'}}> 
                  {isLoadingBooks ? (
                    <div> Loading... </div>
                  ):(
                    <div> No books added </div>
                  )}
                </div>
              )}
            </div>
        </div>

    );

};
export default ListContents;