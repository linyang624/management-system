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

// Admin product list page
// Features:
// - search (via header)
// - sort
// - pagination
// - Add Product button at the top
// - Add to Cart / quantity controls
// - Edit button on each card

export default function AdminProductListPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
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

  // Search keyword from URL
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

  // Paginated products for current page
  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * PRODUCTS_PER_PAGE;
    const endIndex = startIndex + PRODUCTS_PER_PAGE;

    return filteredProducts.slice(startIndex, endIndex);
  }, [filteredProducts, currentPage]);

  // Sort dropdown change
  const handleSortChange = (e) => {
    setSortOrder(e.target.value);
    setCurrentPage(1);
  };

  // Go to create product page
  const handleAddProduct = () => {
    navigate("/admin/products/create");
  };

  // Edit action
  const handleEdit = (productId) => {
    navigate(`/admin/products/edit/${productId}`);
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
      <h2 style={pageTitleStyle}>Admin Products</h2>

      {/* Toolbar: result + sort + add product */}
      <div style={toolbarStyle}>
        <div style={resultTextStyle}>
          Showing {filteredProducts.length} products
        </div>

        <div style={rightToolbarStyle}>
          <select value={sortOrder} onChange={handleSortChange} style={selectStyle}>
            <option value="default">Last added</option>
            <option value="priceAsc">Price low to high</option>
            <option value="priceDesc">Price high to low</option>
          </select>

          <button onClick={handleAddProduct} style={addButtonStyle}>
            Add Product
          </button>
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
            getDetailPath={(product) => `/admin/products/${product.id}`}
            renderActions={(product) => {
              const cartItem = userCart.items.find(
                (item) => item.id === product.id
              );

              return (
                <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                  {!cartItem ? (
                    <button onClick={() => handleAddToCart(product)}>
                      Add to Cart
                    </button>
                  ) : (
                    <div style={{ display: "flex", gap: "10px" }}>
                      <button onClick={() => handleDecreaseQuantity(product.id)}>
                        -
                      </button>
                      <span>{cartItem.quantity}</span>
                      <button onClick={() => handleIncreaseQuantity(product.id)}>
                        +
                      </button>
                    </div>
                  )}

                  <button onClick={() => handleEdit(product.id)}>Edit</button>
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

/* styles */
const pageContainerStyle = {
  maxWidth: "1200px",
  margin: "0 auto",
  padding: "24px",
};

const pageTitleStyle = {
  fontSize: "32px",
  marginBottom: "20px",
};

const toolbarStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "24px",
  flexWrap: "wrap",
};

const resultTextStyle = {
  fontSize: "14px",
  color: "#6b7280",
};

const rightToolbarStyle = {
  display: "flex",
  gap: "12px",
};

const selectStyle = {
  padding: "10px",
};

const addButtonStyle = {
  padding: "10px 14px",
  background: "#6366f1",
  color: "#fff",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer",
};