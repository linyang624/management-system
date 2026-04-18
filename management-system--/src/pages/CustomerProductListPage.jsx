import { useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import products from "../mock/products";
import SearchBar from "../components/SearchBar";
import ProductGrid from "../components/ProductGrid";
import Pagination from "../components/Pagination";
import {
  addToCart,
  increaseQuantity,
  decreaseQuantity,
  selectCartItems,
  selectTotalItems,
  selectTotalPrice,
} from "../features/cart/cartSlice";

// Number of products shown on one page
const PRODUCTS_PER_PAGE = 8;

// CustomerProductListPage is the product list page for normal users.
// Customers can:
// 1. search products
// 2. browse products with pagination
// 3. add products to cart
// 4. increase or decrease quantity in the cart
// 5. see total item count and total price

export default function CustomerProductListPage() {
  // Stores the text entered by the user in the search input
  const [searchTerm, setSearchTerm] = useState("");

  // Stores which page number the user is currently viewing
  const [currentPage, setCurrentPage] = useState(1);

  // Redux dispatch is used to send actions to the cart slice
  const dispatch = useDispatch();

  // Use reusable selectors from cartSlice.js
  // This keeps the page code cleaner and avoids repeating logic
  const cartItems = useSelector(selectCartItems);
  const totalItems = useSelector(selectTotalItems);
  const totalPrice = useSelector(selectTotalPrice);

  /*
    Filter products based on the search term.

    useMemo is used so React only recalculates the filtered list
    when searchTerm changes.
  */
  const filteredProducts = useMemo(() => {
    // Copy the original products array so we do not modify it directly
    let result = [...products];

    // Only perform searching if the input is not empty
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
    Pagination logic:
    Only display the products for the current page.

    Example:
    page 1 -> items 0 to 7
    page 2 -> items 8 to 15
  */
  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * PRODUCTS_PER_PAGE;
    const endIndex = startIndex + PRODUCTS_PER_PAGE;

    return filteredProducts.slice(startIndex, endIndex);
  }, [filteredProducts, currentPage]);

  /*
    Runs whenever the user types into the search input.

    We also reset currentPage to 1 so the new search result
    starts from the first page.
  */
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Customer Product List</h2>

      {/* 
        Cart summary section
        Shows the total quantity of items in cart
        and the total price of all cart items
      */}
      <p>Total items: {totalItems}</p>
      <p>Total price: ${totalPrice}</p>

      {/* Reusable search component */}
      <SearchBar
        searchTerm={searchTerm}
        onSearchChange={handleSearchChange}
      />

      {/* Reusable product grid */}
      <div style={{ marginTop: "20px" }}>
        <ProductGrid
          products={paginatedProducts}
          renderActions={(product) => {
            // Check whether this product already exists in the cart
            const cartItem = cartItems.find((item) => item.id === product.id);

            // If product is not in cart yet, show Add to Cart button
            if (!cartItem) {
              return (
                <button onClick={() => dispatch(addToCart(product))}>
                  Add to Cart
                </button>
              );
            }

            // If product already exists in cart, show quantity controls
            return (
              <div
                style={{
                  display: "flex",
                  gap: "10px",
                  alignItems: "center",
                }}
              >
                {/* Decrease quantity by 1 */}
                <button onClick={() => dispatch(decreaseQuantity(product.id))}>
                  -
                </button>

                {/* Current quantity of this product in the cart */}
                <span>{cartItem.quantity}</span>

                {/* Increase quantity by 1 */}
                <button onClick={() => dispatch(increaseQuantity(product.id))}>
                  +
                </button>
              </div>
            );
          }}
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