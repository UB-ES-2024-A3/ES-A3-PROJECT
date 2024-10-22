import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import NavBar from '@/components/navbar';

const MainPage: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Determines wether the user is logged in or not
  const [tabSelected, setTabSelected] = useState('profile'); // Stores the selected tab
  const [username, setUsername] = useState(''); // Stores the user's username
  const router = useRouter();

  // If the user it's not authenticated it gets redirected to the login page 
  useEffect(() => {
    const authStatus = localStorage.getItem('isAuthenticated');
    const nameoftheuser = localStorage.getItem('userName');
    if (authStatus === 'true') {
      setIsAuthenticated(true);
      setUsername(nameoftheuser ? nameoftheuser : "");
    } else {
      router.push('/login');
    }
  }, [router]);

  // Function to log out the user deleting the session and redirecting to the login page
  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userName');
    localStorage.removeItem('userAuthToken');
    setIsAuthenticated(false);
    router.push('/login');
  };

  // Updates the navigation bar tab selected
  const handleNavBarSelection = (tab: string) => {
    setTabSelected(tab); 
  };

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      {isAuthenticated ? (
        <>
          {/*If the user is authenticated it shows the page of the selected tab and the NavBar*/}
          <div style={{ width: '250px' }}>
            <NavBar handleNavBarSelection={handleNavBarSelection} tabSelected={tabSelected} />
          </div>          
            {tabSelected === 'timeline' ? (
              <div>Timeline Page</div>
            ):(
              <div style={{ flex: 1, padding: '20px' }}>
                <button onClick={handleLogout}>Logout</button>
              </div>
            )}
        </>
      ) : (
        <>
          {/*If the user is not authenticated it shows this message while it's being redirected*/}
          <p>Redirecting to login...</p>
        </>
      )}
    </div>
  );
};

export default MainPage;
