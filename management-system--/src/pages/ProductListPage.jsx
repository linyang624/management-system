import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import products from "../mock/products";
import { addToCart } from "../features/cart/cartSlice";

export default function ProductListPage() {
  const dispatch = useDispatch();
  const username = "guest";

  const handleAddToCart = (product) => {
    dispatch(addToCart({ username, product }));
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Product List</h2>

      {products.map((product) => (
        <div
          key={product.id}
          style={{
            border: "1px solid #ccc",
            padding: "12px",
            marginBottom: "12px",
          }}
        >
          <Link to={`/products/${product.id}`}>
            <img
              src={product.image}
              alt={product.name}
              style={{ width: "150px", cursor: "pointer" }}
            />
          </Link>

          <h3>{product.name}</h3>
          <p>Price: ${product.price}</p>
          <p>{product.description}</p>

          <button onClick={() => handleAddToCart(product)}>Add to Cart</button>
        </div>
      ))}
    </div>
  );
}