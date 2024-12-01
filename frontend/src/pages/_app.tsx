import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { TimelineProvider } from '../contexts/TimelineContext';
import { useEffect } from 'react';
import { useRouter } from 'next/router';

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();

  useEffect(() => {
    const authStatus = localStorage.getItem('isAuthenticated');
    if (authStatus === 'true') {
      if (router.pathname.endsWith("/login") || router.pathname.endsWith("/register"))
        router.push('/profile');
    } else {
      router.push('/login');
    }
  }, []);
  
  return (
    <TimelineProvider>
      <Component {...pageProps} />
    </TimelineProvider>
  );
}

export default MyApp;
