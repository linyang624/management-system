import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import products from "../mock/products";
import {
  addToCart,
  increaseQuantity,
  decreaseQuantity,
} from "../features/cart/cartSlice";
import SearchBar from "./SearchBar";
import ProductGrid from "./ProductGrid";
import Pagination from "./Pagination";

// Number of products shown on each page
const PRODUCTS_PER_PAGE = 8;

// Customer product list page
// Features:
// - search
// - sort
// - pagination
// - cart summary
// - Add to Cart / quantity controls
// - no Add Product button

export default function CustomerProductListPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Current auth info
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const username = user?.email || "guest";

  // Current user's cart
  const userCart = useSelector(
    (state) =>
      state.cart.cartsByUser?.[username] || {
        items: [],
        promoCode: "",
        discountRate: 0,
        promoMessage: "",
        promoError: "",
      }
  );

  // Search input state
  const [searchTerm, setSearchTerm] = useState("");

  // Sort dropdown state
  const [sortOrder, setSortOrder] = useState("default");

  // Current page number
  const [currentPage, setCurrentPage] = useState(1);

  /*
    Filter and sort products
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
    // default = Last added

    return result;
  }, [searchTerm, sortOrder]);

  // Total page count
  const totalPages = Math.ceil(
    filteredAndSortedProducts.length / PRODUCTS_PER_PAGE
  );

  // Products for current page
  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * PRODUCTS_PER_PAGE;
    const endIndex = startIndex + PRODUCTS_PER_PAGE;

    return filteredAndSortedProducts.slice(startIndex, endIndex);
  }, [filteredAndSortedProducts, currentPage]);

  // Cart summary
  const totalItems = userCart.items.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  const totalPrice = userCart.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  // Search input handler
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  // Sort dropdown handler
  const handleSortChange = (e) => {
    setSortOrder(e.target.value);
    setCurrentPage(1);
  };

  // Add to cart
  const handleAddToCart = (product) => {
    if (!isAuthenticated) {
      alert("Please sign in first.");
      navigate("/signin");
      return;
    }

    dispatch(addToCart({ username, product }));
  };

  // Increase quantity
  const handleIncreaseQuantity = (productId) => {
    if (!isAuthenticated) {
      alert("Please sign in first.");
      navigate("/signin");
      return;
    }

    dispatch(increaseQuantity({ username, productId }));
  };

  // Decrease quantity
  const handleDecreaseQuantity = (productId) => {
    if (!isAuthenticated) {
      alert("Please sign in first.");
      navigate("/signin");
      return;
    }

    dispatch(decreaseQuantity({ username, productId }));
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Customer Product List</h2>

      {/* Cart summary */}
      <p>Total items: {totalItems}</p>
      <p>Total price: ${totalPrice}</p>

      {/* Search + Sort */}
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
      </div>

      {/* Reusable product grid */}
      <ProductGrid
        products={paginatedProducts}
        renderActions={(product) => {
          const cartItem = userCart.items.find((item) => item.id === product.id);

          return (
            <>
              <div style={{ marginBottom: "10px" }}>
                <Link to={`/products/${product.id}`}>View Details</Link>
              </div>

              {!cartItem ? (
                <button onClick={() => handleAddToCart(product)}>
                  Add to Cart
                </button>
              ) : (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                  }}
                >
                  <button onClick={() => handleDecreaseQuantity(product.id)}>
                    -
                  </button>

                  <span>{cartItem.quantity}</span>

                  <button onClick={() => handleIncreaseQuantity(product.id)}>
                    +
                  </button>
                </div>
              )}
            </>
          );
        }}
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