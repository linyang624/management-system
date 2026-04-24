import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import {
  addToCart,
  increaseQuantity,
  decreaseQuantity,
} from "../features/cart/cartSlice";
import { getProductByIdApi } from "../api/productApi";

// Shared product detail page for both customer and admin
export default function ProductDetailPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();

  // Current auth info
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const username = user?.email || "guest";
  const isAdmin = user?.role === "admin";

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
  const [product, setProduct] = useState(null);
  const [loadingProduct, setLoadingProduct] = useState(true);
  const [productError, setProductError] = useState("");

  // Load single product from backend
  // useEffect(() => {
  //   const loadProduct = async () => {
  //     try {
  //       setLoadingProduct(true);
  //       setProductError("");

  //       const data = await getProductByIdApi(id);
  //       setProduct(data);
  //     } catch (error) {
  //       setProductError(error.message || "Failed to load product");
  //     } finally {
  //       setLoadingProduct(false);
  //     }
  //   };

  //   loadProduct();
  // }, [id]);

  // loading product and error page
  useEffect(() => {
    async function fetchProduct() {
      try {
        setLoadingProduct(true);
        setProductError("");

        const data = await getProductByIdApi(id);
        setProduct(data);
      } catch (error) {
        navigate("/error", {
          state: { message: error.message || "Product not found" },
        });
      } finally {
        setLoadingProduct(false);
      }
    }

    fetchProduct();
  }, [id, navigate]);

  // Check whether this product is already in cart
  const cartItem = product
    ? userCart.items.find((item) => item.id === product.id)
    : null;

  // Add to cart
  const handleAddToCart = () => {
    if (!isAuthenticated) {
      alert("Please sign in first.");
      navigate("/signin");
      return;
    }

    dispatch(addToCart({ username, product }));
  };

  // Increase quantity
  const handleIncreaseQuantity = () => {
    if (!isAuthenticated) {
      alert("Please sign in first.");
      navigate("/signin");
      return;
    }

    dispatch(increaseQuantity({ username, productId: product.id }));
  };

  // Decrease quantity
  const handleDecreaseQuantity = () => {
    if (!isAuthenticated) {
      alert("Please sign in first.");
      navigate("/signin");
      return;
    }

    dispatch(decreaseQuantity({ username, productId: product.id }));
  };

  // Edit action for admin
  const handleEdit = () => {
    navigate(`/admin/products/edit/${product.id}`);
  };

  if (loadingProduct) {
    return <p style={statusTextStyle}>Loading product...</p>;
  }

  if (productError) {
    return (
      <div style={pageContainerStyle}>
        <p style={{ color: "red" }}>{productError}</p>
      </div>
    );
  }

  if (!product) {
    return <h2 style={statusTextStyle}>Product not found.</h2>;
  }

  return (
    <div style={pageContainerStyle}>
      <h2 style={pageTitleStyle}>Products Detail</h2>

      <div style={detailCardStyle}>
        <div style={imageSectionStyle}>
          {product.image && (
            <img src={product.image} alt={product.name} style={imageStyle} />
          )}
        </div>

        <div style={infoSectionStyle}>
          <p style={categoryStyle}>{product.category}</p>

          <h1 style={productNameStyle}>{product.name}</h1>

          <div style={priceRowStyle}>
            <span style={priceStyle}>
              ${Number(product.price).toFixed(2)}
            </span>

            {Number(product.stock) <= 0 && (
              <span style={stockBadgeStyle}>Out of Stock</span>
            )}
          </div>

          <p style={descriptionStyle}>{product.description}</p>

          <p style={stockTextStyle}>Stock: {product.stock}</p>

          <div style={actionRowStyle}>
            {!cartItem ? (
              <button onClick={handleAddToCart} style={primaryButtonStyle}>
                Add to Cart
              </button>
            ) : (
              <div style={qtyContainerStyle}>
                <button onClick={handleDecreaseQuantity} style={qtyButtonStyle}>
                  -
                </button>

                <span style={qtyTextStyle}>{cartItem.quantity}</span>

                <button onClick={handleIncreaseQuantity} style={qtyButtonStyle}>
                  +
                </button>
              </div>
            )}

            {isAdmin && (
              <button onClick={handleEdit} style={secondaryButtonStyle}>
                Edit
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* =======================
   Styles
======================= */

const pageContainerStyle = {
  maxWidth: "1200px",
  margin: "0 auto",
  padding: "32px 24px",
};

const pageTitleStyle = {
  fontSize: "32px",
  margin: "0 0 24px 0",
};

const statusTextStyle = {
  padding: "24px",
};

const detailCardStyle = {
  backgroundColor: "#fff",
  borderRadius: "10px",
  padding: "32px",
  display: "grid",
  gridTemplateColumns: "minmax(300px, 1.4fr) minmax(280px, 1fr)",
  gap: "48px",
  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.06)",
};

const imageSectionStyle = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const imageStyle = {
  width: "100%",
  height: "460px",
  objectFit: "cover",
  borderRadius: "8px",
};

const infoSectionStyle = {
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
};

const categoryStyle = {
  margin: "0 0 10px 0",
  color: "#6b7280",
  fontSize: "14px",
};

const productNameStyle = {
  margin: "0 0 16px 0",
  fontSize: "32px",
  lineHeight: 1.2,
};

const priceRowStyle = {
  display: "flex",
  alignItems: "center",
  gap: "12px",
  marginBottom: "20px",
};

const priceStyle = {
  fontSize: "30px",
  fontWeight: "700",
};

const stockBadgeStyle = {
  fontSize: "12px",
  color: "#dc2626",
  backgroundColor: "#fee2e2",
  padding: "4px 8px",
  borderRadius: "4px",
};

const descriptionStyle = {
  margin: "0 0 16px 0",
  color: "#6b7280",
  lineHeight: 1.6,
  fontSize: "15px",
};

const stockTextStyle = {
  margin: "0 0 24px 0",
  color: "#374151",
  fontSize: "14px",
};

const actionRowStyle = {
  display: "flex",
  alignItems: "center",
  gap: "14px",
  flexWrap: "wrap",
};

const primaryButtonStyle = {
  padding: "12px 22px",
  backgroundColor: "#6366f1",
  color: "#fff",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer",
  fontSize: "15px",
  fontWeight: "600",
};

const secondaryButtonStyle = {
  padding: "12px 22px",
  backgroundColor: "#fff",
  color: "#374151",
  border: "1px solid #d1d5db",
  borderRadius: "6px",
  cursor: "pointer",
  fontSize: "15px",
};

const qtyContainerStyle = {
  display: "flex",
  alignItems: "center",
  border: "1px solid #d1d5db",
  borderRadius: "6px",
  overflow: "hidden",
};

const qtyButtonStyle = {
  width: "40px",
  height: "40px",
  border: "none",
  backgroundColor: "#f9fafb",
  cursor: "pointer",
  fontSize: "16px",
};

const qtyTextStyle = {
  width: "44px",
  textAlign: "center",
  fontWeight: "600",
};