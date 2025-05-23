import { useState, useEffect } from "react";
import { Search } from "lucide-react";

const DynamicTable = ({
  tableTitle,
  columns = [],
  data = [],
  onAdd,
  onSearch,
  onStatusChange,
  currentPage = 1,
  totalItems = 0,
  itemsPerPage = 10,
  onPageChange,
  isLoading = false,
  addButtonText = "Add New",
  showDateFilter = false,
  showSingleDateFilter = false, // New prop for single-date filter
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [singleDate, setSingleDate] = useState(""); // State for single-date filter

  const handleSearch = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    if (onSearch) {
      onSearch(term);
    }
  };

  const handleDateFilterSubmit = () => {
    if (showSingleDateFilter) {
    } else {
    }
  };

  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const renderPagination = () => {
    const pages = [];
    const maxPagesToShow = 5;

    pages.push(
      <button
        key="prev"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="w-8 h-8 flex items-center justify-center rounded-full text-gray-500 hover:bg-gray-100"
      >
        &lt;
      </button>,
    );

    let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
    let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

    if (endPage - startPage + 1 < maxPagesToShow) {
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => onPageChange(i)}
          className={`w-8 h-8 flex items-center justify-center rounded-full 
            ${
              currentPage === i
                ? "bg-teal-500 text-white"
                : "text-gray-700 hover:bg-gray-100"
            }`}
        >
          {i}
        </button>,
      );
    }

    pages.push(
      <button
        key="next"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="w-8 h-8 flex items-center justify-center rounded-full text-gray-500 hover:bg-gray-100"
      >
        &gt;
      </button>,
    );

    return pages;
  };

  const getStatusColor = (status) => {
    const statusMap = {
      Completed: "text-green-600",
      Pending: "text-cyan-500",
      Cancelled: "text-red-500",
    };
    return statusMap[status] || "text-gray-600";
  };

  const isStatusColumn = (columnName) => {
    return columnName.toLowerCase().includes("status");
  };

  const renderTableContent = () => {
    if (isLoading) {
      return (
        <tr>
          <td colSpan={columns.length} className="text-center py-4">
            Loading data...
          </td>
        </tr>
      );
    }

    if (data.length === 0) {
      return (
        <tr>
          <td colSpan={columns.length} className="text-center py-4">
            No data available
          </td>
        </tr>
      );
    }

    return data.map((row, rowIndex) => (
      <tr key={rowIndex} className="hover:bg-gray-50">
        {columns.map((column, colIndex) => {
          if (typeof column === "string") {
            return (
              <td
                key={colIndex}
                className="py-4 px-4 text-sm font-normal text-gray-700"
              >
                {row[column.toLowerCase()]}
              </td>
            );
          }

          const value = row[column.key];

          if (column.key === "actions") {
            return (
              <td key={colIndex} className="py-4 px-4">
                {row.actions || (
                  <div className="flex space-x-2">
                    <button className="text-pinkclr hover:text-pinkclr">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                        />
                      </svg>
                    </button>
                    <button className="text-pinkclr hover:text-pinkclr">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>
                  </div>
                )}
              </td>
            );
          }

          if (column.key === "status" && column.toggleable) {
            return (
              <td key={colIndex} className="py-4 px-4">
                {row.statusToggle || (
                  <div className="relative inline-block w-10 align-middle select-none">
                    <input
                      type="checkbox"
                      name={`toggle-${rowIndex}`}
                      id={`toggle-${rowIndex}`}
                      className="sr-only"
                      checked={row.status === 1 || row.status === true}
                      onChange={() => onStatusChange && onStatusChange(row)}
                    />
                    <label
                      htmlFor={`toggle-${rowIndex}`}
                      className={`block h-6 rounded-full w-12 cursor-pointer transition-colors ${
                        row.status === 1 || row.status === true
                          ? "bg-teal-500"
                          : "bg-gray-300"
                      }`}
                    >
                      <span
                        className={`block h-4 w-4 mt-1 ml-1 rounded-full transition-transform ${
                          row.status === 1 || row.status === true
                            ? "bg-white transform translate-x-6"
                            : "bg-white"
                        }`}
                      />
                    </label>
                  </div>
                )}
              </td>
            );
          }

          if (isStatusColumn(column.key)) {
            return (
              <td key={colIndex} className="py-4 px-4">
                <span className={getStatusColor(value)}>{value}</span>
              </td>
            );
          }

          return (
            <td
              key={colIndex}
              className="py-4 px-4 text-sm font-normal text-gray-700"
            >
              {value}
            </td>
          );
        })}
      </tr>
    ));
  };

  return (
    <div className="bg-white rounded-xl shadow-sm mt-3">
      {/* Table Header with Title and Controls */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center p-4 border-b border-gray-200">
        <h2 className="text-xl font-bold text-pink-500 mb-4 md:mb-0">
          {tableTitle}
        </h2>

        <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
          {/* Single Date Filter - Show if showSingleDateFilter is true */}
          {showSingleDateFilter && (
            <div className="flex gap-2 items-center">
              <div className="flex items-center">
                <span className="text-sm text-gray-600 mr-2">Date</span>
                <input
                  type="date"
                  value={singleDate}
                  onChange={(e) => setSingleDate(e.target.value)}
                  className="border border-gray-300 rounded p-2 text-sm"
                />
              </div>

              <button
                onClick={handleDateFilterSubmit}
                className="bg-teal-500 text-white px-4 py-2 rounded"
              >
                Get
              </button>
            </div>
          )}

          {/* Date Range Filter - Show if showDateFilter is true and showSingleDateFilter is false */}
          {showDateFilter && !showSingleDateFilter && (
            <div className="flex gap-2 items-center">
              <div className="flex items-center">
                <span className="text-sm text-gray-600 mr-2">Start Date</span>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="border border-gray-300 rounded p-2 text-sm"
                />
              </div>

              <div className="flex items-center">
                <span className="text-sm text-gray-600 mr-2">End Date</span>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="border border-gray-300 rounded p-2 text-sm"
                />
              </div>

              <button
                onClick={handleDateFilterSubmit}
                className="bg-teal-500 text-white px-4 py-2 rounded"
              >
                Get
              </button>
            </div>
          )}

          {/* Search Input */}
          <div className="relative w-full md:w-64">
            <input
              type="text"
              placeholder="Search here..."
              value={searchTerm}
              onChange={handleSearch}
              className="w-full pl-10 pr-4 py-2 rounded-md border  border-teelclr focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4">
              <Search size={16} />
            </div>

            {searchTerm && (
              <button
                onClick={() => {
                  setSearchTerm("");
                  if (onSearch) onSearch("");
                }}
                className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            )}
          </div>

          {/* Add Button */}
          {onAdd && (
            <button
              onClick={onAdd}
              className="bg-teelclr text-white px-4 py-2 rounded flex items-center"
            >
              <span className="mr-1 text-lg">+</span> {addButtonText}
            </button>
          )}
        </div>
      </div>

      {/* Table Content */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50">
              {columns.map((column, index) => (
                <th
                  key={index}
                  className="py-3 px-4 text-left text-xs font-medium text-textclr font-semibold uppercase tracking-wider"
                >
                  {typeof column === "string" ? column : column.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {renderTableContent()}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalItems > 0 && (
        <div className="px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
          <div className="text-sm text-gray-700">
            Showing {Math.min((currentPage - 1) * itemsPerPage + 1, totalItems)}{" "}
            to {Math.min(currentPage * itemsPerPage, totalItems)} of{" "}
            {totalItems} entries
          </div>

          <div className="flex space-x-1">{renderPagination()}</div>
        </div>
      )}
    </div>
  );
};

export default DynamicTable;
