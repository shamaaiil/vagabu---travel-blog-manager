import React, { useState, useEffect } from "react";
import { Search, Plus } from "lucide-react";

const DynamicTable = ({
  data,
  lowerCase=[],
  onDelete,
  onAdd,
  onEdit,
  onStatusChange,
  onBanStatusChange,
  onSearch,
  columns,
  currentPage,
  totalItems,
  itemsPerPage,
  onPageChange,
  tableTitle = "All Items",
  addButtonText = "Add New Item",
  showAddButton = true,
  isLoading = false,
}) => {
  const [searchInput, setSearchInput] = useState("");

  // Make sure to use the prop value to stay in sync with parent component
  useEffect(() => {
    // This ensures the component uses the page from props
    // instead of maintaining its own state
  }, [currentPage]);

  // Helper function to render status toggle
  const renderToggle = (isEnabled) => (
    <div className="flex items-center">
      <div
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
          isEnabled ? "bg-teal-500" : "bg-gray-200"
        }`}
      >
        <div
          className={`${
            isEnabled ? "translate-x-6 bg-white" : "translate-x-1 bg-gray-500"
          } h-4 w-4 rounded-full transition-transform duration-200 ease-in-out`}
        />
      </div>
    </div>
  );

  // Handle search input
  const handleSearchInputChange = (e) => {
    setSearchInput(e.target.value);
  };

  // Handle search form submission
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    onSearch(searchInput);
  };

  // Handle search on Enter key press
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      onSearch(searchInput);
    }
  };

  // Calculate total pages
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  // Status toggle handler
  const handleStatusToggle = (row) => {
    // Handle both boolean and numeric status values
    const currentStatus = row.status;
    let newStatus;

    if (typeof currentStatus === "boolean") {
      newStatus = !currentStatus;
    } else if (typeof currentStatus === "number") {
      newStatus = currentStatus === 1 ? 0 : 1;
    } else if (typeof currentStatus === "string") {
      newStatus = currentStatus === "Active" ? "Inactive" : "Active";
    }

    onStatusChange(row, newStatus);
  };

  // Ban status toggle handler
  const handleBanStatusToggle = (row) => {
    if (!onBanStatusChange) return;

    // Handle both boolean and numeric ban status values
    const currentBanStatus = row.isBanned;
    let newBanStatus;

    if (typeof currentBanStatus === "boolean") {
      newBanStatus = !currentBanStatus;
    } else if (typeof currentBanStatus === "number") {
      newBanStatus = currentBanStatus === 1 ? 0 : 1;
    } else if (typeof currentBanStatus === "string") {
      newBanStatus = currentBanStatus === "Yes" ? "No" : "Yes";
    }

    onBanStatusChange(row, newBanStatus);
  };

  // Pagination display logic
  const renderPageNumbers = () => {
    // Always show at most 5 page numbers
    const maxVisiblePages = 5;
    const pageNumbers = [];

    if (totalPages <= maxVisiblePages) {
      // If we have 5 or fewer pages, show all of them
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      // More complex logic for more than 5 pages
      if (currentPage <= 3) {
        // Near the start: show first 5 pages and then "..."
        for (let i = 1; i <= 5; i++) {
          pageNumbers.push(i);
        }
      } else if (currentPage >= totalPages - 2) {
        // Near the end: show last 5 pages with "..." at start
        for (let i = totalPages - 4; i <= totalPages; i++) {
          pageNumbers.push(i);
        }
      } else {
        // In the middle: show current page with 2 pages on each side
        for (let i = currentPage - 2; i <= currentPage + 2; i++) {
          pageNumbers.push(i);
        }
      }
    }

    return pageNumbers;
  };

  // Calculate entry information text
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);
  const showingText = `Showing ${startItem} to ${endItem} of ${totalItems} entries`;

  // Calculate table column width based on number of columns
  const getTableStyles = () => {
    // Check if there are exactly 4 columns to apply equal width
    if (columns?.length === 4) {
      return {
        tableLayout: "fixed",
        width: "100%"
      };
    }
    return {};
  };

  // Get column width style based on columns count
  const getColumnStyle = () => {
    if (columns?.length === 4) {
      return "w-1/4"; // Equal 25% width for each column
    }
    return "";
  };

  return (
    <div className="w-full p-4 bg-white rounded-lg shadow-sm">
    <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
  <div className="text-xl text-pinkclr font-semibold mb-4 sm:mb-0">{tableTitle}</div>
  <div className="flex flex-col sm:flex-row gap-4 items-center w-full sm:w-auto">
    <div className="relative w-full sm:w-64">
      <Search onClick={handleSearchSubmit} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
      <input
        type="text"
        placeholder="Search here..."
        className="pl-10 w-full sm:w-64 h-10 rounded-md border border-teelclr focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
        value={searchInput}
        onChange={handleSearchInputChange}
        onKeyPress={handleKeyPress}
      />
      {/* <button
        className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-teal-500 text-white px-2 py-1 rounded-md text-sm"
        
      >
        Search
      </button> */}
    </div>
    {showAddButton && (
      <button
        onClick={onAdd}
        className="bg-teal-500 hover:bg-teal-600 text-white px-4 py-2 rounded-md flex items-center gap-2 transition-colors duration-200 mt-4 sm:mt-0"
      >
        <Plus className="h-4 w-4" />
        {addButtonText}
      </button>
    )}
  </div>
</div>

      <div className="overflow-x-auto">
        {isLoading ? (
          <div className="flex justify-center items-center py-10">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-teal-500"></div>
          </div>
        ) : (
          <table className="w-full border-collapse" style={getTableStyles()}>
            <thead>
              <tr className="bg-gray-50">
                {columns?.map((column, index) => (
                  <th
                    key={index}
                    className={`px-4 py-6 text-left text-xs font-semibold text-[#2B3674] uppercase tracking-wider border-b border-gray-200 ${getColumnStyle()} ${lowerCase}`}
                  >
                    {column.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {data?.length > 0 ? (
                data.map((row, rowIndex) => (
                  <tr
                    key={rowIndex}
                    className="hover:bg-gray-50 transition-colors duration-150"
                  >
                    {columns.map((column) => (
                      <td
                        key={column.key}
                        className={`px-4 py-6 text-sm text-[#2B3674] ${getColumnStyle()}`}
                      >
                        {column.key === "status" && column.toggleable ? (
                          <div
                            onClick={() => handleStatusToggle(row)}
                            className="cursor-pointer"
                          >
                            {renderToggle(
                              typeof row.status === "boolean"
                                ? row.status
                                : typeof row.status === "number"
                                  ? row.status === 1
                                  : row.status === "Active",
                            )}
                          </div>
                        ) : column.key === "isBanned" && column.toggleable ? (
                          <div
                            onClick={() => handleBanStatusToggle(row)}
                            className="cursor-pointer"
                          >
                            {renderToggle(
                              typeof row.isBanned === "boolean"
                                ? row.isBanned
                                : typeof row.isBanned === "number"
                                  ? row.isBanned === 1
                                  : row.isBanned === "Yes",
                            )}
                          </div>
                        ) : (
                          row[column.key]
                        )}
                      </td>
                    ))}
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={columns.length}
                    className="px-4 py-8 text-center text-[#2B3674] font-bold"
                  >
                    No records found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination Controls */}
      {!isLoading && totalPages > 0 && (
        <div className="flex justify-between items-center mt-4">
          <div>{showingText}</div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className={`px-3 py-1 rounded-md border border-gray-300 ${currentPage === 1 ? "text-gray-400 cursor-not-allowed" : "text-teal-500 hover:bg-teal-100"}`}
            >
              &lt; {/* Left Arrow */}
            </button>

            {/* First page button (if not visible in the normal range) */}
            {currentPage > 3 && totalPages > 5 && (
              <>
                <button
                  onClick={() => onPageChange(1)}
                  className="px-3 py-1 rounded-md border border-gray-300 text-teelclr hover:bg-teal-100"
                >
                  1
                </button>
                {currentPage > 4 && <span className="px-1">...</span>}
              </>
            )}

            {/* Page number buttons */}
            {renderPageNumbers().map((pageNum) => (
              <button
                key={pageNum}
                onClick={() => onPageChange(pageNum)}
                className={`px-3 py-1 rounded-md border border-gray-300 ${currentPage === pageNum ? "bg-teelclr text-white" : "text-teal-500 hover:bg-teal-100"}`}
              >
                {pageNum}
              </button>
            ))}

            {/* Last page button (if not visible in the normal range) */}
            {currentPage < totalPages - 2 && totalPages > 5 && (
              <>
                {currentPage < totalPages - 3 && (
                  <span className="px-1">...</span>
                )}
                <button
                  onClick={() => onPageChange(totalPages)}
                  className="px-3 py-1 rounded-md border border-gray-300 text-teal-500 hover:bg-teal-100"
                >
                  {totalPages}
                </button>
              </>
            )}

            <button
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`px-3 py-1 rounded-md border border-gray-300 ${currentPage === totalPages ? "text-gray-400 cursor-not-allowed" : "text-teal-500 hover:bg-teal-100"}`}
            >
              &gt; {/* Right Arrow */}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DynamicTable;