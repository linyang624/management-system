import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import products from "../mock/products";
import {
  addToCart,
  increaseQuantity,
  decreaseQuantity,
} from "../features/cart/cartSlice";

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

  // Find product by id
  const product = products.find((item) => item.id === Number(id));

  if (!product) {
    return <h2 style={{ padding: "20px" }}>Product not found.</h2>;
  }

  // Check whether this product is already in cart
  const cartItem = userCart.items.find((item) => item.id === product.id);

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