import React, { useState, useEffect } from "react";
import DynamicTable from "@/ui/DynamicTable";
import { useGetQuery } from "@/services/apiService";

const BannedCustomers = () => {
  const [bannedCustomers, setBannedCustomers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const itemsPerPage = 10;

  // Define columns to match the expected structure
  const columns = [
    { key: "customer", label: "Customer" },
    { key: "phone_number", label: "Phone Number" },
    { key: "email", label: "Email" },
    { key: "walletBalance", label: "Wallet Balance" },
    { key: "points", label: "Reward Points" },
    { key: "date", label: "Joined Date" },
    { key: "status", label: "Status", toggleable: true },
    { key: "actions", label: "Actions" },
  ];

  // Use the API endpoint to fetch banned customers
  const { data, isLoading, refetch } = useGetQuery({
    path: "/customers",
    params: {
      per_page: itemsPerPage,
      page_id: currentPage,
      search: searchQuery,
      is_banned: 1, // Add this parameter to filter banned users from the API
    },
  });

  // Process data when it changes
  useEffect(() => {
    if (data?.data) {
      // Transform the data to match the expected table format and filter out non-banned customers
      const formattedData = data.data
        .filter((customer) => customer.is_banned === 1) // Only include banned customers
        .map((customer) => ({
          id: customer.id,
          user_uuid: customer.user_uuid,
          customer: customer.full_name,
          phone_number: customer.phone_number,
          email: customer.email,
          walletBalance: customer.wallet ? `$${customer.wallet.balance}` : "$0",
          points: customer.wallet ? customer.wallet.remaining_points : 0,
          date: new Date(customer.created_at).toLocaleDateString(),
          status: customer.is_banned === 1 ? "Banned" : "Active",
          is_banned: customer.is_banned,
        }));

      setBannedCustomers(formattedData);
      setTotalItems(data.meta?.pagination?.total || 0);
    } else {
      setBannedCustomers([]);
      setTotalItems(0);
    }
  }, [data]);

  // Handle search
  const handleSearch = (query) => {
    setSearchQuery(query);
    setCurrentPage(1); // Reset to first page on new search
  };

  // Handle page change
  const handlePageChange = (page) => {
    if (page >= 1 && page <= Math.ceil(totalItems / itemsPerPage)) {
      setCurrentPage(page);
    }
  };

  // Handle status change (unban a customer)
  const handleStatusChange = (customer, newStatus) => {
    // Here you would call an API to update the status
    // After successful update, refetch the data
    // Example API call could be:
    // updateCustomerStatus(customer.id, { is_banned: newStatus === 'Banned' ? 1 : 0 })
    //   .then(() => refetch());
  };

  return (
    <div className="mt-12 mb-8 flex bg-[#F2F7FB] flex-col gap-12 px-8">
      <DynamicTable
        data={bannedCustomers}
        columns={columns}
        currentPage={currentPage}
        totalItems={totalItems}
        itemsPerPage={itemsPerPage}
        onPageChange={handlePageChange}
        onSearch={handleSearch}
        onStatusChange={handleStatusChange}
        tableTitle="Banned Customers"
        addButtonText="Add Banned Customer"
        showAddButton={false}
        isLoading={isLoading}
        paginationText={`Showing ${bannedCustomers.length} of ${totalItems} entries`}
      />
    </div>
  );
};

export default BannedCustomers;
