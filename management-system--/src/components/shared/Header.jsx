import { Link, useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { openCartDrawer, closeCartDrawer } from "../../features/cart/cartSlice";
import { logOut, clearAuthMessage } from "../../features/auth/authSlice";
import { calculateCartTotals } from "../../utils/cartUtils";
import { colors } from "../../styles/theme";
import { FiSearch, FiShoppingCart, FiUser } from "react-icons/fi";
import { FaStar } from "react-icons/fa";

// Top navigation bar
// Shows total cart value + toggle drawer
export default function Header() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const username = user?.email || "guest";
  const isDrawerOpen = useSelector((state) => state.cart.isDrawerOpen);

  // Header search keyword
  const [keyword, setKeyword] = useState("");

  // Responsive with Mobile
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => {
        setIsMobile(window.innerWidth <= 768);
    };
    window.addEventListener("resize", handleResize);
    return () => {
        window.removeEventListener("resize", handleResize);
    };
  }, []);

  // Keep header input in sync with URL keyword
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const currentKeyword = params.get("keyword") || "";
    setKeyword(currentKeyword);
  }, [location.search]);

  // Get current user's cart
  const userCart =
    useSelector((state) => state.cart.cartsByUser[username]) || {
      items: [],
      promoCode: "",
      discountRate: 0,
    };

  // Calculate total price
  const { total } = calculateCartTotals(userCart);

  // Show the total products number amount in cart
  const cartItemCount = userCart.items.reduce((sum, item) => sum + item.quantity, 0);

  // add cart message: ?Auth
  const [showLoginCartModal, setShowLoginCartModal] = useState(false);

  // Toggle cart drawer open/close
  const handleCartClick = () => {
    //cart message
    if (!isAuthenticated) {
        setShowLoginCartModal(true);
        return;
    }

    if (isDrawerOpen) {
      dispatch(closeCartDrawer());
    } else {
      dispatch(openCartDrawer());
    }
  };

  const handleLogOut = async () => {
    dispatch(closeCartDrawer());
    dispatch(clearAuthMessage());
    const resultAction = await dispatch(logOut());

    if (logOut.fulfilled.match(resultAction)) {
      if (location.pathname.startsWith("/admin")) {
        navigate("/products");
      }
      //navigate("/signin");
    }
  };

  // Update search keyword and navigate automatically
  const handleSearchChange = (e) => {
    const nextValue = e.target.value;
    setKeyword(nextValue);

    const trimmedValue = nextValue.trim();

    if (trimmedValue) {
      navigate(`/products?keyword=${encodeURIComponent(trimmedValue)}`);
    } else {
      navigate("/products");
    }
  };

  // homePath
  const homePath =
    isAuthenticated && user?.role === "admin" ? "/admin/products" : "/products";

  return (
    <>
    <header style={headerWrapperStyle}>
      <div style={headerInnerStyle}>
        {/* Brand / Logo */}
        <Link to={homePath} style={brandStyle}>
          <span style={isMobile ? brandMobileMainStyle : brandMainStyle}>{isMobile ? "M" : "Management"}</span>
          <span style={brandSubStyle}>Chuwa</span>
        </Link>

        {/* Search bar */}
        <div style={searchWrapperStyle}>
          <input
            type="text"
            placeholder="Search"
            value={keyword}
            onChange={handleSearchChange}
            style={searchInputStyle}
          />
          <FiSearch style={searchIconStyle} />
        </div>

        {/* Right side actions */}
        <div style={headerActionsStyle}>
          {!isAuthenticated ? (
            <>
                <Link to="/signin" style={signInLinkStyle}>
                    <FiUser style={userIconStyle} />
                    Sign In
                </Link>       

                <button onClick={handleCartClick} style={cartButtonStyle}>
                    <FiShoppingCart style={cartIconStyle} />
                </button>

            </>
          ) : (
            <>
              <div style={userStatusStyle}>
                <div style={userIconWrapperStyle}>
                    <FiUser style={userIconStyle} />
                    <FaStar style={starIconStyle} />
                </div>

                <button onClick={handleLogOut} style={logoutButtonStyle}>
                    Sign Out
                </button>
              </div>
              
                <button onClick={handleCartClick} style={cartButtonStyle}>
                    <div style={cartIconWrapperStyle}>
                        <FiShoppingCart style={cartIconStyle} />
                        {cartItemCount > 0 && (<span style={cartBadgeStyle}>{cartItemCount}</span>)}
                    </div>                    
                    <span>${total.toFixed(2)}</span>
              </button>

            </>            
          )}
        </div>
      </div>
    </header>
    
    {showLoginCartModal && (
        <div style={modalOverlayStyle}>
            <div style={loginModalStyle}>
                <button
                    type="button"
                    onClick={() => setShowLoginCartModal(false)}
                    style={modalCloseButtonStyle}
                >
                    ×
                </button>

                <h3 style={modalTitleStyle}>Please sign in first</h3>

                <p style={modalTextStyle}>
                    You need to sign in before viewing your shopping cart.
                </p>

                <button
                    type="button"
                    onClick={() => {
                        setShowLoginCartModal(false);
                        navigate("/signin");
                    }}
                    style={modalSignInButtonStyle}
                >
                    Sign In
                </button>
            </div>
        </div>
    )}
    </>
  );
}

/* =======================
   Styles
======================= */

const headerWrapperStyle = {
  backgroundColor: colors.headerBg,
  color: "#fff",
  //padding: "16px 24px",
  height: "58px",
  fontFamily: "Arial, Helvetica, sans-serif",
};

const headerInnerStyle = {
  width: "100%",
  maxWidth: "90%",
  margin: "0 auto",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: "16px",
  flexWrap: "wrap",
  height: "100%"
};

const brandStyle = {
  color: "#fff",
  textDecoration: "none",
  //fontSize: "32px",
  //fontWeight: "700",
  whiteSpace: "nowrap",
  fontFamily: "Arial, Helvetica, sans-serif",
  display: "flex",
  alignItems: "baseline",
  gap: "3px",
};

const brandMainStyle = {
  fontSize: "32px",
  fontWeight: "700",
  lineHeight: "1",
};

const brandSubStyle = {
  fontSize: "14px",
  fontWeight: "500",
  lineHeight: "1",
};

const brandMobileMainStyle = {
  fontSize: "30px",
  fontWeight: "700",
  lineHeight: "1",
};

const searchWrapperStyle = {
  flex: 1,
  minWidth: "260px",
  maxWidth: "520px",
  position: "relative",
};

const searchInputStyle = {
  width: "100%",
  padding: "12px 14px 12px 14px",
  borderRadius: "6px",
  border: "1px solid #d1d5db",
  outline: "none",
  fontSize: "15px",
  boxSizing: "border-box",
  fontFamily: "Arial, Helvetica, sans-serif",
};

const searchIconStyle = {
  position: "absolute",
  right: "14px",
  top: "50%",
  transform: "translateY(-50%)",
  color: "#8a8a8a",
  fontSize: "24px",
  pointerEvents: "none",
};

const headerActionsStyle = {
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  gap: "36px",
  flexWrap: "nowrap",
  minWidth: "280px",
};

// const linkButtonStyle = {
//   color: "#fff",
//   textDecoration: "none",
//   fontSize: "16px",
//   fontWeight: "700",
//   fontFamily: "Arial, Helvetica, sans-serif",
// };

// const headerButtonStyle = {
//   backgroundColor: "transparent",
//   border: "1px solid rgba(255, 255, 255, 0.35)",
//   color: "#fff",
//   borderRadius: "6px",
//   padding: "10px 14px",
//   cursor: "pointer",
//   fontSize: "15px",
// };

const signInLinkStyle = {
  color: "#fff",
  textDecoration: "none",
  fontSize: "16px",
  fontWeight: "500",
  fontFamily: "Arial, Helvetica, sans-serif",
  display: "flex",
  alignItems: "center",
  gap: "10px",
};

const userIconStyle = {
  fontSize: "28px",
  color: "#fff",
};

const userStatusStyle = {
  display: "flex",
  alignItems: "center",
  gap: "14px",
};

const userIconWrapperStyle = {
  position: "relative",
  width: "30px",
  height: "30px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const starIconStyle = {
  position: "absolute",
  right: "-4px",
  bottom: "-3px",
  fontSize: "14px",
  color: "#facc15",
};

const logoutButtonStyle = {
  backgroundColor: "transparent",
  border: "none",
  color: "#fff",
  cursor: "pointer",
  fontSize: "18px",
  fontWeight: "500",
  fontFamily: "Arial, Helvetica, sans-serif",
  padding: 0,
};

const cartButtonStyle = {
  backgroundColor: "transparent",
  border: "none",
  color: "#fff",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  gap: "14px",
  fontSize: "18px",
  fontWeight: "500",
  fontFamily: "Arial, Helvetica, sans-serif",
  padding: 0,
  whiteSpace: "nowrap",
};

const cartIconStyle = {
  fontSize: "25px",
  color: "#fff",
};

const cartIconWrapperStyle = {
  position: "relative",
  width: "34px",
  height: "34px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const cartBadgeStyle = {
  position: "absolute",
  top: "-7px",
  right: "-8px",
  minWidth: "16px",
  height: "16px",
  padding: "0 4px",
  borderRadius: "999px",
  backgroundColor: "#ef4444",
  color: "#fff",
  fontSize: "11px",
  fontWeight: "700",
  lineHeight: "16px",
  textAlign: "center",
  fontFamily: "Arial, Helvetica, sans-serif",
};

const modalOverlayStyle = {
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: "rgba(0, 0, 0, 0.35)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 999,
};

const loginModalStyle = {
  position: "relative",
  width: "360px",
  maxWidth: "calc(100% - 40px)",
  backgroundColor: "#fff",
  borderRadius: "12px",
  padding: "32px 28px 28px",
  boxShadow: "0 12px 30px rgba(0, 0, 0, 0.18)",
  textAlign: "center",
  fontFamily: "Arial, Helvetica, sans-serif",
};

const modalCloseButtonStyle = {
  position: "absolute",
  top: "12px",
  right: "14px",
  backgroundColor: "transparent",
  border: "none",
  fontSize: "26px",
  lineHeight: "1",
  cursor: "pointer",
  color: "#6b7280",
};

const modalTitleStyle = {
  margin: "0 0 12px",
  fontSize: "22px",
  fontWeight: "700",
  color: "#111827",
};

const modalTextStyle = {
  margin: "0 0 24px",
  fontSize: "15px",
  lineHeight: "1.5",
  color: "#6b7280",
};

const modalSignInButtonStyle = {
  width: "100%",
  height: "44px",
  border: "none",
  borderRadius: "6px",
  backgroundColor: colors.headerBg,
  color: "#fff",
  fontSize: "16px",
  fontWeight: "700",
  fontFamily: "Arial, Helvetica, sans-serif",
  cursor: "pointer",
};