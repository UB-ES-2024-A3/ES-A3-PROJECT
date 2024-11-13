import React, { useState, useEffect } from 'react';
import BookBar from './bookbar';
import SearchService from '@/services/searchService';
import { useRouter } from 'next/router';

interface SearchBarProps {
  placeholder?: string;
  buttonLabel?: string;
  onSearchResults: (search: string, showList: boolean) => void;
}

interface Book {
  id: string;
  title: string;
  author: string;
}

const SearchBar: React.FC<SearchBarProps> = ({ placeholder, buttonLabel, onSearchResults }) => {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const num_results = 10;
  const [searchResults, setSearchResults] = useState<Book[]>([]);

  const handleSearch = () => {
    if (query.trim()) {
      setSearchResults([]);
      onSearchResults(query, true);
    }
  };

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

  return (
    <div style={{ width: '50%', margin: '0 auto'}}>
      <div style={{ display: 'flex' , width: "100%"}}>
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
      <div style={{ width: '100%', marginTop: '0px', overflowY: 'scroll', display: 'flex', flexDirection: 'column', position: 'relative', maxHeight: '80vh'}}>
        {searchResults.map((book) => (
          <BookBar key={book.id} id={book.id} title={book.title} author={book.author}/>
        ))}
      </div>
    </div>
  );
};

export default SearchBar;