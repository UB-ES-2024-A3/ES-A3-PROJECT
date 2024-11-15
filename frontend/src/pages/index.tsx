import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import NavBar from '@/components/navbar';
import Timeline from '@/components/timeline';
import Profile from '@/components/profile';

const MainPage: React.FC = () => {

  const [isAuthenticated, setIsAuthenticated] = useState(false); // Determines whether the user is logged in or not
  const [tabSelected, setTabSelected] = useState('profile'); // Stores the selected tab
  const [showList, setShowList] = useState(false);
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
    if (tab === 'timeline') {
      setShowList(false);
    }
  };

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      {isAuthenticated ? (
        <>
          <div style={{width: '8%'}}>
            <NavBar handleNavBarSelection={handleNavBarSelection} tabSelected={tabSelected} />
          </div>
          <div style = {{width: '100%'}}>
            {tabSelected === 'timeline' ? (
              <Timeline showList={showList} setShowList={setShowList}/>
            ) : (
              <Profile handleLogout={handleLogout}/>
            )}
          </div>
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
