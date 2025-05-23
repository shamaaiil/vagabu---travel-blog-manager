import { useGetQuery } from "@/services/apiService";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import OrderActions from "../components/OrderActions";
import DynamicTable from "../../dashboard/tables";
import { toast } from "react-toastify";

const CompletedOrders = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [totalItems, setTotalItems] = useState(0);
  const itemsPerPage = 10;

  const authToken = localStorage.getItem("token");

  const columns = [
    { key: "orderNo", label: "Order No" },
    { key: "customer", label: "Customer" },
    { key: "created_at", label: "Date" },
    { key: "total_price", label: "Total" },
    { key: "payment_method", label: "Payment Method" },
    { key: "payment_status", label: "Payment Status" },
    { key: "status", label: "Order Status" },
    { key: "actions", label: "Actions" },
  ];

  const {
    data: ordersData,
    isLoading,
    error,
    refetch,
  } = useGetQuery(
    {
      path: `/orders?page=${currentPage}&per_page=${itemsPerPage}${searchTerm ? `&search=${searchTerm}` : ""}`,
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    },
    {
      refetchOnMountOrArgChange: true,
      skip: !authToken,
    },
  );

  useEffect(() => {
    if (!authToken) {
      toast.error("Authentication token not found. Please log in.");
      navigate("/login");
      return;
    }

    if (error) {
      if (error.status === 401) {
        toast.error("Authentication error. Please log in again.");
        localStorage.removeItem("token");
        navigate("/login");
      } else {
        toast.error(
          `Error fetching orders: ${error.data?.message || "Unknown error"}`,
        );
      }
    }
  }, [error, navigate, authToken]);

  useEffect(() => {
    if (ordersData) {
      // Extract total count from pagination metadata with more thorough checks
      let totalCount = 0;

      if (
        ordersData.pagination &&
        typeof ordersData.pagination.total === "number"
      ) {
        totalCount = ordersData.pagination.total;
      } else if (
        ordersData.meta?.pagination?.total &&
        typeof ordersData.meta.pagination.total === "number"
      ) {
        totalCount = ordersData.meta.pagination.total;
      } else if (
        ordersData.meta?.total &&
        typeof ordersData.meta.total === "number"
      ) {
        totalCount = ordersData.meta.total;
      } else if (ordersData.total && typeof ordersData.total === "number") {
        totalCount = ordersData.total;
      } else if (Array.isArray(ordersData.data)) {
        // If no pagination info is provided, we'll set a minimum value
        // that ensures pagination shows if we have a full page
        totalCount = Math.max(ordersData.data.length, itemsPerPage + 1);
      }

      // Hard-code a minimum for testing if needed
      // totalCount = Math.max(totalCount, 20); // Ensure we have at least 2 pages for testing

      setTotalItems(totalCount);

      // Format the order data
      if (Array.isArray(ordersData?.data)) {
        const completedOrders = ordersData?.data.filter((order) => {
          return order.status && order.status.toLowerCase() === "completed";
        });

        const formattedOrders = completedOrders.map((order) => {
          const date = new Date(order.created_at);
          const formattedDate = date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
          });

          return {
            orderNo: order?.order_number,
            customer: order?.customer?.full_name,
            created_at: formattedDate,
            total_price: order?.total_price,
            payment_method: order?.payment_method?.method
              ? order.payment_method.method.charAt(0).toUpperCase() +
                order.payment_method.method.slice(1)
              : "",
            payment_status:
              order?.payment_status?.charAt(0).toUpperCase() +
              order?.payment_status?.slice(1),
            status: order.status,
            actions: (
              <div className="flex relative space-x-2">
                <OrderActions order={order} />
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toast.success(`Delete triggered for order ${order.id}`);
                  }}
                  className="text-red-600 hover:text-red-900"
                >
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
            ),
            uuid: order.order_uuid,
            raw: order,
          };
        });

        setOrders(formattedOrders);
      }
    }
  }, [ordersData, navigate]);

  const handleRowClick = (row) => {
    const orderId = row.id;
    const numericId = parseInt(orderId.replace("#", "").replace(/^0+/, ""));
    navigate(`/orders/${numericId}`);
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
    setCurrentPage(1); // Reset to first page on new search
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Calculate pagination information for debugging
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <div className="mt-12 mb-8 flex bg-[#F2F7FB] flex-col gap-12 px-8">
      <DynamicTable
        tableTitle="Completed Orders"
        columns={columns}
        data={orders}
        onSearch={handleSearch}
        currentPage={currentPage}
        totalItems={totalItems}
        itemsPerPage={itemsPerPage}
        onPageChange={handlePageChange}
        isLoading={isLoading}
        onRowClick={handleRowClick}
        tableBgColor="#FFFFFF"
        showAddButton={false}
      />
    </div>
  );
};

export default CompletedOrders;
