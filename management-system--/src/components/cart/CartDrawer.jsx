import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  closeCartDrawer,
  increaseQuantity,
  decreaseQuantity,
  removeFromCart,
  applyPromoCode,
  clearPromoFeedback,
} from "../../features/cart/cartSlice";
import { calculateCartTotals } from "../../utils/cartUtils";
import { useState, useEffect } from "react";
import "../../responsive/CartDrawer.css";

export default function CartDrawer() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const user = useSelector((state) => state.auth.user);
  const { isAuthenticated } = useSelector((state) => state.auth);
  const isDrawerOpen = useSelector((state) => state.cart.isDrawerOpen);

  const username = user?.email || "guest";

  const [promoInput, setPromoInput] = useState("");

  useEffect(() => {
    if (isDrawerOpen) {
      setPromoInput("");
      dispatch(clearPromoFeedback(username));
    }
  }, [isDrawerOpen, dispatch, username]);

  const userCart =
    useSelector((state) => state.cart.cartsByUser[username]) || {
      items: [],
      promoCode: "",
      discountRate: 0,
      promoMessage: "",
      promoError: "",
    };

  const { subtotal, discount, tax, total } = calculateCartTotals(userCart);
  const isCartEmpty = userCart.items.length === 0;

  if (!isAuthenticated || !isDrawerOpen) return null;

  const handleClose = () => {
    setPromoInput("");
    dispatch(clearPromoFeedback(username));
    dispatch(closeCartDrawer());
  };

  const handleCheckout = () => {
    setPromoInput("");
    dispatch(clearPromoFeedback(username));
    dispatch(closeCartDrawer());
    navigate("/checkout");
  };

  const handleApplyPromo = () => {
    if (isCartEmpty) return;

    dispatch(applyPromoCode({ username, code: promoInput }));
  };

  const handleGoToProduct = (productId) => {
    setPromoInput("");
    dispatch(clearPromoFeedback(username));
    dispatch(closeCartDrawer());
    navigate(`/products/${productId}`);
  };

  return (
    <>
      <div onClick={handleClose} style={overlayStyle} />

      <aside className="cart-drawer" style={drawerStyle}>
        <div className="cart-header" style={headerStyle}>
          <h2 style={{ margin: 0, color: "#fff" }}>
            Cart{" "}
            <span style={{ fontSize: "16px", fontWeight: "normal" }}>
              ({userCart.items.length})
            </span>
          </h2>

          <button onClick={handleClose} style={closeButtonStyle}>
            ×
          </button>
        </div>

        <div style={contentStyle}>
          {/* Scrollable item list */}
          <div className="cart-items-scroll" style={itemsScrollStyle}>
            {isCartEmpty ? (
              <div style={emptyStyle}>
                <p>Your cart is empty.</p>
              </div>
            ) : (
              userCart.items.map((item) => {
                const stock = Number(item.stock) || 0;
                const reachedStockLimit = item.quantity >= stock;

                return (
                  <div
                    key={item.id}
                    className="cart-item-card"
                    style={itemCardStyle}
                  >
                    <img
                      className="cart-item-image"
                      src={item.image}
                      alt={item.name}
                      style={{ ...imageStyle, cursor: "pointer" }}
                      onClick={() => handleGoToProduct(item.id)}
                      onError={(e) => {
                        e.currentTarget.style.display = "none";
                      }}
                    />

                    <div className="cart-item-info" style={itemInfoStyle}>
                      <div
                        className="cart-item-top-row"
                        style={itemTopRowStyle}
                      >
                        <h4
                          className="cart-item-name"
                          style={{
                            ...itemNameStyle,
                            cursor: "pointer",
                            textDecoration: "none",
                          }}
                          onClick={() => handleGoToProduct(item.id)}
                        >
                          {item.name}
                        </h4>

                        <p className="cart-item-price" style={itemPriceStyle}>
                          ${Number(item.price).toFixed(2)}
                        </p>
                      </div>

                      <div
                        className="cart-item-bottom-row"
                        style={itemBottomRowStyle}
                      >
                        <div style={qtyBoxStyle}>
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
                            disabled={reachedStockLimit}
                            style={
                              reachedStockLimit
                                ? disabledQtyButtonStyle
                                : qtyButtonStyle
                            }
                            title={
                              reachedStockLimit
                                ? "You have reached the stock limit"
                                : ""
                            }
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
                  </div>
                );
              })
            )}
          </div>

          {/* Fixed promo + summary + checkout button */}
          <div className="cart-promo-section" style={promoSectionStyle}>
            <label style={promoLabelStyle}>Apply Discount Code</label>

            <div className="cart-promo-row" style={promoRowStyle}>
              <input
                type="text"
                placeholder="20 DOLLAR OFF"
                value={promoInput}
                onChange={(e) => setPromoInput(e.target.value)}
                style={promoInputStyle}
              />

              <button
                onClick={handleApplyPromo}
                disabled={isCartEmpty}
                style={isCartEmpty ? disabledPromoButtonStyle : promoButtonStyle}
              >
                Apply
              </button>
            </div>

            {userCart.promoMessage && (
              <p style={promoSuccessStyle}>{userCart.promoMessage}</p>
            )}

            {userCart.promoError && (
              <p style={promoErrorStyle}>{userCart.promoError}</p>
            )}
          </div>

          <div className="cart-footer-summary" style={footerSummaryStyle}>
            <div style={summaryRowStyle}>
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>

            <div style={summaryRowStyle}>
              <span>Tax</span>
              <span>${tax.toFixed(2)}</span>
            </div>

            <div style={summaryRowStyle}>
              <span>Discount</span>
              <span>- ${discount.toFixed(2)}</span>
            </div>

            <div style={totalRowStyle}>
              <span>Estimated total</span>
              <span>${total.toFixed(2)}</span>
            </div>

            <button onClick={handleCheckout} style={checkoutButtonStyle}>
              Continue to checkout
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}

const overlayStyle = {
  position: "fixed",
  inset: 0,
  backgroundColor: "rgba(0, 0, 0, 0.45)",
  zIndex: 999,
};

const drawerStyle = {
  position: "fixed",
  top: "0",
  right: "0",
  width: "420px",
  maxWidth: "calc(100vw - 48px)",
  height: "80vh",
  backgroundColor: "#fff",
  zIndex: 1000,
  display: "flex",
  flexDirection: "column",
  boxShadow: "0 8px 24px rgba(0, 0, 0, 0.22)",
  borderRadius: "8px",
  overflow: "hidden",
};

const headerStyle = {
  backgroundColor: "#4f46e5",
  color: "#fff",
  padding: "20px 24px",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
};

const closeButtonStyle = {
  background: "transparent",
  border: "none",
  color: "#fff",
  fontSize: "32px",
  cursor: "pointer",
  lineHeight: 1,
};

const emptyStyle = {
  padding: "24px",
  backgroundColor: "#fff",
};

const contentStyle = {
  flex: 1,
  display: "flex",
  flexDirection: "column",
  minHeight: 0,
};

const itemsScrollStyle = {
  flex: 1,
  padding: "16px 20px",
  overflowY: "auto",
  minHeight: 0,
};

const footerSummaryStyle = {
  padding: "20px 32px 24px",
  borderTop: "1px solid #e5e7eb",
  backgroundColor: "#fff",
};

const itemCardStyle = {
  display: "flex",
  gap: "14px",
  padding: "14px 0",
  borderBottom: "1px solid #e5e7eb",
};

const imageStyle = {
  width: "82px",
  height: "82px",
  objectFit: "cover",
  borderRadius: "6px",
  flexShrink: 0,
  backgroundColor: "#f3f4f6",
};

const itemInfoStyle = {
  flex: 1,
  minWidth: 0,
  height: "82px",
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
};

const itemTopRowStyle = {
  display: "flex",
  justifyContent: "space-between",
  gap: "12px",
  alignItems: "flex-start",
  marginBottom: 0,
};

const itemNameStyle = {
  margin: 0,
  fontSize: "16px",
  fontWeight: "600",
};

const itemPriceStyle = {
  margin: 0,
  color: "#4f46e5",
  fontWeight: "bold",
  whiteSpace: "nowrap",
};

const itemBottomRowStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: "12px",
};

const qtyBoxStyle = {
  display: "inline-flex",
  alignItems: "center",
  width: "fit-content",
  border: "1px solid #d1d5db",
  borderRadius: "4px",
  overflow: "hidden",
};

const qtyButtonStyle = {
  width: "22px",
  height: "22px",
  border: "none",
  backgroundColor: "#f9fafb",
  cursor: "pointer",
  fontSize: "16px",
};

const disabledQtyButtonStyle = {
  ...qtyButtonStyle,
  backgroundColor: "#e5e7eb",
  color: "#9ca3af",
  cursor: "not-allowed",
};

const qtyTextStyle = {
  width: "24px",
  height: "20px",
  lineHeight: "20px",
  textAlign: "center",
  fontWeight: "500",
  fontSize: "13px",
};

const removeButtonStyle = {
  background: "transparent",
  border: "none",
  color: "#6b7280",
  cursor: "pointer",
  fontSize: "13px",
  textDecoration: "underline",
  fontFamily: "Arial, sans-serif",
};

const summaryRowStyle = {
  display: "flex",
  justifyContent: "space-between",
  marginBottom: "10px",
  fontSize: "15px",
};

const totalRowStyle = {
  display: "flex",
  justifyContent: "space-between",
  marginTop: "14px",
  fontWeight: "bold",
  fontSize: "18px",
};

const checkoutButtonStyle = {
  marginTop: "18px",
  width: "100%",
  padding: "14px 16px",
  backgroundColor: "#4f46e5",
  color: "#fff",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer",
  fontSize: "15px",
  fontWeight: "bold",
};

const promoSectionStyle = {
  marginTop: "20px",
  marginBottom: "18px",
  padding: "0 24px",
  width: "100%",
  boxSizing: "border-box",
};

const promoLabelStyle = {
  display: "block",
  marginBottom: "8px",
  fontSize: "14px",
  fontWeight: "600",
  color: "#6b7280",
};

const promoRowStyle = {
  display: "grid",
  gridTemplateColumns: "1fr auto",
  gap: "12px",
  width: "100%",
  boxSizing: "border-box",
};

const promoInputStyle = {
  width: "100%",
  minWidth: 0,
  padding: "12px",
  border: "1px solid #d1d5db",
  borderRadius: "6px",
  fontSize: "14px",
  boxSizing: "border-box",
};

const promoButtonStyle = {
  padding: "12px 18px",
  backgroundColor: "#4f46e5",
  color: "#fff",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer",
  fontWeight: "600",
  whiteSpace: "nowrap",
};

const disabledPromoButtonStyle = {
  ...promoButtonStyle,
  backgroundColor: "#e5e7eb",
  color: "#9ca3af",
  cursor: "not-allowed",
};

const promoSuccessStyle = {
  margin: "8px 0 0 0",
  color: "green",
  fontSize: "13px",
};

const promoErrorStyle = {
  margin: "8px 0 0 0",
  color: "red",
  fontSize: "13px",
};