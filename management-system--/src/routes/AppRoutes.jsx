import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { useSelector } from "react-redux";
import Layout from "../components/shared/Layout";

import SignInPage from "../pages/SignInPage";
import SignUpPage from "../pages/SignUpPage";
import UpdatePasswordPage from "../pages/UpdatePasswordPage";

import AdminProductListPage from "../pages/AdminProductListPage";
import CustomerProductListPage from "../pages/CustomerProductListPage";
import ProductDetailPage from "../pages/ProductDetailPage";
import CreateProductPage from "../pages/CreateProductPage";
import CheckoutPage from "../pages/CheckoutPage";

/*
  HomeRedirect decides which home page the user should see.

  Requirement:
  - admin login -> Admin product list page
  - customer login -> Customer product list page

  If user is not logged in, send them to sign-in page.
*/
function HomeRedirect() {
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  if (!isAuthenticated) {
    return <Navigate to="/signin" replace />;
  }

  if (user?.role === "admin") {
    return <Navigate to="/admin/products" replace />;
  }

  return <Navigate to="/products" replace />;
}

/*
  AdminRoute protects admin-only pages.
  If user is not logged in, send to sign-in.
  If logged in but not admin, send to customer home page.
*/
function AdminRoute({ children }) {
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  if (!isAuthenticated) {
    return <Navigate to="/signin" replace />;
  }

  if (user?.role !== "admin") {
    return <Navigate to="/products" replace />;
  }

  return children;
}

/*
  CustomerRoute protects customer pages.
  If user is not logged in, send to sign-in.
  If logged in as admin, send to admin home page.
*/
function CustomerRoute({ children }) {
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  if (!isAuthenticated) {
    return <Navigate to="/signin" replace />;
  }

  if (user?.role === "admin") {
    return <Navigate to="/admin/products" replace />;
  }

  return children;
}

function AppRoutes() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          {/* Root route sends user to correct home page based on role */}
          <Route path="/" element={<HomeRedirect />} />

          {/* Public auth pages */}
          <Route path="/signin" element={<SignInPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/update-password" element={<UpdatePasswordPage />} />

          {/* Customer pages */}
          <Route
            path="/products"
            element={
              <CustomerRoute>
                <CustomerProductListPage />
              </CustomerRoute>
            }
          />
          <Route
            path="/products/:id"
            element={
              <CustomerRoute>
                <ProductDetailPage />
              </CustomerRoute>
            }
          />
          <Route
            path="/checkout"
            element={
              <CustomerRoute>
                <CheckoutPage />
              </CustomerRoute>
            }
          />

          {/* Admin pages */}
          <Route
            path="/admin/products"
            element={
              <AdminRoute>
                <AdminProductListPage />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/products/:id"
            element={
              <AdminRoute>
                <ProductDetailPage />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/products/create"
            element={
              <AdminRoute>
                <CreateProductPage />
              </AdminRoute>
            }
          />

          <Route
            path="/admin/products/edit/:id"
            element={
              <AdminRoute>
                <CreateProductPage />
              </AdminRoute>
            }
          />

          {/* Fallback route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default AppRoutes;