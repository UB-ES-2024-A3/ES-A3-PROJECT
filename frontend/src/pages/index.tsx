import endpoint from '../endpoints.config';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import NavBar from '@/components/navbar';

const MainPage: React.FC = () => {

  const [isAuthenticated, setIsAuthenticated] = useState(false); // Determines whether the user is logged in or not
  const [tabSelected, setTabSelected] = useState('profile'); // Stores the selected tab
  const [fetchedData, setFetchedData] = useState(null); // Stores the data from the GET request
  const router = useRouter();

  useEffect(() => {
    const authStatus = localStorage.getItem('isAuthenticated');
    if (authStatus === 'true') {
      setIsAuthenticated(true);
    } else {
      router.push('/login');
    }
  }, [router]);

  useEffect(() => {
    if (isAuthenticated) {
      axios.get(endpoint.dbURL) // Now correctly accessing dbURL
        .then(response => {
          console.log('Fetched Data:', response.data);
          setFetchedData(response.data);
        })
        .catch(error => {
          console.error('Error fetching data:', error);
        });
    }
  }, [isAuthenticated]);

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    setIsAuthenticated(false);
    router.push('/login');
  };

  const handleNavBarSelection = (tab: string) => {
    setTabSelected(tab);
  };

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      {isAuthenticated ? (
        <>
          <div style={{ width: '250px' }}>
            <NavBar handleNavBarSelection={handleNavBarSelection} tabSelected={tabSelected} />
          </div>
          {tabSelected === 'timeline' ? (
            <div>Timeline Page</div>
          ) : (
            <div style={{ flex: 1, padding: '20px' }}>
              <button onClick={handleLogout}>Logout</button>
              {fetchedData && <pre>{JSON.stringify(fetchedData, null, 2)}</pre>}
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
