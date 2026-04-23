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
  useEffect(() => {
    const loadProduct = async () => {
      try {
        setLoadingProduct(true);
        setProductError("");

        const data = await getProductByIdApi(id);
        setProduct(data);
      } catch (error) {
        setProductError(error.message || "Failed to load product");
      } finally {
        setLoadingProduct(false);
      }
    };

    loadProduct();
  }, [id]);

  // error page
  useEffect(() => {
    async function fetchProduct() {
        try {
            const response = await fetch(`http://localhost:5001/api/products/${id}`);
            const data = await response.json();

            if (!response.ok) {
                navigate("/error", {
                    state: { message: data.message || "Product not found"},
                });
                return;
            }
            setProduct(data);
        }
        catch(error) {
            navigate("/error", {
                state: { message: "Server error, please try again later"}
            });
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
    navigate(`/admin/products/edit/${product._id}`);
  };

  if (loadingProduct) {
    return <p style={{ padding: "20px" }}>Loading product...</p>;
  }

  if (productError) {
    return (
      <div style={{ padding: "20px" }}>
        <p style={{ color: "red" }}>{productError}</p>
      </div>
    );
  }

  if (!product) {
    return <h2 style={{ padding: "20px" }}>Product not found.</h2>;
  }

  return (
    <div style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
      {product.image && (
        <img
          src={product.image}
          alt={product.name}
          style={{
            width: "100%",
            maxWidth: "500px",
            height: "300px",
            objectFit: "cover",
            borderRadius: "8px",
            marginBottom: "20px",
          }}
        />
      )}

      <h2>{product.name}</h2>
      <p>
        <strong>Price:</strong> ${product.price}
      </p>
      <p>
        <strong>Category:</strong> {product.category}
      </p>
      <p>
        <strong>Stock:</strong> {product.stock}
      </p>
      <p>{product.description}</p>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "12px",
          flexWrap: "wrap",
          marginTop: "20px",
        }}
      >
        {!cartItem ? (
          <button onClick={handleAddToCart}>Add to Cart</button>
        ) : (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
            }}
          >
            <button onClick={handleDecreaseQuantity}>-</button>
            <span>{cartItem.quantity}</span>
            <button onClick={handleIncreaseQuantity}>+</button>
          </div>
        )}

        {isAdmin && <button onClick={handleEdit}>Edit</button>}
      </div>
    </div>
  );
}