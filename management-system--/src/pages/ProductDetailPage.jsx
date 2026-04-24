import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import {
  addToCart,
  increaseQuantity,
  decreaseQuantity,
} from "../features/cart/cartSlice";
import { getProductByIdApi } from "../api/productApi";
import "../responsive/ProductDetailPage.css";

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
    if (Number(product.stock) <= 0) {        
        return;
    }

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
    <div className="product-detail-card" style={pageContainerStyle}>
      <h2 className="product-detail-title" style={pageTitleStyle}>Products Detail</h2>

      <div className="product-detail-card" style={detailCardStyle}>
        <div className="product-detail-image-section" style={imageSectionStyle}>
          {product.image && (
            <img className="product-detail-image" src={product.image} alt={product.name} style={imageStyle} />
          )}
        </div>

        <div className="product-detail-info" style={infoSectionStyle}>
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

          {/* <p style={stockTextStyle}>Stock: {product.stock}</p> */}

          <div className="product-detail-actions" style={actionRowStyle}>
            {!cartItem ? (
              <button 
                onClick={handleAddToCart} 
                disabled={Number(product.stock) <= 0}
                style={{
                    ...primaryButtonStyle,
                    ...(Number(product.stock) <= 0 ? disabledPrimaryButtonStyle : {}),
                }}
                >
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
  maxWidth: "1320px",
  margin: "0 auto",
  padding: "48px 32px 28px",
  fontFamily: "Arial, sans-serif",
  boxSizing: "border-box",
};

const pageTitleStyle = {
  fontSize: "28px",
  margin: "0 0 32px 0",
  fontWeight: "700",
  color: "#111827",
  fontFamily: "Arial, sans-serif",
};

const statusTextStyle = {
  padding: "24px",
};

const detailCardStyle = {
  backgroundColor: "#fff",
  borderRadius: "0",
  padding: "36px 40px",
  display: "grid",
  gridTemplateColumns: "minmax(520px, 1.25fr) minmax(360px, 0.9fr)",
  gap: "56px",
  boxSizing: "border-box",
};

const imageSectionStyle = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const imageStyle = {
  width: "100%",
  height: "560px",
  objectFit: "cover",
  borderRadius: "0",
};

const infoSectionStyle = {
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  paddingRight: "32px",
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
  color: "#3f3f46ec",
  fontWeight: "700",
  fontFamily: "Arial, sans-serif",
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

// const stockTextStyle = {
//   margin: "0 0 24px 0",
//   color: "#374151",
//   fontSize: "14px",
// };

const actionRowStyle = {
  display: "flex",
  alignItems: "center",
  gap: "18px",
  flexWrap: "wrap",
};

const primaryButtonStyle = {
  width: "120px",
  height: "40px",
  padding: 0,
  backgroundColor: "#4f46e5",
  color: "#fff",
  border: "1px solid #4f46e5",
  borderRadius: "4px",
  cursor: "pointer",
  fontSize: "13px",
  fontWeight: "700",
  fontFamily: "Arial, sans-serif",
  boxSizing: "border-box",
};

const secondaryButtonStyle = {
  width: "120px",
  height: "40px",
  padding: 0,
  backgroundColor: "#fff",
  color: "#374151",
  border: "1px solid #d1d5db",
  borderRadius: "4px",
  cursor: "pointer",
  fontSize: "13px",
  fontWeight: "500",
  fontFamily: "Arial, sans-serif",
  boxSizing: "border-box",
};

const qtyContainerStyle = {
  width: "120px",
  display: "flex",
  alignItems: "center",
  height: "40px",
  backgroundColor: "#4f46e5",
  borderRadius: "4px",
  overflow: "hidden",
};

const qtyButtonStyle = {
  flex: 1,
  height: "40px",
  border: "1px solid #4f46e5",
  backgroundColor: "#4f46e5",
  color: "#fff",
  cursor: "pointer",
  fontSize: "14px",
  fontWeight: "500",
  fontFamily: "Arial, sans-serif",
  boxSizing: "border-box",
};

const qtyTextStyle = {
  flex: 1,
  height: "40px",
  lineHeight: "40px",
  textAlign: "center",
  backgroundColor: "#4f46e5",
  color: "#fff",
  fontSize: "13px",
  fontWeight: "500",
  fontFamily: "Arial, sans-serif",
};

const disabledPrimaryButtonStyle = {
  backgroundColor: "#9ca3af",
  borderColor: "#9ca3af",
  cursor: "not-allowed",
};