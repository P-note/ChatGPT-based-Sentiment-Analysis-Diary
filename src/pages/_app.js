import '../styles/globals.css';
import Layout from '@/pages/layout';

function MyApp({ Component, pageProps }) {
  return (
    <>
    <Layout>
      <div style={{ paddingBottom: '50px' }}>
        <Component {...pageProps} />
      </div>
    </Layout>
    </>
  );
}

export default MyApp;
