import React, { useState, useEffect } from "react";
import { Search, Plus, Trash2 } from "lucide-react";
import DynamicTable from "@/ui/DynamicTable";

const SubscriptionTransactions = () => {
  // State for transaction data
  const [allTransactions, setAllTransactions] = useState([
    {
      id: 1,
      customer: "GwRrYnaLFp0HHI",
      subscriptionDate: "Jan 10, 2020",
      plan: "Basic",
      planDuration: "90 Days",
      planPricing: "$0",
      paymentMethod: "Free",
    },
    {
      id: 2,
      customer: "GwRrYnaLFp0HHI",
      subscriptionDate: "Jan 10, 2020",
      plan: "Basic",
      planDuration: "90 Days",
      planPricing: "$0",
      paymentMethod: "Free",
    },
    {
      id: 3,
      customer: "GwRrYnaLFp0HHI",
      subscriptionDate: "Jan 10, 2020",
      plan: "Basic",
      planDuration: "90 Days",
      planPricing: "$0",
      paymentMethod: "Free",
    },
    {
      id: 4,
      customer: "GwRrYnaLFp0HHI",
      subscriptionDate: "Jan 10, 2020",
      plan: "Basic",
      planDuration: "90 Days",
      planPricing: "$0",
      paymentMethod: "Free",
    },
    {
      id: 5,
      customer: "GwRrYnaLFp0HHI",
      subscriptionDate: "Jan 10, 2020",
      plan: "Basic",
      planDuration: "90 Days",
      planPricing: "$0",
      paymentMethod: "Free",
    },
    {
      id: 6,
      customer: "GwRrYnaLFp0HHI",
      subscriptionDate: "Jan 10, 2020",
      plan: "Basic",
      planDuration: "90 Days",
      planPricing: "$0",
      paymentMethod: "Free",
    },
    {
      id: 7,
      customer: "GwRrYnaLFp0HHI",
      subscriptionDate: "Jan 10, 2020",
      plan: "Basic",
      planDuration: "90 Days",
      planPricing: "$0",
      paymentMethod: "Free",
    },
    {
      id: 8,
      customer: "GwRrYnaLFp0HHI",
      subscriptionDate: "Jan 10, 2020",
      plan: "Basic",
      planDuration: "90 Days",
      planPricing: "$0",
      paymentMethod: "Free",
    },
    {
      id: 9,
      customer: "GwRrYnaLFp0HHI",
      subscriptionDate: "Jan 10, 2020",
      plan: "Basic",
      planDuration: "90 Days",
      planPricing: "$0",
      paymentMethod: "Free",
    },
    {
      id: 10,
      customer: "GwRrYnaLFp0HHI",
      subscriptionDate: "Jan 10, 2020",
      plan: "Basic",
      planDuration: "90 Days",
      planPricing: "$0",
      paymentMethod: "Free",
    },
    {
      id: 11,
      customer: "GwRrYnaLFp0HHI",
      subscriptionDate: "Jan 10, 2020",
      plan: "Basic",
      planDuration: "90 Days",
      planPricing: "$0",
      paymentMethod: "paid",
    },
  ]);

  // State for filtered transactions
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [displayTransactions, setDisplayTransactions] = useState([]);

  // State for pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Table columns definition
  const columns = [
    { key: "customer", label: "Customer" },
    { key: "subscriptionDate", label: "Subscription Date" },
    { key: "plan", label: "Plan" },
    { key: "planDuration", label: "Plan Duration" },
    { key: "planPricing", label: "Plan Pricing" },
    { key: "paymentMethod", label: "Payment Method" },
    {
      key: "actions",
      label: "Actions",
      // Custom render function for the actions column
      render: (row) => (
        <div className="flex space-x-2">
          <button className="text-pinkclr hover:text-pink-700">
            <Plus className="h-4 w-4" />
          </button>
          <button className="text-pinkclr hover:text-pink-700">
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ),
    },
  ];

  // Filter transactions based on search query
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredTransactions(allTransactions);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = allTransactions.filter(
        (transaction) =>
          transaction.customer.toLowerCase().includes(query) ||
          transaction.plan.toLowerCase().includes(query) ||
          transaction.paymentMethod.toLowerCase().includes(query),
      );
      setFilteredTransactions(filtered);
    }
    // Reset to first page when search changes
    setCurrentPage(1);
  }, [searchQuery, allTransactions]);

  // Update displayed transactions when page or filtered data changes
  useEffect(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    setDisplayTransactions(filteredTransactions.slice(startIndex, endIndex));
  }, [currentPage, filteredTransactions, itemsPerPage]);

  // Handlers for table actions
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const handleAdd = () => {
    // Logic to add a new transaction
  };

  const handleDelete = (transaction) => {
    // Logic to delete a transaction
    setAllTransactions((prev) =>
      prev.filter((item) => item.id !== transaction.id),
    );
  };

  // Add custom rendering for actions column and prepare data for display
  const prepareTransactionsForDisplay = () => {
    return displayTransactions.map((transaction) => ({
      ...transaction,
      plan: <span className="">{transaction.plan}</span>,
      actions: (
        <div className="flex space-x-2">
          <button
            className="text-pinkclr hover:text-pink-700"
            onClick={() => console.log("Add action for:", transaction.id)}
          >
            <Plus className="h-4 w-4" />
          </button>
          <button
            onClick={() => handleDelete(transaction)}
            className="text-red-500 hover:text-red-700"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ),
    }));
  };

  const transactionsWithActions = prepareTransactionsForDisplay();

  return (
    <div className="mt-12 mb-8 flex bg-[#F2F7FB] flex-col gap-12 px-8">
      <DynamicTable
        data={transactionsWithActions}
        columns={columns}
        tableTitle="Subscription Transaction"
        showAddButton={false}
        currentPage={currentPage}
        totalItems={filteredTransactions.length}
        itemsPerPage={itemsPerPage}
        onPageChange={handlePageChange}
        onSearch={handleSearch}
        onAdd={handleAdd}
        onDelete={handleDelete}
        isLoading={isLoading}
      />
    </div>
  );
};

export default SubscriptionTransactions;
