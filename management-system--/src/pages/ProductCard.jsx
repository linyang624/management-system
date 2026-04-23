import { Link } from "react-router-dom";

// ProductCard is a reusable component for displaying one product.
// Both admin page and customer page use this same card.
// The only difference is the action area at the bottom,
// which is passed in through "children".

export default function ProductCard({ product, children, detailPath }) {
  const cardContent = (
    <>
      {/* Show image only if image exists */}
      {product.image && (
        <img
          src={product.image}
          alt={product.name}
          style={imageStyle}
        />
      )}

      {/* Shared product information */}
      <div style={contentStyle}>
        <h3 style={titleStyle}>{product.name}</h3>

        <p style={priceStyle}>${Number(product.price).toFixed(2)}</p>

        <p style={descriptionStyle}>{product.description}</p>
      </div>
    </>
  );

  return (
    <div style={cardStyle}>
      {detailPath ? (
        <Link
          to={detailPath}
          style={linkStyle}
        >
          {cardContent}
        </Link>
      ) : (
        cardContent
      )}

      {/* Dynamic action area */}
      <div style={actionAreaStyle}>{children}</div>
    </div>
  );
}

/* =======================
   Styles
======================= */

const cardStyle = {
  border: "1px solid #e5e7eb",
  borderRadius: "10px",
  padding: "12px",
  backgroundColor: "#fff",
  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.06)",
  display: "flex",
  flexDirection: "column",
  height: "100%",
};

const linkStyle = {
  textDecoration: "none",
  color: "inherit",
  display: "block",
};

const imageStyle = {
  width: "100%",
  height: "220px",
  objectFit: "cover",
  borderRadius: "8px",
  marginBottom: "12px",
  cursor: "pointer",
};

const contentStyle = {
  display: "flex",
  flexDirection: "column",
  gap: "8px",
};

const titleStyle = {
  margin: 0,
  fontSize: "18px",
  fontWeight: "600",
  lineHeight: 1.3,
};

const priceStyle = {
  margin: 0,
  fontSize: "22px",
  fontWeight: "700",
  color: "#111827",
};

const descriptionStyle = {
  margin: 0,
  fontSize: "14px",
  color: "#6b7280",
  lineHeight: 1.5,
  display: "-webkit-box",
  WebkitLineClamp: 2,
  WebkitBoxOrient: "vertical",
  overflow: "hidden",
  minHeight: "42px",
};

const actionAreaStyle = {
  marginTop: "16px",
  paddingTop: "12px",
  borderTop: "1px solid #f3f4f6",
};