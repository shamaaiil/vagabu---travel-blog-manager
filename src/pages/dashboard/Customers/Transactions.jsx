import React, { useState } from "react";
import { Eye } from "lucide-react";
import DynamicTable from "@/ui/DynamicTable";

const Transactions = () => {
  // State for pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");

  // Sample data based on the screenshot
  const [transactions, setTransactions] = useState([
    {
      id: 1,
      customerName: "Andrii Jokali",
      amount: "$ 1000",
      transactionID: "079352",
      transactionDate: "2023-12-11",
    },
    {
      id: 2,
      customerName: "Andrii Jokali",
      amount: "$ 1000",
      transactionID: "079352",
      transactionDate: "2023-12-11",
    },
    {
      id: 3,
      customerName: "Andrii Jokali",
      amount: "$ 1000",
      transactionID: "079352",
      transactionDate: "2023-12-11",
    },
    {
      id: 4,
      customerName: "Andrii Jokali",
      amount: "$ 1000",
      transactionID: "079352",
      transactionDate: "2023-12-11",
    },
    {
      id: 5,
      customerName: "Andrii Jokali",
      amount: "$ 1000",
      transactionID: "079352",
      transactionDate: "2023-12-11",
    },
    {
      id: 6,
      customerName: "Andrii Jokali",
      amount: "$ 1000",
      transactionID: "079352",
      transactionDate: "2023-12-11",
    },
    {
      id: 7,
      customerName: "Andrii Jokali",
      amount: "$ 1000",
      transactionID: "079352",
      transactionDate: "2023-12-11",
    },
    {
      id: 8,
      customerName: "Andrii Jokali",
      amount: "$ 1000",
      transactionID: "079352",
      transactionDate: "2023-12-11",
    },
    {
      id: 9,
      customerName: "Andrii Jokali",
      amount: "$ 1000",
      transactionID: "079352",
      transactionDate: "2023-12-11",
    },
    {
      id: 10,
      customerName: "Andrii Jokali",
      amount: "$ 1000",
      transactionID: "079352",
      transactionDate: "2023-12-11",
    },
  ]);

  // Table columns definition
  const columns = [
    { key: "customerName", label: "Customer Name" },
    { key: "amount", label: "Amount" },
    { key: "transactionID", label: "Transaction ID" },
    { key: "transactionDate", label: "Transaction Date" },
    { key: "options", label: "Options" },
  ];

  // Display options in the table data
  const dataWithOptions = transactions.map((item) => {
    return {
      ...item,
      options: (
        <button className="bg-teal-500 text-white px-4 py-1 rounded-md flex items-center gap-1">
          <Eye className="h-4 w-4" />
          Details
        </button>
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

  const handleViewDetails = (id) => {
    // Details implementation here
  };

  return (
    <div className="mt-12 mb-8 flex bg-[#F2F7FB] flex-col gap-12 px-8">
      <DynamicTable
        data={currentItems}
        columns={columns}
        onSearch={handleSearch}
        onAdd={handleAdd}
        currentPage={currentPage}
        totalItems={totalItems}
        itemsPerPage={itemsPerPage}
        onPageChange={handlePageChange}
        tableTitle="Transactions"
        addButtonText="Add New Transaction"
        showAddButton={false} // No add button shown in the snapshot
      />
    </div>
  );
};

export default Transactions;
