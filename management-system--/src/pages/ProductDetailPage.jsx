import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { addToCart } from "../features/cart/cartSlice";
import products from "../mock/products";

export default function ProductDetailPage() {
  const dispatch = useDispatch();
  const { id } = useParams();

  const product = products.find((item) => item.id === Number(id));

  if (!product) {
    return <h2 style={{ padding: "20px" }}>Product not found.</h2>;
  }

  const handleAddToCart = () => {
    dispatch(addToCart(product));
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