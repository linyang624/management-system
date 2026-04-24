import ProductCard from "./ProductCard";
import "../responsive/ProductGrid.css";

// ProductGrid is a reusable responsive grid layout.
// Both admin and customer pages use the same grid.
// renderActions(product) decides what buttons appear in each card.

export default function ProductGrid({ products, renderActions, getDetailPath }) {
  return (
    <div className="product-grid">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          detailPath={getDetailPath ? getDetailPath(product) : undefined}
        >
          {renderActions(product)}
        </ProductCard>
      ))}
    </div>
  );
}

/* =======================
   Styles
======================= */

// const gridStyle = {
//   display: "grid",
//   gridTemplateColumns: "repeat(5, 1fr)",
//   gap: "24px 16px",
//   alignItems: "stretch",
// };