// SearchBar is a reusable input component used by both admin
// and customer pages for product searching.
//
// Props:
// - searchTerm: current value inside the input
// - onSearchChange: function that runs whenever user types

export default function SearchBar({ searchTerm, onSearchChange }) {
  return (
    <input
      type="text"
      placeholder="Search products..."
      value={searchTerm}
      onChange={onSearchChange}
      style={{
        padding: "10px",
        width: "250px",
        border: "1px solid #ccc",
        borderRadius: "6px",
      }}
    />
  );
}