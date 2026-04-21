import { useDispatch, useSelector } from "react-redux";
import {
  increaseQuantity,
  decreaseQuantity,
  removeFromCart,
  clearCart,
  applyPromoCode,
  clearPromoFeedback,
} from "../features/cart/cartSlice";
import { calculateCartTotals } from "../utils/cartUtils";
import { useEffect, useState } from "react";

// Full checkout page (final review)
export default function CheckoutPage() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const username = user?.email || "guest";
  const [promoInput, setPromoInput] = useState(""); // input field

  // Clear promo message when leaving page
  useEffect(() => {
    return () => {
      dispatch(clearPromoFeedback(username));
    };
  }, [dispatch, username]);

  // Get cart data
  const userCart =
    useSelector((state) => state.cart.cartsByUser?.[username]) || {
      items: [],
      promoCode: "",
      discountRate: 0,
      promoMessage: "",
      promoError: "",
    };

  const itemCount = userCart.items.reduce((sum, item) => sum + item.quantity, 0);

  // Calculate full price breakdown
  const { subtotal, discount, shipping, tax, total } =
    calculateCartTotals(userCart);

  // Apply promo code
  const handleApplyPromo = () => {
    dispatch(applyPromoCode({ username, code: promoInput }));
  };

  const handleClearCart = () => {
    dispatch(clearCart(username));
    setPromoInput("");
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Checkout Page</h2>

      {userCart.items.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          {userCart.items.map((item) => (
            <div
              key={item.id}
              style={{
                border: "1px solid #ccc",
                padding: "12px",
                marginBottom: "12px",
              }}
            >
              <h4>{item.name}</h4>
              <p>Price: ${item.price}</p>
              <p>Quantity: {item.quantity}</p>

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

          <div style={{ marginTop: "20px" }}>
            <input
              type="text"
              placeholder="Enter promo code"
              value={promoInput}
              onChange={(e) => setPromoInput(e.target.value)}
            />
            <button onClick={handleApplyPromo}>Apply</button>
          </div>

          {userCart.promoMessage && (
            <p style={{ color: "green" }}>{userCart.promoMessage}</p>
          )}

          {userCart.promoError && (
            <p style={{ color: "red" }}>{userCart.promoError}</p>
          )}

          <p>Promo Code: {userCart.promoCode || "None"}</p>
          <p>Items: {itemCount}</p>
          <p>Subtotal: ${subtotal.toFixed(2)}</p>
          <p>Discount: -${discount.toFixed(2)}</p>
          <p>Shipping: ${shipping.toFixed(2)}</p>
          <p>Tax: ${tax.toFixed(2)}</p>
          <h3>Total: ${total.toFixed(2)}</h3>

          <button onClick={handleClearCart}>Clear Cart</button>
        </>
      )}
    </div>
  );
}