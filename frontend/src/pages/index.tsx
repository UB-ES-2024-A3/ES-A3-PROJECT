import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import NavBar from '@/components/navbar';
import SearchBar from '@/components/searchbar';

const MainPage: React.FC = () => {

  const [isAuthenticated, setIsAuthenticated] = useState(false); // Determines whether the user is logged in or not
  const [tabSelected, setTabSelected] = useState('profile'); // Stores the selected tab
  const router = useRouter();

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

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      {isAuthenticated ? (
        <>
          <div>
            <NavBar handleNavBarSelection={handleNavBarSelection} tabSelected={tabSelected} />
          </div>
          {tabSelected === 'timeline' ? (
            <div style={{ display: 'flex', padding: '20px' , flexDirection: 'column', alignItems: 'center', height: '100vh', width: '100vw'}}>
              <div>
                <SearchBar placeholder="Search..." buttonLabel="Search"/>
              </div>
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
