import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { openCartDrawer, closeCartDrawer } from "../../features/cart/cartSlice";
import { calculateCartTotals } from "../../utils/cartUtils";

export default function Header() {
  const dispatch = useDispatch();
  const username = "guest";

  const isDrawerOpen = useSelector((state) => state.cart.isDrawerOpen);

  const userCart =
    useSelector((state) => state.cart.cartsByUser[username]) || {
      items: [],
      promoCode: "",
      discountRate: 0,
    };

  const { total } = calculateCartTotals(userCart);

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