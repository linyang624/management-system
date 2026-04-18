 // ProductCard is a reusable component for showing one product.
// It displays the shared product information that both admin and customer need.
// The action area is not fixed here. Instead, we use "children"
// so each page can pass different buttons such as Edit or Add to Cart.

export default function ProductCard({ product, children }) {
  return (
    <div
      style={{
        border: "1px solid #ccc",
        borderRadius: "8px",
        padding: "12px",
        backgroundColor: "#fff",
      }}
    >
      {/* 
        Show the product image only if the image field exists.
        This prevents errors if some products do not have images.
      */}
      {product.image && (
        <img
          src={product.image}
          alt={product.name}
          style={{
            width: "100%",
            height: "180px",
            objectFit: "cover",
            borderRadius: "6px",
            marginBottom: "10px",
          }}
        />
      )}

      {/* Basic product information shared by both pages */}
      <h3>{product.name}</h3>

      <p>
        <strong>Price:</strong> ${product.price}
      </p>

      <p>{product.description}</p>

      {/* 
        This is the reusable action area.
        - On admin page, it can show an Edit button
        - On customer page, it can show Add to Cart or quantity controls
      */}
      <div style={{ marginTop: "12px" }}>{children}</div>
    </div>
  );
}