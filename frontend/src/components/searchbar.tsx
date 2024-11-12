import React, { useState, useEffect } from 'react';
import BookBar from './bookbar';
import SearchService from '@/services/searchService';

interface SearchBarProps {
  placeholder?: string;
  buttonLabel?: string;
}

interface Book {
  id: string;
  title: string;
  author: string;
}

const SearchBar: React.FC<SearchBarProps> = ({ placeholder, buttonLabel }) => {
  const [query, setQuery] = useState('');
  const num_results = 3;
  const [searchResults, setSearchResults] = useState<Book[]>([]);

  const handleSearch = () => {
    //Go to the page with all the coincidences.
  };

  useEffect(() => {
    if (query.trim()) {
      const debounceTimeout = setTimeout(() => {
        SearchService.searchRequest(query, num_results)
          .then(results => {
            const books = results.map((book: any) => ({
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

  return (
    <div>
      <div style={{ display: 'flex'}}>
        <input
          type="text"
          placeholder={placeholder}
          value={query}
          onChange={handleInputChange}
          style={{
            padding: '10px',
            fontSize: '16px',
            border: '1px solid #ccc',
            borderRadius: '5px 0 0 5px',
            width: '250px',
            margin: '0px'
          }}
        />
        <button
          onClick={handleSearch}
          style={{
            borderRadius: '0 5px 5px 0'
          }}
        >
          {buttonLabel}
        </button>
      </div>
      <div style={{ marginTop: '0px', maxHeight: '250px', overflowY: 'auto', display: 'flex', flexDirection: 'column', position: 'absolute'}}>
        {searchResults.map((book) => (
          <BookBar key={book.id} id={book.id} title={book.title} author={book.author}/>
        ))}
      </div>
    </div>
  );
};

export default SearchBar;