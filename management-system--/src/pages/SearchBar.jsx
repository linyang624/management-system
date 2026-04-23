// Reusable search input.
// Currently not used because product search is handled by Header.
// Keep this component in case we need page-level search again later.

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