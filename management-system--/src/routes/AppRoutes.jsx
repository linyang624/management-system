import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import Layout from '../components/shared/Layout';
import SignInPage from '../pages/SignInPage';
import SignUpPage from '../pages/SignUpPage';
import UpdatePasswordPage from '../pages/UpdatePasswordPage';

import ProductListPage from "../pages/ProductListPage";
import ProductDetailPage from "../pages/ProductDetailPage";
import CheckoutPage from "../pages/CheckoutPage";

function AppRoutes() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Navigate to="/signin" />} />
          <Route path="/signin" element={<SignInPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/update-password" element={<UpdatePasswordPage />} />
          <Route path="/products" element={<ProductListPage />} />
          <Route path="/products/:id" element={<ProductDetailPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default AppRoutes;