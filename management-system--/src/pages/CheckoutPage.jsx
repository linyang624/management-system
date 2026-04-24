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
  const [promoInput, setPromoInput] = useState("");

  useEffect(() => {
    return () => {
      dispatch(clearPromoFeedback(username));
    };
  }, [dispatch, username]);

  const userCart =
    useSelector((state) => state.cart.cartsByUser?.[username]) || {
      items: [],
      promoCode: "",
      discountRate: 0,
      promoMessage: "",
      promoError: "",
    };

  const itemCount = userCart.items.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  const { subtotal, discount, tax, total } =
    calculateCartTotals(userCart);

  const navigate = useNavigate();

  const handleApplyPromo = () => {
    dispatch(applyPromoCode({ username, code: promoInput }));
  };

  const handleClearCart = () => {
    dispatch(clearCart(username));
    setPromoInput("");
  };

  const handleGoToProduct = (productId) => {
    navigate(`/products/${productId}`);
  };

  return (
    <div style={pageContainerStyle}>
      <h2 style={pageTitleStyle}>Checkout</h2>

      {userCart.items.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <div style={layoutStyle}>
          {/* LEFT: Items */}
          <div>
            {userCart.items.map((item) => (
              <div key={item.id} style={itemCardStyle}>
                <img
                  src={item.image}
                  alt={item.name}
                  onClick={() => handleGoToProduct(item.id)}
                  style={imageStyle}
                />

                <div style={{ flex: 1 }}>
                  <h4
                    onClick={() => handleGoToProduct(item.id)}
                    style={itemNameStyle}
                  >
                    {item.name}
                  </h4>

                  <p style={priceStyle}>
                    ${Number(item.price).toFixed(2)}
                  </p>

                  <div style={qtyContainerStyle}>
                    <button
                      onClick={() =>
                        dispatch(
                          decreaseQuantity({
                            username,
                            productId: item.id,
                          })
                        )
                      }
                      style={qtyButtonStyle}
                    >
                      -
                    </button>

                    <span style={qtyTextStyle}>{item.quantity}</span>

                    <button
                      onClick={() =>
                        dispatch(
                          increaseQuantity({
                            username,
                            productId: item.id,
                          })
                        )
                      }
                      style={qtyButtonStyle}
                    >
                      +
                    </button>
                  </div>

                  <button
                    onClick={() =>
                      dispatch(
                        removeFromCart({
                          username,
                          productId: item.id,
                        })
                      )
                    }
                    style={removeButtonStyle}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* RIGHT: Summary */}
          <div style={summaryCardStyle}>
            <h3>Order Summary</h3>

            <div style={summaryRowStyle}>
              <span>Items ({itemCount})</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>

            <div style={summaryRowStyle}>
              <span>Discount</span>
              <span>-${discount.toFixed(2)}</span>
            </div>

            <div style={summaryRowStyle}>
              <span>Tax</span>
              <span>${tax.toFixed(2)}</span>
            </div>

            <div style={totalRowStyle}>
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>

            <div style={promoRowStyle}>
              <input
                type="text"
                placeholder="Promo code"
                value={promoInput}
                onChange={(e) => setPromoInput(e.target.value)}
                style={promoInputStyle}
              />
              <button
                onClick={handleApplyPromo}
                style={secondaryButtonStyle}
              >
                Apply
              </button>
            </div>

            {userCart.promoMessage && (
              <p style={{ color: "green" }}>{userCart.promoMessage}</p>
            )}

            {userCart.promoError && (
              <p style={{ color: "red" }}>{userCart.promoError}</p>
            )}

            <button style={primaryButtonStyle}>
              Place Order
            </button>

            <button onClick={handleClearCart} style={clearButtonStyle}>
              Clear Cart
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/* =======================
   Styles
======================= */

const pageContainerStyle = {
  maxWidth: "1200px",
  margin: "0 auto",
  padding: "24px",
};

const pageTitleStyle = {
  fontSize: "32px",
  marginBottom: "24px",
};

const layoutStyle = {
  display: "grid",
  gridTemplateColumns: "2fr 1fr",
  gap: "40px",
};

const itemCardStyle = {
  display: "flex",
  gap: "16px",
  padding: "16px",
  border: "1px solid #e5e7eb",
  borderRadius: "10px",
  marginBottom: "16px",
  backgroundColor: "#fff",
};

const imageStyle = {
  width: "100px",
  height: "100px",
  objectFit: "cover",
  borderRadius: "8px",
  cursor: "pointer",
};

const itemNameStyle = {
  margin: "0 0 8px 0",
  cursor: "pointer",
  fontWeight: "600",
};

const priceStyle = {
  margin: "0 0 12px 0",
  color: "#4f46e5",
  fontWeight: "600",
};

const qtyContainerStyle = {
  display: "inline-flex",
  alignItems: "center",
  width: "fit-content",
  border: "1px solid #d1d5db",
  borderRadius: "6px",
  overflow: "hidden",
  marginBottom: "12px",
};

const qtyButtonStyle = {
  width: "36px",
  height: "36px",
  border: "none",
  backgroundColor: "#f9fafb",
  cursor: "pointer",
};

const qtyTextStyle = {
  width: "40px",
  textAlign: "center",
  fontWeight: "600",
};

const removeButtonStyle = {
  background: "transparent",
  marginLeft: "20px",
  border: "none",
  color: "#6b7280",
  cursor: "pointer",
};

const summaryCardStyle = {
  padding: "20px",
  border: "1px solid #e5e7eb",
  borderRadius: "10px",
  backgroundColor: "#fff",
};

const summaryRowStyle = {
  display: "flex",
  justifyContent: "space-between",
  marginBottom: "10px",
};

const totalRowStyle = {
  display: "flex",
  justifyContent: "space-between",
  marginTop: "16px",
  fontWeight: "bold",
  fontSize: "18px",
};

const promoRowStyle = {
  display: "flex",
  gap: "8px",
  marginTop: "20px",
};

const promoInputStyle = {
  flex: 1,
  padding: "10px",
  border: "1px solid #d1d5db",
  borderRadius: "6px",
};

const primaryButtonStyle = {
  marginTop: "20px",
  width: "100%",
  padding: "12px",
  backgroundColor: "#6366f1",
  color: "#fff",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer",
};

const secondaryButtonStyle = {
  padding: "10px 14px",
  border: "1px solid #d1d5db",
  borderRadius: "6px",
  backgroundColor: "#fff",
  cursor: "pointer",
};

const clearButtonStyle = {
  marginTop: "12px",
  width: "100%",
  padding: "10px",
  backgroundColor: "#fff",
  border: "1px solid #d1d5db",
  borderRadius: "6px",
  cursor: "pointer",
};