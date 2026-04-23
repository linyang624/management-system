import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import Header from "./Header";
import Footer from "./Footer";
import CartDrawer from "../cart/CartDrawer";
import { closeCartDrawer } from "../../features/cart/cartSlice";
import { colors } from "../../styles/theme";

// Shared page layout
// Wraps header, main content, cart drawer, and footer
function Layout({ children }) {
  const dispatch = useDispatch();
  const location = useLocation();

  // Auto close cart drawer when route changes
  useEffect(() => {
    dispatch(closeCartDrawer());
  }, [location.pathname, dispatch]);

  return (
    <div style={pageShellStyle}>
      {/* Top navigation */}
      <Header />

      {/* Global cart drawer */}
      <CartDrawer />

      {/* Main page content */}
      <main style={mainStyle}>
        <div style={contentWrapperStyle}>{children}</div>
      </main>

      {/* Bottom footer */}
      <Footer />
    </div>
  );
}

export default Layout;

/* =======================
   Styles
======================= */

const pageShellStyle = {
  minHeight: "100vh",
  backgroundColor: colors.pageBg,
  display: "flex",
  flexDirection: "column",
};

const mainStyle = {
  flex: 1,
  width: "100%",
};

const contentWrapperStyle = {
  width: "100%",
  minHeight: "100%",
};