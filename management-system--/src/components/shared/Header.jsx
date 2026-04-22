import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { openCartDrawer, closeCartDrawer } from "../../features/cart/cartSlice";
import { logOut, clearAuthMessage } from "../../features/auth/authSlice";
import { calculateCartTotals } from "../../utils/cartUtils";

// Top navigation bar
// Shows total cart value + toggle drawer
export default function Header() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const username = user?.email || "guest";
  const isDrawerOpen = useSelector((state) => state.cart.isDrawerOpen);

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
    dispatch(clearAuthMessage());
    await dispatch(logOut());
    navigate("/signin");
  };

  return (
    <header style={{ display: "flex", gap: "12px", padding: "16px" }}>
      <Link to="/products">Management Chuwa</Link>

      {!isAuthenticated ? (
        <Link to="/signin">Sign In</Link>
      ) : (
        <>
          {/* <Link to="/products">Management Chuwa</Link> */}
          <button onClick={handleCartClick}>Cart ${total.toFixed(2)}</button>
          <button onClick={handleLogOut}>Sign Out</button>
        </>
      )}
    </header>
  );
}