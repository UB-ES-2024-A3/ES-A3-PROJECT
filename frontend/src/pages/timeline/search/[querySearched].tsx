import React, { useState, useEffect } from 'react';
import SearchService from '@/services/searchService';
import BookBar from '@/components/bookbar';
import UserBar from '@/components/userbar';
import ListSearchNavBar from '@/components/list_search_navbar';
import { useTimelineContext } from '@/contexts/TimelineContext';
import { useRouter } from 'next/router';
import NavBar from '@/components/navbar';
import SearchBar from '@/components/searchbar';

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


const ListSearch: React.FC<ListSearchProps> = () => {
    const [bookResults, setBookResults] = useState<Book[]>([]);
    const [userResults, setUserResults] = useState<User[]>([]);
    const [isLoadingBooks, setIsLoadingBooks] = useState(false);
    const [isLoadingUsers, setIsLoadingUsers] = useState(false);
    const {timelineState,setTimelineState} = useTimelineContext();
    const search = timelineState.data;
    const router = useRouter();
    const [activeTab, setActiveTab] = useState('books');

     
    const handleOpenBook = (id: string) =>{
      setBookResults([]);
      setTimelineState({page: "book", data: id});
      router.push("/timeline/book/"+ id)
    }
    useEffect(() => {
      if (search.trim()) {
        setIsLoadingBooks(true);
        setIsLoadingUsers(true);
        const debounceTimeout = setTimeout(() => {
          SearchService.bookRequest(search, null)
            .then(results => {
              const books = results.map((book: Book) => ({
                id: book.id,
                title: book.title,
                author: book.author,
                avgstars: book.avgstars
              }));
              setBookResults(books);
              setIsLoadingBooks(false);
            })
            .catch(errorMsgs => {
              console.log(errorMsgs);
              setBookResults([]);
              setIsLoadingBooks(false);
            });

          SearchService.userRequest(search, null)
            .then(results => {
              const users = results.map((user: User) => ({
                id: user.id,
                username: user.username
              }));
              setUserResults(users);
              setIsLoadingUsers(false);
            })
            .catch(errorMsgs => {
              console.log(errorMsgs);
              setUserResults([]);
              setIsLoadingUsers(false);
            });
        }, 300); // 300 ms debounce
        return () => clearTimeout(debounceTimeout);
      } else {
        setBookResults([]);
        setUserResults([]);
      }
    }, [search]);

    return(
    <NavBar>
      <SearchBar placeholder="Search..." buttonLabel="Search" id='searchbar'>
        <div style={{margin: '5px 0px 5px 0px'}}>
            <ListSearchNavBar activeTab={activeTab} setActiveTab={setActiveTab} />
        </div>
        <div style={{ width: '100%', marginTop: '0px', display: 'flex', flexDirection: 'column', overflowY: 'auto'}}>
        {activeTab == 'books'? 
          ( <div style={{ width: '100%', marginTop: '0px', display: 'flex', flexDirection: 'column', overflowY: 'auto'}}>
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
                  {isLoadingBooks ? (
                    <div> Loading... </div>
                  ):(
                    <div> No matches found </div>
                  )}
                </div>
              )}
            
            </div>
          ):(
            <div style={{ width: '100%', marginTop: '0px', display: 'flex', flexDirection: 'column', overflowY: 'auto'}}>
              {userResults.length > 0? (
                <div style={{ width: '100%', display: 'flex', flexDirection: 'column' }}>
                  {userResults.map((user) => (
                    <div key={user.id} style={{margin: '3px'}}>
                      <UserBar key={user.id} id={user.id} username={user.username}/>
                    </div>
                  ))}
                </div>
              ):(
                <div style={{padding: '5px'}}> 
                  {isLoadingUsers ? (
                      <div> Loading... </div>
                  ):(
                      <div> No matches found </div>
                  )}
                  
                </div>
              )}
            </div>
          )}
        </div>
      </SearchBar>
    </NavBar>

    );
}

export default ListSearch;