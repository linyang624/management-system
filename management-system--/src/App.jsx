import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import AdminProductListPage from "./pages/AdminProductListPage";
import CustomerProductListPage from "./pages/CustomerProductListPage";
import ProductDetailPage from "./pages/ProductDetailPage";
import CreateProductPage from "./pages/CreateProductPage";

export default function App() {
  return (
    <div style={{ padding: "20px" }}>
      <nav style={{ marginBottom: "20px", display: "flex", gap: "12px" }}>
        <Link to="/customer/products">Customer Products</Link>
        <Link to="/admin/products">Admin Products</Link>
        <Link to="/admin/products/create">Create Product</Link>
        <Link to="/products/1">Product Detail</Link>
      </nav>

      <Routes>
        <Route path="/customer/products" element={<CustomerProductListPage />} />
        <Route path="/admin/products" element={<AdminProductListPage />} />
        <Route path="/admin/products/create" element={<CreateProductPage />} />
        <Route path="/products/:id" element={<ProductDetailPage />} />
      </Routes>
    </div>
  );
}