import type { AppProps } from 'next/app';
import '../styles/globals.css';
import Effects from '../components/Effects';
import TrackingScripts from '../components/TrackingScripts';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Effects />
      <TrackingScripts />
      <Component {...pageProps} />
    </>
  );
}
