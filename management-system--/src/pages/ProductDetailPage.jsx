import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import {
  addToCart,
  increaseQuantity,
  decreaseQuantity,
} from "../features/cart/cartSlice";
import products from "../mock/products";

// useDispatch() is used to send cart actions.
// useSelector() is used to get the current cart items from Redux.
// if the current product does not exist in cart, show Add to Cart
// if the current product already exists in cart, show - quantity +
// increaseQuantity adds 1
// decreaseQuantity subtracts 1
// when quantity becomes 0, the item is removed from cart

export default function ProductDetailPage() {
  const dispatch = useDispatch();
  const { id } = useParams();

  // Find the product based on the id from the URL
  const product = products.find((item) => item.id === Number(id));

  // Get cart items from Redux store
  const cartItems = useSelector((state) => state.cart.cartItems);

  // Find whether this product already exists in the cart
  const cartItem = cartItems.find((item) => item.id === Number(id));

  if (!product) {
    return <h2 style={{ padding: "20px" }}>Product not found.</h2>;
  }

  // Add product to cart for the first time
  const handleAddToCart = () => {
    dispatch(addToCart(product));
  };

  // Increase quantity by 1
  const handleIncrease = () => {
    dispatch(increaseQuantity(product.id));
  };

  // Decrease quantity by 1
  const handleDecrease = () => {
    dispatch(decreaseQuantity(product.id));
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
            marginBottom: "16px",
            borderRadius: "8px",
          }}
        />
      )}

      <p><strong>Price:</strong> ${product.price}</p>
      <p>{product.description}</p>

      {/* 
        If the product is not in cart yet:
        show Add to Cart button

        If the product is already in cart:
        show quantity controls (- quantity +)
      */}
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
          <button onClick={handleDecrease}>-</button>
          <span>{cartItem.quantity}</span>
          <button onClick={handleIncrease}>+</button>
        </div>
      )}
    </div>
  );
}