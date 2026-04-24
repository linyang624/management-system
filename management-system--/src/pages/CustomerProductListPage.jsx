import { useEffect, useMemo, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  addToCart,
  increaseQuantity,
  decreaseQuantity,
  syncCartWithProducts,
} from "../features/cart/cartSlice";
import { getProductsApi } from "../api/productApi";
import ProductGrid from "./ProductGrid";
import Pagination from "./Pagination";

// Number of products shown on each page
const PRODUCTS_PER_PAGE = 10;

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

  // Sort Button
  const [isSortOpen, setIsSortOpen] = useState(false);
 
  const sortOptions = [
    { value: "default", label: "Last added" },
    { value: "priceAsc", label: "Price: low to high" },
    { value: "priceDesc", label: "Price: high to low" },
  ];

  const currentSortLabel = sortOptions.find((option) => option.value === sortOrder)?.label || "Last added";

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

        // Remove deleted products from cart after loading latest products
        dispatch(syncCartWithProducts(data));

      } catch (error) {
        setProductError(error.message || "Failed to load products");
      } finally {
        setLoadingProducts(false);
      }
    };

    loadProducts();
  }, [sortOrder, dispatch]);

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
  const handleSortChange = (value) => {
    setSortOrder(value);
    setCurrentPage(1);
    setIsSortOpen(false);
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
      {/* <h2 style={pageTitleStyle}>Products</h2>*/}

      {/* Sort */}
      {/* Toolbar */}
      <div style={topRowStyle}>
        <h2 style={pageTitleStyle}>Products</h2>

        <div style={rightToolbarStyle}>
          <div style={sortDropdownStyle}>
            <button
              type="button"
              style={sortButtonStyle}
              onClick={() => setIsSortOpen(!isSortOpen)}
            >
              <span>{currentSortLabel}</span>
              <span style={sortArrowStyle}>{isSortOpen ? "▴" : "▾"}</span>
            </button>

            {isSortOpen && (
              <div style={sortMenuStyle}>
                {sortOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    style={sortOptionStyle}
                    onClick={() => handleSortChange(option.value)}
                  >
                    <span style={sortCheckStyle}>
                      {sortOrder === option.value ? "✓" : ""}
                    </span>
                    <span>{option.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {loadingProducts ? (
        <p>Loading products...</p>
      ) : productError ? (
        <p style={{ color: "red" }}>{productError}</p>
      ) : (
        <>
        <div style={productListBoxStyle}>
          <ProductGrid
            products={paginatedProducts}
            getDetailPath={(product) => `/products/${product.id}`}
            renderActions={(product) => {
              const cartItem = userCart.items.find(
                (item) => item.id === product.id
              );

              return (
                <div style={cardActionRowStyle}>
                  {!cartItem ? (
                    <button
                      onClick={() => handleAddToCart(product)}
                      style={primaryButtonStyle}
                    >
                      Add
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
                  )}
                </div>
              );
            }}
          />
        </div>
          
          <div style={paginationWrapperStyle}>
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
        </>
      )}
    </div>
  );
}

/* =======================
   Styles
======================= */

const pageContainerStyle = {
  maxWidth: "1320px",
  margin: "0 auto",
  padding: "48px 32px 28px",
  fontFamily: "Arial, sans-serif",
  boxSizing: "border-box",
};

const pageTitleStyle = {
  fontSize: "28px",
  margin: 0,
  fontWeight: "700",
  color: "#111827",
  fontFamily: "Arial, sans-serif",
};

// const selectStyle = {
//   padding: "10px 12px",
//   borderRadius: "6px",
//   border: "1px solid #d1d5db",
//   fontSize: "14px",
//   backgroundColor: "#fff",
// };

// const toolbarStyle = {
//   display: "flex",
//   justifyContent: "space-between",
//   alignItems: "center",
//   gap: "16px",
//   marginBottom: "24px",
//   flexWrap: "wrap",
// };

// const resultTextStyle = {
//   fontSize: "15px",
//   color: "#6b7280",
// };

// const sortWrapperStyle = {
//   display: "flex",
//   alignItems: "center",
//   gap: "8px",
// };

// const sortLabelStyle = {
//   fontSize: "14px",
//   color: "#374151",
// };

const primaryButtonStyle = {
  width: "100%",
  height: "34px",
  padding: 0,
  backgroundColor: "#4f46e5",
  color: "#fff",
  border: "1px solid #4f46e5",
  borderRadius: "4px",
  cursor: "pointer",
  fontSize: "12px",
  fontWeight: "700",
  fontFamily: "Arial, sans-serif",
  boxSizing: "border-box",
};

// const secondaryButtonStyle = {
//   padding: "10px 14px",
//   backgroundColor: "#fff",
//   color: "#374151",
//   border: "1px solid #d1d5db",
//   borderRadius: "6px",
//   cursor: "pointer",
//   fontSize: "14px",
// };

// const qtyButtonStyle = {
//   width: "28px",
//   height: "28px",
//   border: "1px solid #d1d5db",
//   backgroundColor: "#fff",
//   cursor: "pointer",
// };

// const qtyContainerStyle = {
//   display: "flex",
//   alignItems: "center",
//   gap: "8px",
// };

// const qtyTextStyle = {
//   minWidth: "20px",
//   textAlign: "center",
// };

const qtyContainerStyle = {
  width: "100%",
  display: "flex",
  alignItems: "center",
  height: "34px",
  backgroundColor: "#4f46e5",
  borderRadius: "4px",
  overflow: "hidden",
};

const qtyButtonStyle = {
  flex: 1,
  height: "34px",
  border: "1px solid #4f46e5",
  backgroundColor: "#4f46e5",
  color: "#fff",
  cursor: "pointer",
  fontSize: "13px",
  fontWeight: "500",
  fontFamily: "Arial, sans-serif",
  boxSizing: "border-box",
};

const qtyTextStyle = {
  flex: 1,
  height: "34px",
  lineHeight: "34px",
  textAlign: "center",
  backgroundColor: "#4f46e5",
  color: "#fff",
  fontSize: "12px",
  fontWeight: "500",
  fontFamily: "Arial, sans-serif",
};

const topRowStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "32px",
};

const rightToolbarStyle = {
  display: "flex",
  gap: "12px",
  alignItems: "center",
};

const sortDropdownStyle = {
  position: "relative",
  width: "165px",
  fontFamily: "Arial, sans-serif",
};

const sortButtonStyle = {
  width: "100%",
  height: "38px",
  padding: "0 10px 0 18px",
  border: "1px solid #d1d5db",
  borderRadius: "3px 3px 0 0",
  backgroundColor: "#fff",
  color: "#333",
  cursor: "pointer",
  fontSize: "13px",
  fontWeight: "500",
  fontFamily: "Arial, sans-serif",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  boxSizing: "border-box",
};

const sortArrowStyle = {
  fontSize: "10px",
  color: "#555",
  lineHeight: 1,
};

const sortMenuStyle = {
  position: "absolute",
  top: "38px",
  left: 0,
  width: "100%",
  padding: "8px 0",
  backgroundColor: "#fff",
  borderLeft: "1px solid #d1d5db",
  borderRight: "1px solid #d1d5db",
  borderBottom: "1px solid #d1d5db",
  borderRadius: "0",
  zIndex: 50,
  boxSizing: "border-box",
};

const sortOptionStyle = {
  width: "100%",
  height: "34px",
  padding: "0 12px",
  border: "none",
  backgroundColor: "#fff",
  color: "#222",
  cursor: "pointer",
  fontSize: "12px",
  fontWeight: "400",
  fontFamily: "Arial, sans-serif",
  display: "flex",
  alignItems: "center",
  gap: "8px",
  textAlign: "left",
  boxSizing: "border-box",
};

const sortCheckStyle = {
  width: "14px",
  display: "inline-block",
  textAlign: "center",
  fontSize: "13px",
  color: "#222",
};

const productListBoxStyle = {
  backgroundColor: "#fff",
  padding: "22px 24px",
  borderRadius: "2px",
  boxSizing: "border-box",
  width: "100%",
  overflow: "visible",
};

const paginationWrapperStyle = {
  display: "flex",
  justifyContent: "flex-end",
  marginTop: "24px",
};

const cardActionRowStyle = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  width: "100%",
};