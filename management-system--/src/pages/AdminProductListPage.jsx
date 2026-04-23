import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  addToCart,
  increaseQuantity,
  decreaseQuantity,
} from "../features/cart/cartSlice";
import { getProductsApi } from "../api/productApi";
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
// - Add Product button at the top
// - Add to Cart / quantity controls
// - Edit button on each card

export default function AdminProductListPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

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

        <select value={sortOrder} onChange={handleSortChange}>
          <option value="default">Last added</option>
          <option value="priceAsc">Price low to high</option>
          <option value="priceDesc">Price high to low</option>
        </select>

        <button onClick={handleAddProduct}>Add Product</button>
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
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    flexWrap: "wrap",
                  }}
                >
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