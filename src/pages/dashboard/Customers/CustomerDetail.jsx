import React, { useEffect, useState } from "react";
import { useGetQuery } from "@/services/apiService";
import DynamicTable from "@/ui/DynamicTable";
import CustomerOrderDetails from "./CustomerOrderDetails";
import { useParams } from "react-router-dom";
import BackButton from "@/ui/BackButton";

const CustomerDetail = ({ customer, onBack }) => {
  const [showOrderDetails, setShowOrderDetails] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [iscustomer, setIsCustomer] = useState(customer || null);
  const [orders, setOrders] = useState([]);
  const { uuid } = useParams(); // Get uuid from URL params

  console.log("CustomerDetail received customer prop:", customer);
  console.log("CustomerDetail received uuid from params:", uuid);
  const id = customer.id

  // Fetch customer data using uuid from params
  const { data: customerData, isLoading: isCustomerLoading } = useGetQuery({
    path: `/customers/${uuid}`,
    skip: !uuid,
  });

  // Fetch orders using uuid from params
  const { data: ordersData, isLoading: isOrdersLoading } = useGetQuery({
    path: `/orders/?customer_id=${id}`,
    skip: !uuid,
  });

  // Update iscustomer when customerData is fetched
  useEffect(() => {
    if (customerData?.data) {
      console.log("Fetched customer data:", customerData.data);
      setIsCustomer(customerData.data);
    }
  }, [customerData]);

  // Update orders when ordersData is fetched
  useEffect(() => {
    if (ordersData?.data) {
      console.log("Fetched orders data:", ordersData.data);
      setOrders(ordersData.data);
    }
  }, [ordersData]);

  // Set initial customer data from prop if available and not yet fetched
  useEffect(() => {
    if (customer && !iscustomer) {
      console.log("Setting customer from prop:", customer);
      setIsCustomer(customer);
    }
  }, [customer, iscustomer]);

  const handleDetails = (order) => {
    setSelectedOrder(order);
    setShowOrderDetails(true);
  };

  const closeOrderDetails = () => {
    setShowOrderDetails(false);
    setSelectedOrder(null);
  };

  // Show loading state
  if (isCustomerLoading || isOrdersLoading) {
    return (
      <div className="fixed inset-0 bg-teelclr bg-opacity-50 flex justify-center items-center z-50">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-teelclr border-solid"></div>
      </div>
    );
  }

  // Show error if no customer data is available
  if (!iscustomer) {
    console.log("No customer data available");
    return <div>No customer data available</div>;
  }

  // Format orders data
  const formattedOrders = orders.map((order) => ({
    ...order,
    order_date: new Date(order.created_at).toLocaleDateString(),
    order_number: order.order_number,
    order_total: order.total_price,
    order_status: order.status,
    actions: (
      <button
        onClick={() => handleDetails(order)}
        className="bg-teal-500 text-white px-3 py-1 rounded-md"
      >
        Details
      </button>
    ),
    payment_method: order.payment_method?.name || "N/A",
    payment_status: order.payment_status || "N/A",
  }));

  const orderColumns = [
    { key: "order_number", label: "Order Number" },
    { key: "order_date", label: "Order Date" },
    { key: "order_total", label: "Order Total" },
    { key: "payment_method", label: "Payment Method" },
    { key: "payment_status", label: "Payment Status" },
    { key: "order_status", label: "Order Status" },
    { key: "actions", label: "Options" },
  ];

  if (showOrderDetails && selectedOrder) {
    return (
      <CustomerOrderDetails order={selectedOrder} onClose={closeOrderDetails} />
    );
  }

  return (
    <div className="p-6 min-h-screen">
      <div className="flex justify-end">
        <BackButton onClick={onBack} />
      </div>

      {/* Customer Basic Info */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="flex flex-col items-center gap-4">
          <img
            src={
              iscustomer.cnic_image ||
              "https://randomuser.me/api/portraits/lego/1.jpg"
            }
            alt="Customer Profile"
            className="w-40 h-40 rounded-full object-cover"
          />
        </div>

        <div className="flex flex-col p-4 gap-4 border-2 border-gray-300 rounded-xl w-full">
          {[
            { label: "ID", value: iscustomer.id },
            { label: "Name", value: iscustomer.full_name || iscustomer.fullName },
            { label: "Address", value: iscustomer.address || "N/A" },
            { label: "Email", value: iscustomer.email },
            { label: "Phone", value: iscustomer.phone_number || iscustomer.phoneNumber },
          ].map((item, index) => (
            <div
              key={index}
              className="flex justify-between text-sm text-[#555F7E]"
            >
              <p className="font-medium text-sm">{item.label}:</p>
              <p className="text-[#2B3674] font-bold">{item.value}</p>
            </div>
          ))}
        </div>

        <div className="flex flex-col p-4 gap-4 border-2 border-gray-300 rounded-xl w-full">
          {[
            {
              label: "Joined",
              value: new Date(iscustomer.created_at || iscustomer.createdAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              }),
            },
            {
              label: "Wallet Balance",
              value: `$${iscustomer.wallet?.balance || iscustomer.wallet || "0.00"}`,
            },
          ].map((item, index) => (
            <div
              key={index}
              className="flex justify-between text-sm text-[#555F7E]"
            >
              <p className="font-medium text-sm">{item.label}:</p>
              <p className="text-[#2B3674] font-bold">{item.value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Document Images */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-5">
        <h2 className="text-xl font-bold text-pinkclr mb-4">Document Images</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col items-center">
            <img
              src={
                iscustomer.cnic_image ||
                "https://randomuser.me/api/portraits/lego/1.jpg"
              }
              alt="CNIC Front Picture"
              className="rounded-lg shadow-md w-full max-w-[200px]"
            />
            <p className="mt-2 text-center text-gray-800 font-semibold">
              CNIC Front Picture
            </p>
          </div>

          <div className="flex flex-col items-center">
            <img
              src={
                iscustomer.credit_card_image ||
                "https://randomuser.me/api/portraits/lego/1.jpg"
              }
              alt="Credit Card Picture"
              className="rounded-lg shadow-md w-full max-w-[200px]"
            />
            <p className="mt-2 text-center text-gray-800 font-semibold">
              Credit Card Picture
            </p>
          </div>
        </div>
      </div>

      {/* Order History Table */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl text-pinkclr font-semibold mb-4">
          Order History
        </h2>
        <DynamicTable
          data={formattedOrders}
          columns={orderColumns}
          isLoading={isOrdersLoading}
          showAddButton={false}
          tableTitle=""
          hidePagination
        />
      </div>
    </div>
  );
};

export default CustomerDetail;