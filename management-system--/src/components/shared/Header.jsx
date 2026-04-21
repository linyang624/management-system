import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { openCartDrawer, closeCartDrawer } from "../../features/cart/cartSlice";
import { calculateCartTotals } from "../../utils/cartUtils";

// Top navigation bar
// Shows total cart value + toggle drawer
export default function Header() {
  const dispatch = useDispatch();
  const username = "guest";
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

  return (
    <nav style={{ display: "flex", gap: "12px", padding: "16px" }}>
      <Link to="/">Home</Link>
      <button onClick={handleCartClick}>Cart ${total.toFixed(2)}</button>
    </nav>
  );
}