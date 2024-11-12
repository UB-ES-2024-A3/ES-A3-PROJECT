import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import NavBar from '@/components/navbar';
import SearchBar from '@/components/searchbar';
import SearchService from '@/services/searchService';

interface Book {
  id: string;
  title: string;
  author: string;
}

const MainPage: React.FC = () => {

  const [isAuthenticated, setIsAuthenticated] = useState(false); // Determines whether the user is logged in or not
  const [tabSelected, setTabSelected] = useState('profile'); // Stores the selected tab
  const router = useRouter();
  const [searchResults, setSearchResults] = useState<Book[]>([]);

  const books = [
    { id: '1', title: 'JavaScript: The Good Parts', author: 'Douglas Crockford' },
    { id: '2', title: 'Eloquent JavaScript', author: 'Marijn Haverbeke' },
    { id: '3', title: 'JavaScript and JQuery', author: 'Jon Duckett' },
    // Add more as needed
  ];

  useEffect(() => {
    const authStatus = localStorage.getItem('isAuthenticated');
    if (authStatus === 'true') {
      setIsAuthenticated(true);
    } else {
      router.push('/login');
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    setIsAuthenticated(false);
    router.push('/login');
  };

  const handleNavBarSelection = (tab: string) => {
    setTabSelected(tab);
  };

  const handleSearch = (query: string) => {
    if (query.length > 0){
      return SearchService.searchRequest(
        query,
        3
      )
      .then(results => {
        const books = []
        for (var book of results ){
          books.push({id: book.id, title: book.title, author: book.author})
        }
        setSearchResults(books);
      })
      .catch(errorMsgs => {
        console.log(errorMsgs);
        setSearchResults([]);
      });
    }
    else{
      setSearchResults([]);
    }

  };

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      {isAuthenticated ? (
        <>
          <div>
            <NavBar handleNavBarSelection={handleNavBarSelection} tabSelected={tabSelected} />
          </div>
          {tabSelected === 'timeline' ? (
            <div style={{ display: 'flex', padding: '20px' , flexDirection: 'column'}}>
            <div style={{justifyContent: 'center'}}>
              <SearchBar placeholder="Search..." buttonLabel="Search" onSearch={handleSearch} searchResults={searchResults}/>
            </div>
            <div>Timeline Page</div>
          </div>
          ) : (
            <div style={{ flex: 1, padding: '20px' }}>
              <button onClick={handleLogout}>Logout</button>
            </div>
          )}
        </>
      ) : (
        <>
          <p>Redirecting to login...</p>
        </>
      )}
    </div>
  );
};

export default MainPage;
