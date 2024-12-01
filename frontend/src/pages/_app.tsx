import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { TimelineProvider } from '../contexts/TimelineContext';
import Head from 'next/head';



function MyApp({ Component, pageProps }: AppProps) {
  
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
