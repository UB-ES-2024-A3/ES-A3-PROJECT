import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { TimelineProvider } from '../contexts/TimelineContext';
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();

  useEffect(() => {
    const authStatus = localStorage.getItem('isAuthenticated');
    if (authStatus === 'true') {
      router.push('/profile');
    } else {
      router.push('/login');
    }
  }, []);
  
  return (
    <>
      <Head>
        <title>Rebook</title>
      </Head>
      <TimelineProvider>
        <Component {...pageProps} />
      </TimelineProvider>
    </>
  );
}

export default MyApp;
