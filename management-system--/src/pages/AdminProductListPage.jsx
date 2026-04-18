import { useMemo, useState } from "react";
import products from "../mock/products";
import SearchBar from "../components/SearchBar";
import ProductGrid from "../components/ProductGrid";
import Pagination from "../components/Pagination";

// Number of products shown on each page
const PRODUCTS_PER_PAGE = 8;

// AdminProductListPage is the product list page for admin users.
// Admin can search products and go through pages,
// but instead of cart controls, admin sees an Edit button.

export default function AdminProductListPage() {
  // Stores the current text typed into the search box
  const [searchTerm, setSearchTerm] = useState("");

  // Stores the current page number for pagination
  const [currentPage, setCurrentPage] = useState(1);

  /*
    Filter the product list based on the search term.

    useMemo is used here to avoid recalculating the filtered list
    on every render unless searchTerm changes.
  */
  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Only filter if the search box is not empty
    if (searchTerm.trim()) {
      const keyword = searchTerm.toLowerCase();

      result = result.filter(
        (product) =>
          product.name.toLowerCase().includes(keyword) ||
          product.description.toLowerCase().includes(keyword)
      );
    }

    return result;
  }, [searchTerm]);

  // Calculate total number of pages needed
  const totalPages = Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE);

  /*
    Create the product list for the current page only.

    Example:
    page 1 -> items 0 to 7
    page 2 -> items 8 to 15
  */
  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * PRODUCTS_PER_PAGE;
    return filteredProducts.slice(startIndex, startIndex + PRODUCTS_PER_PAGE);
  }, [filteredProducts, currentPage]);

  // Runs whenever user types into the search input
  // Reset page to 1 so new search starts from first page
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  // This function will later connect to edit logic or edit page navigation
  const handleEdit = (productId) => {
    console.log("Edit product:", productId);
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Admin Product List</h2>

      {/* Reusable search component */}
      <SearchBar
        searchTerm={searchTerm}
        onSearchChange={handleSearchChange}
      />

      {/* Reusable product grid */}
      <div style={{ marginTop: "20px" }}>
        <ProductGrid
          products={paginatedProducts}
          renderActions={(product) => (
            <button onClick={() => handleEdit(product.id)}>Edit</button>
          )}
        />
      </div>

      {/* Reusable pagination component */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}