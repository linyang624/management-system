// Pagination is a reusable component for moving between pages.
//
// Props:
// - currentPage: which page user is currently viewing
// - totalPages: total number of pages
// - onPageChange: function to update the current page

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}) {
  // If there is only one page or no page, do not show pagination buttons
  if (totalPages <= 1) return null;

  return (
    <div
      style={{
        marginTop: "24px",
        display: "flex",
        gap: "8px",
        flexWrap: "wrap",
      }}
    >
      {/* Previous page button */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        Prev
      </button>

      {/* 
        Create page number buttons dynamically.
        Example:
        if totalPages = 4, this will render buttons 1, 2, 3, 4
      */}
      {[...Array(totalPages)].map((_, index) => {
        const pageNumber = index + 1;

        return (
          <button
            key={pageNumber}
            onClick={() => onPageChange(pageNumber)}
            style={{
              fontWeight: currentPage === pageNumber ? "bold" : "normal",
            }}
          >
            {pageNumber}
          </button>
        );
      })}

      {/* Next page button */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        Next
      </button>
    </div>
  );
}