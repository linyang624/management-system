import { useDispatch, useSelector } from "react-redux";
import {
  addToCart,
  increaseQuantity,
  decreaseQuantity,
} from "../features/cart/cartSlice";
import products from "../mock/products";
import { useParams, useNavigate } from "react-router-dom";

// Product detail page
// Shows one product and allows:
// - Add to Cart if not in cart
// - quantity controls if already in cart

export default function ProductDetailPage() {
  const dispatch = useDispatch();
  const { id } = useParams();
  const navigate = useNavigate();

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

  // Find product by URL id
  const product = products.find((item) => item.id === Number(id));

  if (!product) {
    return <h2 style={{ padding: "20px" }}>Product not found.</h2>;
  }

  // Check whether this product already exists in cart
  const cartItem = userCart.items.find((item) => item.id === product.id);

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      alert("Please sign in first.");
      navigate("/signin");
      return;
    }

    dispatch(addToCart({ username, product }));
  };

  const handleIncreaseQuantity = () => {
    if (!isAuthenticated) {
      alert("Please sign in first.");
      navigate("/signin");
      return;
    }

    dispatch(increaseQuantity({ username, productId: product.id }));
  };

  const handleDecreaseQuantity = () => {
    if (!isAuthenticated) {
      alert("Please sign in first.");
      navigate("/signin");
      return;
    }

    dispatch(decreaseQuantity({ username, productId: product.id }));
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>{product.name}</h2>

      {product.image && (
        <img
          src={product.image}
          alt={product.name}
          style={{
            width: "300px",
            maxWidth: "100%",
            borderRadius: "8px",
            marginBottom: "16px",
          }}
        />
      )}

      <p>
        <strong>Price:</strong> ${product.price}
      </p>
      <p>{product.description}</p>

      {!cartItem ? (
        <button onClick={handleAddToCart}>Add to Cart</button>
      ) : (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            marginTop: "12px",
          }}
        >
          <button onClick={handleDecreaseQuantity}>-</button>
          <span>{cartItem.quantity}</span>
          <button onClick={handleIncreaseQuantity}>+</button>
        </div>
      )}
    </div>
  );
}