import { Link, useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { openCartDrawer, closeCartDrawer } from "../../features/cart/cartSlice";
import { logOut, clearAuthMessage } from "../../features/auth/authSlice";
import { calculateCartTotals } from "../../utils/cartUtils";
import { colors } from "../../styles/theme";
//import { FiSearch, FiShoppingCart, FiUser } from "react-icons/fi";

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

  // Toggle cart drawer open/close
  const handleCartClick = () => {
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
    <header style={headerWrapperStyle}>
      <div style={headerInnerStyle}>
        {/* Brand / Logo */}
        <Link to={homePath} style={brandStyle}>
          Management Chuwa
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
        </div>

        {/* Right side actions */}
        <div style={headerActionsStyle}>
          {!isAuthenticated ? (
            <Link to="/signin" style={linkButtonStyle}>
              Sign In
            </Link>
          ) : (
            <>
              <button onClick={handleCartClick} style={headerButtonStyle}>
                Cart ${total.toFixed(2)}
              </button>
              <button onClick={handleLogOut} style={headerButtonStyle}>
                Sign Out
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

/* =======================
   Styles
======================= */

const headerWrapperStyle = {
  backgroundColor: colors.headerBg,
  color: "#fff",
  padding: "16px 24px",
};

const headerInnerStyle = {
  maxWidth: "1200px",
  margin: "0 auto",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: "16px",
  flexWrap: "wrap",
};

const brandStyle = {
  color: "#fff",
  textDecoration: "none",
  fontSize: "32px",
  fontWeight: "700",
  whiteSpace: "nowrap",
};

const searchWrapperStyle = {
  flex: 1,
  minWidth: "260px",
  maxWidth: "520px",
};

const searchInputStyle = {
  width: "100%",
  padding: "12px 14px",
  borderRadius: "6px",
  border: "1px solid #d1d5db",
  outline: "none",
  fontSize: "15px",
  boxSizing: "border-box",
};

const headerActionsStyle = {
  display: "flex",
  alignItems: "center",
  gap: "12px",
  flexWrap: "wrap",
};

const linkButtonStyle = {
  color: "#fff",
  textDecoration: "none",
  fontSize: "16px",
  fontWeight: "500",
};

const headerButtonStyle = {
  backgroundColor: "transparent",
  border: "1px solid rgba(255, 255, 255, 0.35)",
  color: "#fff",
  borderRadius: "6px",
  padding: "10px 14px",
  cursor: "pointer",
  fontSize: "15px",
};