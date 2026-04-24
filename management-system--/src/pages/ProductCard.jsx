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
        <img src={product.image} alt={product.name} style={imageStyle} />
      )}

      {/* Shared product information */}
      <div style={contentStyle}>
        <h3 style={titleStyle}>{product.name}</h3>

        <p style={priceStyle}>${Number(product.price).toFixed(2)}</p>

        {/*<p style={descriptionStyle}>{product.description}</p>*/}
      </div>
    </>
  );

  return (
    <div style={cardStyle}>
      {detailPath ? (
        <Link to={detailPath} style={linkStyle}>
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
  borderRadius: "4px",
  padding: "8px",
  backgroundColor: "#fff",
  boxShadow: "none",
  display: "flex",
  flexDirection: "column",
  height: "100%",
  boxSizing: "border-box",
};

const linkStyle = {
  textDecoration: "none",
  color: "inherit",
  display: "block",
};

const imageStyle = {
  width: "100%",
  height: "150px",
  objectFit: "cover",
  borderRadius: "2px",
  marginBottom: "8px",
  cursor: "pointer",
};

const contentStyle = {
  display: "flex",
  flexDirection: "column",
  gap: "4px",
};

const titleStyle = {
  margin: 0,
  fontSize: "13px",
  fontWeight: "400",
  lineHeight: 1.25,
  color: "#4b5563",
  fontFamily: "Arial, sans-serif",
};

const priceStyle = {
  margin: 0,
  fontSize: "16px",
  fontWeight: "700",
  color: "#111827",
  fontFamily: "Arial, sans-serif",
};

// const descriptionStyle = {
//   margin: 0,
//   fontSize: "11px",
//   color: "#6b7280",
//   lineHeight: 1.35,
//   display: "-webkit-box",
//   WebkitLineClamp: 2,
//   WebkitBoxOrient: "vertical",
//   overflow: "hidden",
//   minHeight: "30px",
//   fontFamily: "Arial, sans-serif",
// };

const actionAreaStyle = {
  marginTop: "8px",
  paddingTop: "0",
  borderTop: "none",
};