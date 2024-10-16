// src/pages/_app.js

import '../styles/globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Header />
      <div style={{ paddingBottom: '50px' }}>
        <Component {...pageProps} />
      </div>
      <Footer />
    </>
  );
}

export default MyApp;
