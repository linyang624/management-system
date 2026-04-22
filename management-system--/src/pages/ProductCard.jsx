// ProductCard is a reusable component for displaying one product.
// Both admin page and customer page use this same card.
// The only difference is the action area at the bottom,
// which is passed in through "children".

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
      {/* Show image only if image exists */}
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

      {/* Shared product information */}
      <h3>{product.name}</h3>
      <p>
        <strong>Price:</strong> ${product.price}
      </p>
      <p>{product.description}</p>

      {/* Dynamic action area */}
      <div style={{ marginTop: "12px" }}>{children}</div>
    </div>
  );
}