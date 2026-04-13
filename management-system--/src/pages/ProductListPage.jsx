import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import products from "../mock/products";

// Number of products we want to show on one page
const PRODUCTS_PER_PAGE = 8;

export default function ProductListPage() {
  // Stores the current text typed into the search input
  const [searchTerm, setSearchTerm] = useState("");

  // Stores the selected sorting option from the dropdown
  // "default" = original order from products.js
  // "lowToHigh" = sort by price ascending
  // "highToLow" = sort by price descending
  const [sortOrder, setSortOrder] = useState("default");

  // Stores which pagination page the user is currently on
  const [currentPage, setCurrentPage] = useState(1);

  /**
   * Step 1: Filter products based on search input
   * Step 2: Sort the filtered products based on selected sort option
   *
   * useMemo is used here so React only recalculates this list
   * when searchTerm or sortOrder changes.
   * This helps avoid unnecessary repeated work on every render.
   */
  const filteredAndSortedProducts = useMemo(() => {
    // Create a copy of the original products array
    // so we do not directly modify the imported data
    let result = [...products];


    // If the search box is not empty, filter the products
    // by checking whether the keyword exists in:
    // - product name
    // - product price
    // - product description
    if (searchTerm.trim()) {
      const keyword = searchTerm.toLowerCase();

      result = result.filter((product) => {
        return (
          product.name.toLowerCase().includes(keyword) ||
          String(product.price).includes(keyword) ||
          (product.description &&
            product.description.toLowerCase().includes(keyword))
        );
      });
    }

    // Sort the filtered result depending on the selected option
    if (sortOrder === "lowToHigh") {
      result.sort((a, b) => a.price - b.price);
    } else if (sortOrder === "highToLow") {
      result.sort((a, b) => b.price - a.price);
    }

    return result;
  }, [searchTerm, sortOrder]);

  /**
   * Calculate total number of pages needed
   *
   * Example:
   * If there are 18 filtered products and we show 8 per page:
   * totalPages = Math.ceil(18 / 8) = 3
   */
  const totalPages = Math.ceil(
    filteredAndSortedProducts.length / PRODUCTS_PER_PAGE
  );

  /**
   * only  show products for the current page.
   *
   * Example for page 1:
   * startIndex = 0
   * endIndex = 8
   *
   * Example for page 2:
   * startIndex = 8
   * endIndex = 16
   *
   * slice(startIndex, endIndex) extracts only the products
   * for the current page.
   */
  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * PRODUCTS_PER_PAGE;
    const endIndex = startIndex + PRODUCTS_PER_PAGE;

    return filteredAndSortedProducts.slice(startIndex, endIndex);
  }, [filteredAndSortedProducts, currentPage]);

  /**
   * Runs whenever the user types in the search input
   *
   * We also reset currentPage to 1 so that if the user was on page 3
   * and searches for something new, the results start from page 1.
   */
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  /**
   * Runs whenever the user changes the sort dropdown
   *
   * Also reset currentPage to 1 for better user experience.
   */
  const handleSortChange = (e) => {
    setSortOrder(e.target.value);
    setCurrentPage(1);
  };

  /**
   * Updates the current page when the user clicks
   * a pagination button
   */
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Product List</h2>

      {/* 
       
        This section allows the user to:
        1. Search for a product
        2. Sort products by price
      */}
      <div
        style={{
          display: "flex",
          gap: "12px",
          marginBottom: "20px",
          flexWrap: "wrap",
        }}
      >
        {/* Search input */}
        <input
          type="text"
          placeholder="Search products..."
          value={searchTerm}
          onChange={handleSearchChange}
          style={{
            padding: "10px",
            width: "250px",
            border: "1px solid #ccc",
            borderRadius: "6px",
          }}
        />

        {/* Sort dropdown */}
        <select
          value={sortOrder}
          onChange={handleSortChange}
          style={{
            padding: "10px",
            border: "1px solid #ccc",
            borderRadius: "6px",
          }}
        >
          <option value="default">Default</option>
          <option value="lowToHigh">Price: low to high</option>
          <option value="highToLow">Price: high to low</option>
        </select>
      </div>

      {/* 
        This section displays only the products for the current page after filtering and sorting.
      */}
      
      /*
auto-fill Here is how it works:

auto-fill tells CSS Grid to create as many columns as possible in the available width
minmax(220px, 1fr) means each product card:
should not be smaller than 220px
can grow larger to fill the row

In the real situation: 
the number of products per row depends on the screen width.

On a:
large screen: several products can appear in one row
medium screen: fewer products per row
small screen / smartphone: usually 1 product per row if the screen is too narrow for 2 columns

Example:

screen width 1200px → maybe 4 or 5 products in one row
screen width 700px → maybe 2 or 3 products in one row
screen width 320px or 375px → usually 1 product in one row
      */
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
          gap: "16px",
        }}
      >
        {paginatedProducts.length > 0 ? (
          paginatedProducts.map((product) => (
            <div
              key={product.id}
              style={{
                border: "1px solid #ccc",
                borderRadius: "8px",
                padding: "12px",
                backgroundColor: "#fff",
              }}
            >
              {/* Show product image only if image exists in the data */}
              {product.image && (
                <img
                  src={product.image}
                  alt={product.name}
                  style={{
                    width: "100%",
                    height: "180px",
                    objectFit: "cover",
                    borderRadius: "6px",
                    marginBottom: "10px",
                  }}
                />
              )}

              {/* Product basic information */}
              <h3>{product.name}</h3>
              <p>
                <strong>Price:</strong> ${product.price}
              </p>
              <p>{product.description}</p>

              {/* Link to product details page */}
              <Link to={`/products/${product.id}`}>View Details</Link>
            </div>
          ))
        ) : (
          // Message shown when search returns no matching products
          <p>No products found.</p>
        )}
      </div>

      {/* 
        Only show pagination if there is more than 1 page.
      */}
      {totalPages > 1 && (
        <div
          style={{
            marginTop: "24px",
            display: "flex",
            gap: "8px",
            flexWrap: "wrap",
          }}
        >
          {/* Previous button */}
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            style={{ padding: "8px 12px", cursor: "pointer" }}
          >
            Prev
          </button>

          {/* 
            Create page number buttons dynamically
            Example: if totalPages = 4, render buttons 1, 2, 3, 4
          */}
          {[...Array(totalPages)].map((_, index) => {
            const pageNumber = index + 1;

            return (
              <button
                key={pageNumber}
                onClick={() => handlePageChange(pageNumber)}
                style={{
                  padding: "8px 12px",
                  cursor: "pointer",
                  fontWeight: currentPage === pageNumber ? "bold" : "normal",
                  backgroundColor:
                    currentPage === pageNumber ? "#ddd" : "#fff",
                  border: "1px solid #ccc",
                }}
              >
                {pageNumber}
              </button>
            );
          })}

          {/* Next button */}
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            style={{ padding: "8px 12px", cursor: "pointer" }}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}