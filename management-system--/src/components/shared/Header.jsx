import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

export default function Header() {
  const cartItems = useSelector((state) => state.cart.cartItems);

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <nav style={{ display: "flex", gap: "12px", padding: "16px" }}>
      <Link to="/">Home</Link>
      <Link to="/cart">Cart ({cartCount})</Link>
      <Link to="/signin">Sign In</Link>
    </nav>
  );
}