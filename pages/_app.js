import { useRouter } from 'next/router';
import Layout from '../components/Layout';
import { CartProvider } from '../context/CartContext';
import { AuthProvider } from '../context/AuthContext';
import '../styles/globals.css';

export default function App({ Component, pageProps }) {
  const router = useRouter();
  const isAdminPage = router.pathname.startsWith('/admin');

  return (
    <AuthProvider>
      <CartProvider>
        {isAdminPage ? (
          <Component {...pageProps} />
        ) : (
          <Layout>
            <Component {...pageProps} />
          </Layout>
        )}
      </CartProvider>
    </AuthProvider>
  );
}