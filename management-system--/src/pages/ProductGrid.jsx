import ProductCard from "./ProductCard";

// ProductGrid is a reusable component for displaying
// a list of products in a responsive grid layout.
// It receives:
// 1. products -> the array of products to display
// 2. renderActions -> a function that returns the correct action buttons
//    for each product depending on the page type

export default function ProductGrid({ products, renderActions }) {
  return (
    <div
      style={{
        display: "grid",

        /*
          Responsive grid layout:
          - auto-fill creates as many columns as possible
            depending on available screen width
          - minmax(220px, 1fr) means each card:
              * should not be smaller than 220px
              * can grow larger to fill remaining row space

          Result:
          - large screen -> more products per row
          - medium screen -> fewer products per row
          - small phone screen -> often 1 product per row
        */
        gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
        gap: "16px",
      }}
    >
      {/* 
        Loop through each product and render a ProductCard.
        renderActions(product) decides what buttons appear
        inside each card.
      */}
      {products.map((product) => (
        <ProductCard key={product.id} product={product}>
          {renderActions(product)}
        </ProductCard>
      ))}
    </div>
  );
}