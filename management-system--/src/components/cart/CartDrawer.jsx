import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  closeCartDrawer,
  increaseQuantity,
  decreaseQuantity,
  removeFromCart,
} from "../../features/cart/cartSlice";
import { calculateCartTotals } from "../../utils/cartUtils";

export default function CartDrawer() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const username = "guest";

  // Right-side cart panel (quick view)
  const isDrawerOpen = useSelector((state) => state.cart.isDrawerOpen);
  const userCart =
    useSelector((state) => state.cart.cartsByUser[username]) || {
      items: [],
      promoCode: "",
      discountRate: 0,
    };

  const { subtotal, discount, shipping, tax, total } =
    calculateCartTotals(userCart);

  // Don't render if closed
  if (!isDrawerOpen) return null;
  
  // Also shows total and checkout button

  // Navigate to checkout after closing drawer
  const handleCheckout = () => {
    dispatch(closeCartDrawer());
    navigate("/checkout");
  };

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        right: 0,
        width: "320px",
        height: "100vh",
        background: "#fff",
        borderLeft: "1px solid #ccc",
        padding: "16px",
        overflowY: "auto",
        zIndex: 1000,
      }}
    >
      <button onClick={() => dispatch(closeCartDrawer())}>Close</button>
      <h2>Cart</h2>

      {userCart.items.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          {/* Show cart items + quick actions (+ / - / remove) */}
          {userCart.items.map((item) => (
            <div
              key={item.id}
              style={{ borderBottom: "1px solid #ddd", marginBottom: "12px" }}
            >
              <h4>{item.name}</h4>
              <p>${item.price}</p>
              <p>Qty: {item.quantity}</p>

              <button
                onClick={() =>
                  dispatch(decreaseQuantity({ username, productId: item.id }))
                }
              >
                -
              </button>
              <button
                onClick={() =>
                  dispatch(increaseQuantity({ username, productId: item.id }))
                }
              >
                +
              </button>
              <button
                onClick={() =>
                  dispatch(removeFromCart({ username, productId: item.id }))
                }
              >
                Remove
              </button>
            </div>
          ))}

          {/* Also shows total and checkout button */}
          <p>Subtotal: ${subtotal.toFixed(2)}</p>
          <p>Discount: -${discount.toFixed(2)}</p>
          <p>Shipping: ${shipping.toFixed(2)}</p>
          <p>Tax: ${tax.toFixed(2)}</p>
          <h3>Total: ${total.toFixed(2)}</h3>

          <button onClick={handleCheckout}>Proceed to Checkout</button>
        </>
      )}
    </div>
  );
}