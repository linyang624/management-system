import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import Header from "./Header";
import Footer from "./Footer";
import CartDrawer from "../cart/CartDrawer";
import { closeCartDrawer } from "../../features/cart/cartSlice";

function Layout({ children }) {
  const dispatch = useDispatch();
  const location = useLocation();

  useEffect(() => {
    dispatch(closeCartDrawer());
  }, [location.pathname, dispatch]);

  return (
    <div>
      <Header />
      <CartDrawer />
      <main>{children}</main>
      <Footer />
    </div>
  );
}

export default Layout;