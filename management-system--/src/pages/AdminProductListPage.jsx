import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import products from "../mock/products";
import SearchBar from "./SearchBar";
import ProductGrid from "./ProductGrid";
import Pagination from "./Pagination";

// Number of products shown on each page
const PRODUCTS_PER_PAGE = 8;

// Admin product list page
// Features:
// - search
// - sort
// - pagination
// - Edit button on each card
// - Add Product button at the top

export default function AdminProductListPage() {
  const navigate = useNavigate();

  // Search input state
  const [searchTerm, setSearchTerm] = useState("");

  // Sort dropdown state
  // Options:
  // - default => Last added
  // - priceAsc => Price low to high
  // - priceDesc => Price high to low
  const [sortOrder, setSortOrder] = useState("default");

  // Current page number
  const [currentPage, setCurrentPage] = useState(1);

  /*
    Filter and sort products.

    Search checks:
    - product name
    - description
    - category
    - price as text

    Sort supports:
    - Last added
    - Price low to high
    - Price high to low
  */
  const filteredAndSortedProducts = useMemo(() => {
    let result = [...products];

    // Search
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

    // Sort
    if (sortOrder === "priceAsc") {
      result.sort((a, b) => a.price - b.price);
    } else if (sortOrder === "priceDesc") {
      result.sort((a, b) => b.price - a.price);
    }
    // "default" means keep original order = Last added

    return result;
  }, [searchTerm, sortOrder]);

  // Total page count
  const totalPages = Math.ceil(
    filteredAndSortedProducts.length / PRODUCTS_PER_PAGE
  );

  // Paginated products for current page
  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * PRODUCTS_PER_PAGE;
    const endIndex = startIndex + PRODUCTS_PER_PAGE;

    return filteredAndSortedProducts.slice(startIndex, endIndex);
  }, [filteredAndSortedProducts, currentPage]);

  // Search input change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  // Sort dropdown change
  const handleSortChange = (e) => {
    setSortOrder(e.target.value);
    setCurrentPage(1);
  };

  // Placeholder edit action
  const handleEdit = (productId) => {
    console.log("Edit product:", productId);
  };

  // Go to create product page
  const handleAddProduct = () => {
    navigate("/admin/products/create");
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Admin Product List</h2>

      {/* Search + Sort + Add Product */}
      <div
        style={{
          display: "flex",
          gap: "12px",
          flexWrap: "wrap",
          alignItems: "center",
          marginBottom: "20px",
        }}
      >
        <SearchBar
          searchTerm={searchTerm}
          onSearchChange={handleSearchChange}
        />

        <select
          value={sortOrder}
          onChange={handleSortChange}
          style={{
            padding: "10px",
            border: "1px solid #ccc",
            borderRadius: "6px",
          }}
        >
          <option value="default">Last added</option>
          <option value="priceAsc">Price: low to high</option>
          <option value="priceDesc">Price: high to low</option>
        </select>

        <button onClick={handleAddProduct}>Add Product</button>
      </div>

      {/* Reusable product grid */}
      <ProductGrid
        products={paginatedProducts}
        renderActions={(product) => (
          <button onClick={() => handleEdit(product.id)}>Edit</button>
        )}
      />

      {/* Reusable pagination */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}