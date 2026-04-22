import ProductCard from "./ProductCard";

// ProductGrid is a reusable responsive grid layout.
// Both admin and customer pages use the same grid.
// renderActions(product) decides what buttons appear in each card.

export default function ProductGrid({ products, renderActions, getDetailPath }) {
  return (
    <div
      style={{
        display: "grid",

        /*
          Responsive grid:
          - auto-fill creates as many columns as possible
          - minmax(220px, 1fr) means:
              * card should not be smaller than 220px
              * card can grow to fill available space
        */
        gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
        gap: "16px",
      }}
    >
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