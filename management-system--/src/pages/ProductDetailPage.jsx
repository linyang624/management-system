import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { addToCart, openCartDrawer } from "../features/cart/cartSlice";
import products from "../mock/products";

// Shows a single product based on URL id
export default function ProductDetailPage() {
  const dispatch = useDispatch();
  const { id } = useParams(); // get id from URL
  const user = useSelector((state) => state.auth.user);
  const username = user?.email || "guest";
  // Find product by id
  const product = products.find((item) => item.id === Number(id));

  if (!product) {
    return <h2 style={{ padding: "20px" }}>Product not found.</h2>;
  }
  // Add current product to cart
  const handleAddToCart = () => {
    dispatch(addToCart({ username, product }));
    // dispatch(openCartDrawer());
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>{product.name}</h2>
      <p>Price: ${product.price}</p>
      <p>{product.description}</p>
      <button onClick={handleAddToCart}>Add to Cart</button>
    </div>
  );
}