import React, { useState, useEffect } from "react";
import { Pencil, Trash2 } from "lucide-react";
import DynamicTable from "@/ui/DynamicTable";

const AffiliateWithdrawals = () => {
  // State for pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");

  // Sample data based on the screenshot
  const [withdrawals, setWithdrawals] = useState([
    {
      id: 1,
      customer: "andr Jokali",
      withdrawDate: "Jan-24-2022",
      withdrawalAmount: "$323",
      withdrawalFees: "$4.22",
      payoutAmount: "$318.78",
      withdrawalMethod: "Skrill",
      status: "Completed",
    },
    {
      id: 2,
      customer: "andr Jokali",
      withdrawDate: "Jan-24-2022",
      withdrawalAmount: "$323",
      withdrawalFees: "$4.22",
      payoutAmount: "$318.78",
      withdrawalMethod: "Skrill",
      status: "Completed",
    },
    {
      id: 3,
      customer: "andr Jokali",
      withdrawDate: "Jan-24-2022",
      withdrawalAmount: "$323",
      withdrawalFees: "$4.22",
      payoutAmount: "$318.78",
      withdrawalMethod: "Skrill",
      status: "Completed",
    },
    {
      id: 4,
      customer: "andr Jokali",
      withdrawDate: "Jan-24-2022",
      withdrawalAmount: "$323",
      withdrawalFees: "$4.22",
      payoutAmount: "$318.78",
      withdrawalMethod: "Skrill",
      status: "Completed",
    },
    {
      id: 5,
      customer: "andr Jokali",
      withdrawDate: "Jan-24-2022",
      withdrawalAmount: "$323",
      withdrawalFees: "$4.22",
      payoutAmount: "$318.78",
      withdrawalMethod: "Skrill",
      status: "Completed",
    },
    {
      id: 6,
      customer: "andr Jokali",
      withdrawDate: "Jan-24-2022",
      withdrawalAmount: "$323",
      withdrawalFees: "$4.22",
      payoutAmount: "$318.78",
      withdrawalMethod: "Skrill",
      status: "Completed",
    },
    {
      id: 7,
      customer: "andr Jokali",
      withdrawDate: "Jan-24-2022",
      withdrawalAmount: "$323",
      withdrawalFees: "$4.22",
      payoutAmount: "$318.78",
      withdrawalMethod: "Skrill",
      status: "Completed",
    },
    {
      id: 8,
      customer: "andr Jokali",
      withdrawDate: "Jan-24-2022",
      withdrawalAmount: "$323",
      withdrawalFees: "$4.22",
      payoutAmount: "$318.78",
      withdrawalMethod: "Skrill",
      status: "Completed",
    },
    {
      id: 9,
      customer: "andr Jokali",
      withdrawDate: "Jan-24-2022",
      withdrawalAmount: "$323",
      withdrawalFees: "$4.22",
      payoutAmount: "$318.78",
      withdrawalMethod: "Skrill",
      status: "Completed",
    },
    {
      id: 10,
      customer: "andr Jokali",
      withdrawDate: "Jan-24-2022",
      withdrawalAmount: "$323",
      withdrawalFees: "$4.22",
      payoutAmount: "$318.78",
      withdrawalMethod: "Skrill",
      status: "Completed",
    },
    {
      id: 10,
      customer: "andr Jokali",
      withdrawDate: "Jan-24-2022",
      withdrawalAmount: "$323",
      withdrawalFees: "$4.22",
      payoutAmount: "$318.78",
      withdrawalMethod: "Skrill",
      status: "Completed",
    },
    {
      id: 10,
      customer: "andr Jokali",
      withdrawDate: "Jan-24-2022",
      withdrawalAmount: "$323",
      withdrawalFees: "$4.22",
      payoutAmount: "$318.78",
      withdrawalMethod: "Skrill",
      status: "Completed",
    },
  ]);

  // Table columns definition
  const columns = [
    { key: "customer", label: "Customer" },
    { key: "withdrawDate", label: "Withdraw Date" },
    { key: "withdrawalAmount", label: "Withdrawal Amount" },
    { key: "withdrawalFees", label: "Withdrawal Fees" },
    { key: "payoutAmount", label: "Payout Amount" },
    { key: "withdrawalMethod", label: "Withdrawal Method" },
    { key: "status", label: "Status" },
    {
      key: "options",
      label: "Options",
      // Custom render for options column
      render: (row) => (
        <div className="flex space-x-2">
          <button className="text-pink-500" onClick={() => handleEdit(row.id)}>
            <Pencil className="h-4 w-4" />
          </button>
          <button
            className="text-pink-500"
            onClick={() => handleDelete(row.id)}
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ),
    },
  ];

  // Display options in the table data
  const dataWithOptions = withdrawals.map((item) => {
    return {
      ...item,
      options: (
        <div className="flex space-x-2">
          <button className="text-pink-500">
            <Pencil className="h-4 w-4" />
          </button>
          <button className="text-pink-500">
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ),
    };
  });

  // Filter data based on search term
  const filteredData = dataWithOptions.filter((item) => {
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

  const handleEdit = (id) => {
    // Edit implementation here
  };

  const handleDelete = (id) => {
    // Delete implementation here
  };

  const handleStatusChange = (row, newStatus) => {
    // Update status logic
    const updatedWithdrawals = withdrawals.map((item) =>
      item.id === row.id ? { ...item, status: newStatus } : item,
    );
    setWithdrawals(updatedWithdrawals);
  };

  return (
    <div className="mt-12 mb-8 flex bg-[#F2F7FB] flex-col gap-12 px-8">
      <DynamicTable
        data={currentItems}
        columns={columns}
        onSearch={handleSearch}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onStatusChange={handleStatusChange}
        currentPage={currentPage}
        totalItems={totalItems}
        itemsPerPage={itemsPerPage}
        onPageChange={handlePageChange}
        tableTitle="Affiliate Withdrawals"
        addButtonText="Add New Withdrawal"
        showAddButton={true}
      />
    </div>
  );
};

export default AffiliateWithdrawals;
