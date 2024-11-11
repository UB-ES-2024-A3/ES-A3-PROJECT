import React, { useState } from 'react';

interface SearchBarProps {
  placeholder?: string;
  buttonLabel?: string;
  onSearch: (query: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ placeholder, buttonLabel, onSearch }) => {
  const [query, setQuery] = useState('');

  const handleSearch = () => {
    onSearch(query); 
  };

  return (
    <div style={{ display: 'flex'}}>
      <input
        type="text"
        placeholder={placeholder}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        style={{
          padding: '10px',
          fontSize: '16px',
          border: '1px solid #ccc',
          borderRadius: '5px 0 0 5px',
          width: '250px',
        }}
      />
      <button
        onClick={handleSearch}
        style={{
          padding: '10px 20px',
          fontSize: '16px',
          backgroundColor: '#417154',
          color: 'white',
          border: 'none',
          borderRadius: '0 5px 5px 0',
          cursor: 'pointer',
        }}
      >
        {buttonLabel}
      </button>
    </div>
  );
};

export default SearchBar;