import { Link } from "react-router-dom";

// ProductCard is a reusable component for displaying one product.
// Both admin page and customer page use this same card.
// The only difference is the action area at the bottom,
// which is passed in through "children".

export default function ProductCard({ product, children, detailPath }) {
  const imageElement = product.image ? (
    <img
      src={product.image}
      alt={product.name}
      style={{
        width: "100%",
        height: "180px",
        objectFit: "cover",
        borderRadius: "6px",
        marginBottom: "10px",
        cursor: detailPath ? "pointer" : "default",
      }}
    />
  ) : null;

  const titleElement = (
    <h3 style={{ margin: "0 0 12px 0" }}>{product.name}</h3>
  );

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
      {detailPath ? <Link to={detailPath}>{imageElement}</Link> : imageElement}

      {/* Shared product information */}
      {detailPath ? (
        <Link
          to={detailPath}
          style={{ textDecoration: "none", color: "inherit" }}
        >
          {titleElement}
        </Link>
      ) : (
        titleElement
      )}

      <p style={{ margin: "0 0 12px 0" }}>
        <strong>Price:</strong> ${product.price}
      </p>
      <p style={{ margin: "0 0 12px 0" }}>{product.description}</p>

      {/* Dynamic action area */}
      <div style={{ marginTop: "12px" }}>{children}</div>
    </div>
  );
}