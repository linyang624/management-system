import { useMemo, useState } from "react";
import products from "../mock/products";
import SearchBar from "./SearchBar";
import ProductGrid from "./ProductGrid";
import Pagination from "./Pagination";
import { useNavigate } from "react-router-dom";

// Number of products shown on each page
const PRODUCTS_PER_PAGE = 8;

// Admin product list page
// Requirements:
// - has Edit button
// - no Add to Cart button
// - reuses SearchBar, ProductGrid, Pagination

export default function AdminProductListPage() {
  // Search text
  const [searchTerm, setSearchTerm] = useState("");

  // Current pagination page
  const [currentPage, setCurrentPage] = useState(1);

  //navigate
  const navigate = useNavigate();
  /*
    Filter products based on search input.
    Search checks name, description, category, and price.
  */
  const filteredProducts = useMemo(() => {
    let result = [...products];

    if (searchTerm.trim()) {
      const keyword = searchTerm.toLowerCase();

      result = result.filter((product) => {
        return (
          product.name.toLowerCase().includes(keyword) ||
          product.description.toLowerCase().includes(keyword) ||
          (product.category &&
            product.category.toLowerCase().includes(keyword)) ||
          String(product.price).includes(keyword)
        );
      });
    }

    return result;
  }, [searchTerm]);

  // Total page count
  const totalPages = Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE);

  /*
    Only show products for current page
  */
  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * PRODUCTS_PER_PAGE;
    const endIndex = startIndex + PRODUCTS_PER_PAGE;

    return filteredProducts.slice(startIndex, endIndex);
  }, [filteredProducts, currentPage]);

  // Update search text and reset page
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  // Placeholder edit action
  const handleEdit = (productId) => {
    console.log("Edit product:", productId);
  };

  return (
    <div style={{ padding: "20px" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBotton: "20px",
        }}
      >
        <h2 style={{ margin: 0 }}>Admin Product List</h2>
        <button onClick={() => navigate("/admin/products/create")}>
          Add Product
        </button>
      </div>
      
      <SearchBar
        searchTerm={searchTerm}
        onSearchChange={handleSearchChange}
      />

      <div style={{ marginTop: "20px" }}>
        <ProductGrid
          products={paginatedProducts}
          renderActions={(product) => (
            <button onClick={() => handleEdit(product.id)}>Edit</button>
          )}
        />
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}