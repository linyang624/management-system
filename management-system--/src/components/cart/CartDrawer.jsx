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

  const user = useSelector((state) => state.auth.user);
  const { isAuthenticated } = useSelector((state) => state.auth);
  const isDrawerOpen = useSelector((state) => state.cart.isDrawerOpen);

  const username = user?.email || "guest";

  const userCart =
    useSelector((state) => state.cart.cartsByUser[username]) || {
      items: [],
      promoCode: "",
      discountRate: 0,
      promoMessage: "",
      promoError: "",
    };

  const { subtotal, discount, tax, total } = calculateCartTotals(userCart);

  if (!isAuthenticated || !isDrawerOpen) return null;

  const handleClose = () => {
    dispatch(closeCartDrawer());
  };

  const handleCheckout = () => {
    dispatch(closeCartDrawer());
    navigate("/checkout");
  };

  const handleGoToProduct = (productId) => {
    dispatch(closeCartDrawer());
    navigate(`/products/${productId}`);
  };

  return (
    <>
      <div onClick={handleClose} style={overlayStyle} />

      <aside style={drawerStyle}>
        <div style={headerStyle}>
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

        {userCart.items.length === 0 ? (
          <div style={emptyStyle}>
            <p>Your cart is empty.</p>
          </div>
        ) : (
          <div style={contentStyle}>
            {/* Scrollable item list */}
            <div style={itemsScrollStyle}>
              {userCart.items.map((item) => (
                <div key={item.id} style={itemCardStyle}>
                  <img
                    src={item.image}
                    alt={item.name}
                    style={{ ...imageStyle, cursor: "pointer" }}
                    onClick={() => handleGoToProduct(item.id)}
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                    }}
                  />

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={itemTopRowStyle}>
                      <h4
                        style={{
                          ...itemNameStyle,
                          cursor: "pointer",
                          textDecoration: "underline",
                        }}
                        onClick={() => handleGoToProduct(item.id)}
                      >
                        {item.name}
                      </h4>

                      <p style={itemPriceStyle}>
                        ${Number(item.price).toFixed(2)}
                      </p>
                    </div>

                    <div style={itemBottomRowStyle}>
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
                </div>
              ))}
            </div>

            {/* Fixed summary + checkout button */}
            <div style={footerSummaryStyle}>
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
        )}
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
  backgroundColor: "#6366f1",
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
  padding: "16px 20px 20px",
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

const itemTopRowStyle = {
  display: "flex",
  justifyContent: "space-between",
  gap: "12px",
  alignItems: "flex-start",
  marginBottom: "14px",
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
  borderRadius: "6px",
  overflow: "hidden",
};

const qtyButtonStyle = {
  width: "36px",
  height: "36px",
  border: "none",
  backgroundColor: "#f9fafb",
  cursor: "pointer",
  fontSize: "16px",
};

const qtyTextStyle = {
  width: "40px",
  textAlign: "center",
  fontWeight: "600",
};

const removeButtonStyle = {
  background: "transparent",
  border: "none",
  color: "#6b7280",
  cursor: "pointer",
  fontSize: "13px",
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
  backgroundColor: "#6366f1",
  color: "#fff",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer",
  fontSize: "15px",
  fontWeight: "bold",
};