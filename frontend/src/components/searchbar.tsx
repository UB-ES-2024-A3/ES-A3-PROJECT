import React, { useState, useEffect } from 'react';
import BookBar from './bookbar';
import UserBar from './userbar';
import SearchService from '@/services/searchService';
import { useTimelineContext } from '@/contexts/TimelineContext';
import { useRouter } from 'next/router';

interface SearchBarProps {
  children: React.ReactNode,
  placeholder?: string;
  buttonLabel?: string;
  id: string;
}

interface Book {
  id: string;
  title: string;
  author: string;
}
interface User {
  user_id: string;
  username: string;
}

const SearchBar: React.FC<SearchBarProps> = ({ children, placeholder, buttonLabel, id }) => {
  const router = useRouter();
  const {setTimelineState} = useTimelineContext();
  const [query, setQuery] = useState('');
  const num_results = 3;
  const [bookResults, setBookResults] = useState<Book[]>([]);
  const [userResults, setUserResults] = useState<User[]>([]);

  const handleSearch = () => {
    if (query.trim()) {
      setBookResults([]);
      setTimelineState({page: "search", data: query});
      router.push("/timeline/search/" + query);
      setQuery('');
    }
  };

  const handleOpenBook = (id: string) => {
    setBookResults([]);
    setTimelineState({page: "book", data: id});
    router.push("/timeline/book/" + id);
    setQuery('');
  }

  const handleOpenUser = (id: string) => {
    setUserResults([]);
    setTimelineState({page: "user", data: id});
    router.push("/timeline/user/" + id);
    setQuery('');
  }

  useEffect(() => {
    if (query.trim()) {
      const debounceTimeout = setTimeout(() => {
        SearchService.bookRequest(query, num_results)
          .then(results => {
            const books = results.map((book: Book) => ({
              id: book.id,
              title: book.title,
              author: book.author,
            }));
            setBookResults(books);
          })
          .catch(errorMsgs => {
            console.log(errorMsgs);
            setBookResults([]);
          });
        SearchService.userRequest(query, num_results)
          .then(results => {
            const users = results.map((user: User) => ({
              user_id: user.user_id,
              username: user.username
            }));
            setUserResults(users);
          })
          .catch(errorMsgs => {
            console.log(errorMsgs);
            setUserResults([]);
          });
      }, 300); // 300 ms debounce

      return () => clearTimeout(debounceTimeout);
    } else {
      setBookResults([]);
      setUserResults([]);
    }
  }, [query]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };
  
  const handleEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter'){
      handleSearch();
    }
  };

  return (
    <div style={{ display: 'flex', padding: '20px' , flexDirection: 'column', alignItems: 'center', height: '100vh', width: "100%"}}>
      <div style={{width: '100%'}}>
        <div id={id} style={{ width: '50%', margin: '0 auto'}}>
          <div style={{ display: 'flex' , width: "100%"}}>
            <input
              type="text"
              id={id + '-input'}
              placeholder={placeholder}
              value={query}
              onChange={handleInputChange}
              onKeyDown={handleEnter}
              style={{
                padding: '10px',
                fontSize: '16px',
                border: '1px solid #ccc',
                borderRadius: '5px 0 0 5px',
                width: '90%',
                margin: '0px'
              }}
            />
            <button
              id={id + '-button'}
              onClick={handleSearch}
              style={{
                width: '10%', 
                borderRadius: '0 5px 5px 0',
                minWidth: '100px'
              }}
            >
              {buttonLabel}
            </button>
          </div>
          <div id={id + '-results'} style={{ width: '45%', marginTop: '0px', overflowY: 'scroll', display: 'flex', flexDirection: 'column', position: 'absolute', maxHeight: '80vh'}}>
            <>
              {bookResults.length > 0 ? 
              (<div style = {{border: '2px solid #ccc', borderRadius: '3px'}}>
                <div style={{textAlign: 'left', backgroundColor: '#ccc', color: 'black', paddingLeft: '7px'}}> Books </div>
                <div style={{}}> 
                {bookResults.map((book) => (
                  <BookBar key={book.id} id={book.id} title={book.title} author={book.author} showRating={false} rating={5} handleOpenBook={handleOpenBook}/>
                ))}
                </div>
              </div>
              ):(<> </>)
              }
            </>
            <>
              {userResults.length > 0? 
              (<>
                <div style={{textAlign: 'left', backgroundColor: '#ccc', color: 'black', paddingLeft: '7px'}}> Users </div>
                <div style={{}}> 
                {userResults.map((user) => (
                  <UserBar key={user.user_id} id={user.user_id} username={user.username} handleOpenUser={handleOpenUser}/>
                ))}
                </div>
              </>
              ):(<></>)
              }
            </>
          </div>
        </div>
      </div>
      {children}
    </div>
  );
};

export default SearchBar;