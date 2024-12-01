import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { TimelineProvider } from '../contexts/TimelineContext';


function MyApp({ Component, pageProps }: AppProps) {
  
  return (
    <TimelineProvider>
      <Component {...pageProps} />
    </TimelineProvider>
  );
}

export default MyApp;
