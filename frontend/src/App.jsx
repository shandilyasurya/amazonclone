import { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setCredentials } from './slices/authSlice';

import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import HomePage from './pages/HomePage';
import SearchPage from './pages/SearchPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import OrderConfirmationPage from './pages/OrderConfirmationPage';
import OrdersPage from './pages/OrdersPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import CreateReviewPage from './pages/CreateReviewPage';
import WishlistPage from './pages/WishlistPage';
import ScrollToTop from './components/ScrollToTop';

function App() {
  const { userInfo } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  // Restore session from HttpOnly cookie on app load
  useEffect(() => {
    const restore = async () => {
      // If we have stored userInfo in localStorage sync it to state
      // (setCredentials was already called, authSlice reads from localStorage on init)
      // For full cookie-based restore, we call /api/auth/me
      if (!userInfo) {
        try {
          const res = await fetch('/api/auth/me', { credentials: 'include' });
          if (res.ok) {
            const data = await res.json();
            if (data?.data) {
              dispatch(setCredentials(data.data));
            }
          }
        } catch {
          // no active session
        }
      }
    };
    restore();
  }, []); // eslint-disable-line

  return (
    <>
      <ScrollToTop />
      <Routes>
      {/* Public standalone pages (no navbar/footer) */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Standalone Protected routes (no navbar/footer) */}
      <Route element={<ProtectedRoute />}>
        <Route path="/checkout" element={<CheckoutPage />} />
      </Route>

      {/* Main layout wrapper */}
      <Route path="/" element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="search" element={<SearchPage />} />
        <Route path="product/:id" element={<ProductDetailPage />} />

        {/* Protected routes within Layout */}
        <Route element={<ProtectedRoute />}>
          <Route path="cart" element={<CartPage />} />
          <Route path="orders" element={<OrdersPage />} />
          <Route path="wishlist" element={<WishlistPage />} />
          <Route path="review/create-review/:id" element={<CreateReviewPage />} />
          <Route path="order-confirmation/:id" element={<OrderConfirmationPage />} />
          <Route path="order-confirmation" element={<OrderConfirmationPage />} />
        </Route>
      </Route>
    </Routes>
    </>
  );
}

export default App;
