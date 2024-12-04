import { useEffect } from 'react';
import { useRouter } from 'next/router';

function Main() {
  const router = useRouter();

  useEffect(() => {
    const authStatus = localStorage.getItem('isAuthenticated');
    if (authStatus === 'true') {
      router.push('/profile');
    } else {
      router.push('/login');
    }
  }, []);
  
  return null;
}

export default Main;