import { useTimelineContext } from '@/contexts/TimelineContext';
import { useRouter } from 'next/router';
import React, { useState, useEffect } from 'react';
import BookBar from '@/components/bookbar';
//TODO: temporal service
import ListService from '@/services/listService';

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
    const router = useRouter();
    const { listId } = router.query;
    const name = router.query.name as string; 
    const [username, setUsername] = useState('');

     
    const handleOpenBook = (id: string) =>{
      setBookResults([]);
      setTimelineState({page: "book", data: id});
      router.push("/timeline/book/"+ id)
    }

    useEffect(() => {
      if(listId){
        setIsLoadingBooks(true);
        const id = listId as string;
        ListService.getBooksOfList(id)
        .then(result => {
          setUsername(result.username);
          setBookResults(result.books);
          setIsLoadingBooks(false);
        })
        .catch(except => {
            console.log(except);
            setBookResults([]);
            setIsLoadingBooks(false);
        });
      } 
    }, [listId]);

    return(
        <div style={{ width: '100%', marginTop: '0px', display: 'flex', flexDirection: 'column'}}>
            <div style={{ 
                margin: '20px', 
                textAlign: 'center', 
                fontSize: '2em', 
                display: 'flex', 
                justifyContent: 'center'
            }}>
                <span style={{flex: 1, textAlign: 'right'}}>{name}</span>
                <span style={{ margin: '0 30px', alignSelf: 'center', flex: 0}}>|</span>
                <span style={{flex: 1, textAlign: 'left'}}>{username}</span>
            </div>
            <div>
              {bookResults.length > 0 ? (
                <div style={{display: 'flex', flexDirection: 'column', margin: '0px 30px'}}>
                  {bookResults.map((book) => (
                    <div key={book.id} style={{margin: '3px'}}>
                      <BookBar key={book.id} id={book.id} title={book.title} author={book.author} showRating={false} rating={5} handleOpenBook={handleOpenBook}/>
                    </div>
                  ))}
                </div>
              ):(
                <div style={{margin: '5px', textAlign: 'center', justifyContent: 'center', height: '70vh', display: 'flex', flexDirection: 'column'}}> 
                  {isLoadingBooks ? (
                    <h2 style={{fontSize: '1.5em', color: 'grey'}}> Loading... </h2>
                  ):(
                    <h2 style={{fontSize: '1.5em', color: 'grey'}}> No books added </h2>
                  )}
                </div>
              )}
            </div>
        </div>

    );

};
export default ListContents;