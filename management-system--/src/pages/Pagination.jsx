// Reusable pagination component for both admin and customer pages.

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}) {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, index) => index + 1);

  //prev page
  const goToPreviousPage = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  // next page
  const goToNextPage = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  return (
    <div style={paginationStyle}>
      {/* Previous button */}
      <div
        onMouseDown={(event) => event.preventDefault()}
        style={{
          ...pageButtonStyle,
          ...(currentPage === 1 ? disabledButtonStyle : {}),
        }}
        onClick={(e) => {
          if (currentPage > 1) {
            goToPreviousPage()
            e.currentTarget.blur();
          }
        }}
      >
        «
      </div>

      {/* Page number buttons */}
      {pages.map((pageNumber) => {
        const isActive = currentPage === pageNumber;

        return (
          <div
            key={pageNumber}
            onMouseDown={(event) => event.preventDefault()}
            style={{
              ...pageButtonStyle,
              backgroundColor: isActive ? "#4f46e5" : "#fff",
              color: isActive ? "#fff" : "#4f46e5",
              border: "1px solid #e5e7eb",
      }}
      onClick={() => onPageChange(pageNumber)}
    >
      {pageNumber}
    </div>
  );
})}

      {/* Next button */}
      <div
        onMouseDown={(event) => event.preventDefault()}
        style={{
          ...pageButtonStyle,
          ...(currentPage === totalPages ? disabledButtonStyle : {}),
        }}
        onClick={(e) => {
          if (currentPage < totalPages) {
            goToNextPage()
            e.currentTarget.blur();
          }            
        }}       
        >
          »
        </div>
    </div>
  );
}

// Styles Setting

const paginationStyle = {
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  gap: "1px",
  flexWrap: "wrap",
};

const pageButtonStyle = {
  width: "36px",
  height: "36px",
  border: "1px solid #e5e7eb",
  backgroundColor: "#fff",
  color: "#4f46e5",
  cursor: "pointer",
  fontSize: "14px",
  fontWeight: "500",
  fontFamily: "Arial, sans-serif",
  boxSizing: "border-box",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  userSelect: "none",
  outline: "none",
  boxShadow: "none",
  WebkitTapHighlightColor: "transparent",
};

// const activePageButtonStyle = {
//   backgroundColor: "#4f46e5",
//   borderColor: "1px solid #4f46e5",
//   color: "#fff",
// };

const disabledButtonStyle = {
  color: "#9ca3af",
  cursor: "not-allowed",
  backgroundColor: "#fff",
};