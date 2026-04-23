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
import { useNavigate } from "react-router-dom";

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

  const navigate = useNavigate();

  const handleGoToProduct = (productId) => {
    navigate(`/products/${productId}`);
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
                display: "flex",
                gap: "16px",
                alignItems: "flex-start",
              }}
            >
              <img
                src={item.image}
                alt={item.name}
                onClick={() => handleGoToProduct(item.id)}
                style={{
                  width: "96px",
                  height: "96px",
                  objectFit: "cover",
                  borderRadius: "8px",
                  border: "1px solid #ddd",
                  flexShrink: 0,
                  cursor: "pointer",
                }}
              />

              <div style={{ flex: 1 }}>
                <h4
                  onClick={() => handleGoToProduct(item.id)}
                  style={{
                    margin: "0 0 8px 0",
                    cursor: "pointer",
                    textDecoration: "underline",
                  }}
                >
                  {item.name}
                </h4>
                <p style={{ margin: "0 0 8px 0" }}>
                  Price: ${Number(item.price).toFixed(2)}
                </p>
                <p style={{ margin: "0 0 12px 0" }}>Quantity: {item.quantity}</p>

                <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
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
              </div>
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
          {/* <p>Shipping: ${shipping.toFixed(2)}</p> */}
          <p>Tax: ${tax.toFixed(2)}</p>
          <h3>Total: ${total.toFixed(2)}</h3>

          <button onClick={handleClearCart}>Clear Cart</button>
        </>
      )}
    </div>
  );
}