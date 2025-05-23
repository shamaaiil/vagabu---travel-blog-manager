import { useState, useEffect } from "react";
import DynamicTable from "@/ui/DynamicTable";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useDeleteMutation, useGetQuery } from "@/services/apiService";
import OrderActions from "../components/OrderActions";
import OrderBids from "../OrderDetail/OrderBids";


const AllOrders = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [totalItems, setTotalItems] = useState(0);
  const itemsPerPage = 10;
  const [showOrderBids, setShowOrderBids] = useState(false);
  const [orderDelete] = useDeleteMutation();

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
        totalCount = Math.max(ordersData.data.length, itemsPerPage + 1);
      }

    
      setTotalItems(totalCount);

  
      if (Array.isArray(ordersData.data)) {
        const formattedOrders = ordersData.data.map((order) => {
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
            status: (
              <span
                className={`font-medium ${
                  order.order_tracking && order.order_tracking.length > 0
                    ? order.order_tracking[
                        order.order_tracking.length - 1
                      ].status.toLowerCase() === "cancelled"
                      ? "text-red-500" // Red for cancelled orders
                      : order.order_tracking[
                            order.order_tracking.length - 1
                          ].status.toLowerCase() === "order placed"
                        ? "text-teal-500" // Teal for "Order Placed" (Pending)
                        : "text-tealclr" // Default color for other statuses
                    : "text-teelclr" // Default color if no tracking status exists
                }`}
              >
                {order.status}
              </span>
            ),
            actions: (
              <div className="flex relative space-x-2">
                <OrderActions
                  order={order}
                  setShowOrderBids={setShowOrderBids}
                />
                <button
                  onClick={async (e) => {
                    e.stopPropagation();

                    try {
                      await orderDelete({
                        path: `/orders/${order.order_uuid}`,
                      }).unwrap();

                      toast.success(`Order deleted successfully`);
                    } catch (error) {
                      console.error(error);
                      toast.error("Failed to delete order");
                    }
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-pinkclr hover:text-pinkclr"
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
    setSelectedOrder(row.raw);
    setIsOrderDetailModalOpen(true);
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
    setCurrentPage(1); 
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <div className="mt-12  flex bg-[#F2F7FB] flex-col gap-12 px-8">
      {showOrderBids ? (
        <OrderBids
          isOpen={showOrderBids}
          setBidsModal={setShowOrderBids} 
        />
      ) : (
        <DynamicTable
          tableTitle="All Orders"
          columns={columns}
          data={orders}
          onSearch={handleSearch}
          currentPage={currentPage}
          totalItems={totalItems}
          itemsPerPage={itemsPerPage}
          onPageChange={handlePageChange}
          isLoading={isLoading}
          showAddButton={false}
        />
      )}
    </div>
  );
};

export default AllOrders;
