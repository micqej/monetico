import type { AppProps } from 'next/app';
import '../styles/globals.css';
import CustomCursor from '../components/CustomCursor';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <CustomCursor />
      <Component {...pageProps} />
    </>
  );
}
