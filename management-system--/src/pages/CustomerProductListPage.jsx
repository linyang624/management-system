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
// Requirements:
// - no Edit button
// - has cart actions
// - shows number of items and total price
// - reuses SearchBar, ProductGrid, Pagination

export default function CustomerProductListPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Current auth info
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const username = user?.email || "guest";

  // Current user's cart from cartsByUser
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

  // Search text
  const [searchTerm, setSearchTerm] = useState("");

  // Current page number
  const [currentPage, setCurrentPage] = useState(1);

  /*
    Filter products by search text
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
    Paginated products for current page
  */
  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * PRODUCTS_PER_PAGE;
    const endIndex = startIndex + PRODUCTS_PER_PAGE;

    return filteredProducts.slice(startIndex, endIndex);
  }, [filteredProducts, currentPage]);

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

      <SearchBar
        searchTerm={searchTerm}
        onSearchChange={handleSearchChange}
      />

      <div style={{ marginTop: "20px" }}>
        <ProductGrid
          products={paginatedProducts}
          renderActions={(product) => {
            // Check whether this product is already in cart
            const cartItem = userCart.items.find(
              (item) => item.id === product.id
            );

            return (
              <>
                {/* Link to detail page */}
                <div style={{ marginBottom: "10px" }}>
                  <Link to={`/products/${product.id}`}>View Details</Link>
                </div>

                {/* Cart action area */}
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
                    <button
                      onClick={() => handleDecreaseQuantity(product.id)}
                    >
                      -
                    </button>

                    <span>{cartItem.quantity}</span>

                    <button
                      onClick={() => handleIncreaseQuantity(product.id)}
                    >
                      +
                    </button>
                  </div>
                )}
              </>
            );
          }}
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