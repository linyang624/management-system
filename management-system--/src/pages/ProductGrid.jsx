import ProductCard from "./ProductCard";

// ProductGrid is a reusable responsive grid layout.
// Both admin and customer pages use the same grid.
// renderActions(product) decides what buttons appear in each card.

export default function ProductGrid({ products, renderActions, getDetailPath }) {
  return (
    <div style={gridStyle}>
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

const gridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
  gap: "24px",
  alignItems: "stretch",
};