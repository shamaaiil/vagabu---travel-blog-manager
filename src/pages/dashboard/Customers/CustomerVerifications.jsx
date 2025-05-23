import React, { useState } from "react";
import DynamicTable from "@/ui/DynamicTable";

const CustomerVerifications = () => {
  // State for pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");

  // Empty data array to show "No data available in table" message
  const [verifications, setVerifications] = useState([]);

  // Table columns definition
  const columns = [
    { key: "storeName", label: "Store Name" },
    { key: "seller", label: "Seller" },
    { key: "sellerEmail", label: "Seller Email" },
    { key: "description", label: "Description" },
    { key: "status", label: "Status", toggleable: true },
    { key: "option", label: "Option" },
  ];

  // Filter data based on search term
  const filteredData = verifications.filter((item) => {
    if (searchTerm === "") return true;
    return Object.values(item).some(
      (value) =>
        typeof value === "string" &&
        value.toLowerCase().includes(searchTerm.toLowerCase()),
    );
  });

  // Calculate pagination values
  const itemsPerPage = 10;
  const totalItems = filteredData.length;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

  // Handlers
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
    setCurrentPage(1); // Reset to first page on search
  };

  const handleAdd = () => {
    // Add implementation here
  };

  const handleStatusChange = (row, newStatus) => {
    // Update status logic
    const updatedVerifications = verifications.map((item) =>
      item.id === row.id ? { ...item, status: newStatus } : item,
    );
    setVerifications(updatedVerifications);
  };

  return (
    <div className="mt-12 mb-8 flex bg-[#F2F7FB] flex-col gap-12 px-8">
      <DynamicTable
        data={currentItems}
        columns={columns}
        onSearch={handleSearch}
        onAdd={handleAdd}
        onStatusChange={handleStatusChange}
        currentPage={currentPage}
        totalItems={totalItems}
        itemsPerPage={itemsPerPage}
        onPageChange={handlePageChange}
        tableTitle="Customer Verification"
        addButtonText="Add New Verification"
        showAddButton={false} // No add button shown in the snapshot
      />
    </div>
  );
};

export default CustomerVerifications;
