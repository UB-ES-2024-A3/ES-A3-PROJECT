import React, { useState } from 'react';
import BookBar from './bookbar';

interface SearchBarProps {
  placeholder?: string;
  buttonLabel?: string;
  onSearch: (query: string) => void;
  searchResults: {id: string; title: string; author: string}[];
}

const SearchBar: React.FC<SearchBarProps> = ({ placeholder, buttonLabel, onSearch, searchResults }) => {
  const [query, setQuery] = useState('');

  const handleSearch = () => {
    onSearch(query); 
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuery = e.target.value;
    setQuery(newQuery);
    onSearch(newQuery); // Update search results while typing
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
      <div style={{ marginTop: '0px', maxHeight: '200px', overflowY: 'auto', display: 'flex', flexDirection: 'column', position: 'absolute'}}>
        {searchResults.map((book) => (
          <BookBar key={book.id} id={book.id} title={book.title} author={book.author} />
        ))}
      </div>
    </div>
  );
};

export default SearchBar;