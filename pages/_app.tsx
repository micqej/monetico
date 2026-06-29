import type { AppProps } from 'next/app';
import '../styles/globals.css';
import Effects from '../components/Effects';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Effects />
      <Component {...pageProps} />
    </>
  );
}
