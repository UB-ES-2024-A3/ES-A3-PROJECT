import React, { useState, useEffect } from 'react';
import BookBar from './bookbar';
import SearchService from '@/services/searchService';

interface SearchBarProps {
  placeholder?: string;
  buttonLabel?: string;
  onSearchResults: (search: string) => void;
  searchBook: (id:string) => void;
}

interface Book {
  id: string;
  title: string;
  author: string;
}

const SearchBar: React.FC<SearchBarProps> = ({ placeholder, buttonLabel, onSearchResults, searchBook }) => {
  const [query, setQuery] = useState('');
  const num_results = 10;
  const [searchResults, setSearchResults] = useState<Book[]>([]);

  const handleSearch = () => {
    if (query.trim()) {
      setSearchResults([]);
      onSearchResults(query);
    }
  };

  const handleOpenBook = (id: string) => {
    setSearchResults([]);
    searchBook(id);
  }

  useEffect(() => {
    if (query.trim()) {
      const debounceTimeout = setTimeout(() => {
        SearchService.searchRequest(query, num_results)
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
    <div style={{ width: '50%', margin: '0 auto'}}>
      <div style={{ display: 'flex' , width: "100%"}}>
        <input
          type="text"
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
      <div style={{ width: '45%', marginTop: '0px', overflowY: 'scroll', display: 'flex', flexDirection: 'column', position: 'absolute', maxHeight: '80vh'}}>
        {searchResults.length > 0 ? 
        (<div style={{border: '2px solid #ccc'}}> 
          {searchResults.map((book) => (
            <BookBar key={book.id} id={book.id} title={book.title} author={book.author} showReviews={false} rating={5} handleOpenBook={handleOpenBook}/>
          ))}
        </div>
        ):(
        <div> 
        </div>
        )}
        
      </div>
    </div>
  );
};

export default SearchBar;