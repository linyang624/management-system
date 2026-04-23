import { useEffect, useMemo, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  addToCart,
  increaseQuantity,
  decreaseQuantity,
} from "../features/cart/cartSlice";
import { getProductsApi } from "../api/productApi";
import ProductGrid from "./ProductGrid";
import Pagination from "./Pagination";

// Number of products shown on each page
const PRODUCTS_PER_PAGE = 8;

// Customer product list page
// Requirements:
// - no Edit button
// - has cart actions
// - reuses ProductGrid, Pagination

export default function CustomerProductListPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

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

  // Product data from backend
  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [productError, setProductError] = useState("");

  // Search input state
  const [searchTerm, setSearchTerm] = useState("");

  // Sort dropdown state
  const [sortOrder, setSortOrder] = useState("default");

  // Current page number
  const [currentPage, setCurrentPage] = useState(1);

  /*
    Load products from backend whenever sort changes.
  */
  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoadingProducts(true);
        setProductError("");

        let sortParam = "latest";

        if (sortOrder === "priceAsc") {
          sortParam = "price_asc";
        } else if (sortOrder === "priceDesc") {
          sortParam = "price_desc";
        }

        const data = await getProductsApi(sortParam);
        setProducts(data);
      } catch (error) {
        setProductError(error.message || "Failed to load products");
      } finally {
        setLoadingProducts(false);
      }
    };

    loadProducts();
  }, [sortOrder]);

  /*
    Sync searchTerm from URL query string.
    Example: /products?keyword=apple
  */
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const keyword = params.get("keyword") || "";
    setSearchTerm(keyword);
    setCurrentPage(1);
  }, [location.search]);

  /*
    Filter products by search text.
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
  }, [products, searchTerm]);

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
    <div style={pageContainerStyle}>
      <h2 style={pageTitleStyle}>Products</h2>

      {/* Sort */}
      {/* Toolbar */}
      <div style={toolbarStyle}>
        <div style={resultTextStyle}>
          Showing {filteredProducts.length} product
          {filteredProducts.length !== 1 ? "s" : ""}
        </div>

        <div style={sortWrapperStyle}>
          <label htmlFor="sort" style={sortLabelStyle}>
            Sort by:
          </label>
          <select
            id="sort"
            value={sortOrder}
            onChange={handleSortChange}
            style={selectStyle}
          >
            <option value="default">Last added</option>
            <option value="priceAsc">Price low to high</option>
            <option value="priceDesc">Price high to low</option>
          </select>
        </div>
      </div>

      {loadingProducts ? (
        <p>Loading products...</p>
      ) : productError ? (
        <p style={{ color: "red" }}>{productError}</p>
      ) : (
        <>
          <ProductGrid
            products={paginatedProducts}
            getDetailPath={(product) => `/products/${product.id}`}
            renderActions={(product) => {
              const cartItem = userCart.items.find(
                (item) => item.id === product.id
              );

              return !cartItem ? (
                <button
                  onClick={() => handleAddToCart(product)}
                  style={primaryButtonStyle}
                >
                  Add to Cart
                </button>
              ) : (
                <div style={qtyContainerStyle}>
                    <button
                      onClick={() => handleDecreaseQuantity(product.id)}
                      style={qtyButtonStyle}
                    >
                      -
                    </button>

                    <span style={qtyTextStyle}>{cartItem.quantity}</span>

                    <button
                      onClick={() => handleIncreaseQuantity(product.id)}
                      style={qtyButtonStyle}
                    >
                      +
                    </button>
                </div>
              );
            }}
          />

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </>
      )}
    </div>
  );
}

/* =======================
   Styles
======================= */

const pageContainerStyle = {
  maxWidth: "1200px",
  margin: "0 auto",
  padding: "24px",
};

const pageTitleStyle = {
  fontSize: "32px",
  marginBottom: "20px",
};


const selectStyle = {
  padding: "10px 12px",
  borderRadius: "6px",
  border: "1px solid #d1d5db",
  fontSize: "14px",
  backgroundColor: "#fff",
};

const toolbarStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: "16px",
  marginBottom: "24px",
  flexWrap: "wrap",
};

const resultTextStyle = {
  fontSize: "15px",
  color: "#6b7280",
};

const sortWrapperStyle = {
  display: "flex",
  alignItems: "center",
  gap: "8px",
};

const sortLabelStyle = {
  fontSize: "14px",
  color: "#374151",
};

const primaryButtonStyle = {
  padding: "10px 14px",
  backgroundColor: "#6366f1",
  color: "#fff",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer",
  fontSize: "14px",
  fontWeight: "500",
};

const secondaryButtonStyle = {
  padding: "10px 14px",
  backgroundColor: "#fff",
  color: "#374151",
  border: "1px solid #d1d5db",
  borderRadius: "6px",
  cursor: "pointer",
  fontSize: "14px",
};

const qtyButtonStyle = {
  width: "28px",
  height: "28px",
  border: "1px solid #d1d5db",
  backgroundColor: "#fff",
  cursor: "pointer",
};

const qtyContainerStyle = {
  display: "flex",
  alignItems: "center",
  gap: "8px",
};

const qtyTextStyle = {
  minWidth: "20px",
  textAlign: "center",
};
