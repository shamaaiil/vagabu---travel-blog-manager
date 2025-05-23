import React, { useState, useEffect } from "react";
import { CreditCard, Package, Plane } from "lucide-react";
import { useParams } from "react-router-dom";
import { useGetQuery } from "@/services/apiService";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import OrderInvoice from "./OrderInvoice";
import BackButton from "@/ui/BackButton";
import CustomBox from "@/ui/CustomBox";
import DynamicTable from "@/pages/dashboard/tables";
import ProductItem from "@/ui/OrderItem";
import FormattedDate from "@/common/FormattedDate";

const ProofsColumns = [
  { key: "note", label: "Seller Note" },
  { key: "feedback", label: "Customer Feedback" },
  { key: "status", label: "Order Status" },
]

const OrderDetails = () => {
  const { uuid } = useParams();
  const [showInvoice, setShowInvoice] = useState(false);
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const authToken = localStorage.getItem("token");

  const {
    data: orderData,
    isLoading: isOrderLoading,
    error: orderError,
  } = useGetQuery(
    {
      path: `/orders/${uuid}`,
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    },
    {
      refetchOnMountOrArgChange: true,
      skip: !authToken || !uuid,
    },
  );

  const order_Id = order?.id;
  console.log(order_Id ,"iddd")

  const {
    data: orderProofs,
    isLoading: isProofsLoading,
    error: proofsError,
  } = useGetQuery(
    {
      path: `orders/order-proofs/${order_Id}`,
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    },
    {
      skip: !order_Id || !authToken,
    },
  );
  console.log(orderProofs , "oopppp")
  useEffect(() => {
    if (!authToken) {
      toast.error("Authentication token not found. Please log in.");
      navigate("/login");
      return;
    }

    if (orderError) {
      console.error("Order fetch error:", {
        status: orderError.status,
        data: orderError.data,
        message: orderError.message,
      });
      if (orderError.status === 401) {
        toast.error("Authentication error. Please log in again.");
        localStorage.removeItem("token");
        navigate("/login");
      } else {
        toast.error(
          `Error fetching order details: ${orderError.data?.message || "Unknown error"}`,
        );
      }
    }

    if (proofsError) {
      console.error("Order proofs fetch error:", {
        status: proofsError.status,
        data: proofsError.data,
        message: proofsError.message,
      });
      toast.error(
        `Error fetching order proofs: ${proofsError.data?.message || "Unknown error"}`,
      );
    }
  }, [orderError, proofsError, navigate, authToken]);

  useEffect(() => {
    if (orderData?.data) {
      setOrder(orderData.data);
    }
  }, [orderData]);

  if (isOrderLoading) {
    return (
      <div className="flex justify-center items-center py-10">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-teal-500"></div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="flex justify-center items-center py-10">
        <div className="text-gray-500">No order data available</div>
      </div>
    );
  }

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };


  const handleInvoiceClick = () => {
    setShowInvoice(true);
  };

  if (showInvoice) {
    return (
      <OrderInvoice order={orderData} onBack={() => setShowInvoice(false)} />
    );
  }

  // const orderStatus = getCurrentStatus();
  const orderDate = formatDate(order.created_at);
  const orderTotal = parseFloat(order.total_price).toFixed(2);
  const orderId = order.id;
  const orderUuid = order.order_uuid;

  const formattedProofsData = orderProofs?.data?.map((proof) => ({
    note : proof.note,
    feedback : proof.feedback,
    status : proof.status,
  }))

  return (
    <div className="w-full">
      <div className="min-h-screen mt-6 flex bg-[#F2F7FB] flex-col gap-6 px-4 md:px-8">
        {/* Header - Order Title and Email Button */}
        <div className="flex flex-col sm:flex-row justify-between gap-4">
          <h2 className="text-pinkclr text-xl md:text-2xl font-bold">
            Order Details
          </h2>
          <BackButton />
        </div>

        {/* Order Summary Card */}
        <div className="bg-white p-4 md:p-6 rounded-xl shadow-md">
          <div className="flex flex-col sm:flex-row justify-between items-start mb-4 sm:items-center gap-4">
            {/* Order ID Section */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 mb-4 sm:mb-0">
              <Package className="text-pinkclr" />
              <p className="text-sm sm:text-base">Order</p>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-6 h-6 hidden sm:block"
              >
                <path
                  fillRule="evenodd"
                  d="M16.72 7.72a.75.75 0 0 1 1.06 0l3.75 3.75a.75.75 0 0 1 0 1.06l-3.75 3.75a.75.75 0 1 1-1.06-1.06l2.47-2.47H3a.75.75 0 0 1 0-1.5h16.19l-2.47-2.47a.75.75 0 0 1 0-1.06Z"
                  clipRule="evenodd"
                />
              </svg>
              <div className="bg-gray-50 text-gray-800 text-sm py-1 font-bold border-2 px-3 rounded-2xl">
                #{orderId}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 items-center flex-wrap w-full sm:w-auto">
              <button
                onClick={handleInvoiceClick}
                className="bg-blue-50 border text-teal-500 px-4 py-2 rounded-md text-sm md:px-5 md:py-2 hover:bg-blue-100 transition-colors w-full sm:w-auto"
              >
                Invoice
              </button>
              <button className="bg-teelclr text-white px-4 py-2 rounded-md text-sm md:px-5 md:py-2 hover:bg-teal-600 transition-colors w-full sm:w-auto">
                Send Email
              </button>
            </div>
          </div>

          {/* Order Details */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-4">
            <h2 className="text-gray-800 text-lg md:text-xl font-bold">
              <span className="text-gray-800">
                Order Number: #{order.order_number}
              </span>
            </h2>
            <div className="flex gap-2 flex-wrap">
              <span className="text-xs sm:text-sm text-pinkclr font-bold border-pinkclr border-2 bg-amber-50 px-3 py-1 rounded-full">
                {order.fulfillment_type === "delivery" ? "Shipping" : "Pickup"}
              </span>
  
            </div>
          </div>
        </div>

        <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <CustomBox>
              <h1 className="text-pinkclr p-4 text-xl">Timeline</h1>
              <hr />
              <div className="p-4">
                {order?.order_tracking?.length > 0 ? (
                  [...order.order_tracking].reverse().map((tracking, index) => (
                    <div
                      key={tracking.id}
                      className={
                        index < order.order_tracking.length - 1
                          ? "text-[#9BA6B7]"
                          : ""
                      }
                    >
                      <div className="flex justify-between ">
                        {/* <p>{formatDate(tracking.update_time)}</p> */}
                        <FormattedDate date={tracking.update_time}/>
                        <p className="w-[50%]">{tracking.status}</p>
                      </div>
                      <div className="flex justify-between mb-4 py-4a">
                        <p>
                          {new Date(tracking.update_time).toLocaleTimeString(
                            [],
                            {
                              hour: "2-digit",
                              minute: "2-digit",
                            },
                          )}
                        </p>
                        <p className="w-[50%]">{tracking.details}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="flex justify-between">
                    <p>{orderDate}</p>
                    <p>Order has been placed</p>
                  </div>
                )}
              </div>
            </CustomBox>
          </div>
          <div>
            <CustomBox>
              <h1 className="text-pinkclr p-4 text-xl">Shipment & Details</h1>
              <hr />
              <div className="p-4">
                <div className="bg-white rounded-xl max-w-md">
                  <div className="flex items-center mb-6">
                    <div>
                      <p className="text-gray-800 font-medium">
                        {order.user?.name || `Customer #${order.user_id}`}
                      </p>
                      <p className="text-blue-600 text-sm sm:text-xs">
                        {order.user?.email || "customer@example.com"}
                      </p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-6">
                    <div>
                      <p className="text-textclr text-lg mb-1">Recipient</p>
                      <p className="text-gray-800 font-medium">
                        {order.user?.name || `Customer #${order.user_id}`}
                      </p>
                    </div>

                    <div className="">
                      <p className="text-textclr text-lg mb-1 ">
                        Delivery Address
                      </p>
                      <p className="text-gray-800 font-medium">
                        {`${order?.user_address?.address}, ${order?.user_address?.city}, ${order?.user_address?.state}, ${order?.user_address?.country}`}
                      </p>
                    </div>
                    <div>
                      <p className="text-textclr text-lg mb-1">Email</p>
                      <p className="text-gray-800 font-medium">
                        {order?.customer?.email}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CustomBox>
          </div>
          <div>
            <CustomBox>
              <h1 className="p-4 text-pinkclr text-xl">Payment Info</h1>
              <hr />
              <div className="p-4">
                <div className="flex justify-between items-center mb-6">
                  <CreditCard className="text-teelclr" size={28} />
                  <span
                    className={`${
                      order.payment_status === "paid"
                        ? "text-green-500 bg-green-50 border-green-500"
                        : "text-yellow-500 bg-yellow-50 border-yellow-500"
                    } border-2 px-4 py-1 rounded-2xl text-sm`}
                  >
                    {order.payment_status === "paid" ? "Paid" : "Pending"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <div>
                    <h1 className="text-gray-400">Transaction Id</h1>
                    <h1>{}</h1>
                  </div>
                  <div>
                    <h1 className="text-gray-400">Payment Method</h1>
                    <h1 className="text-textclr font-semibold text-xl">
                      {order.payment_method?.method}
                    </h1>
                  </div>
                </div>
              </div>
            </CustomBox>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <CustomBox>
              <h1 className="p-4 text-pinkclr text-xl">Purchase Summary</h1>
              <hr />
            <ProductItem name={order.order_details[0].product_name} price={order.order_details[0].price} quantity={order.order_details[0].quantity}/>
          </CustomBox>
          <CustomBox>
            <h1 className="p-4 text-pinkclr text-xl">Purchase Summary</h1>
            <hr />
            <div className="p-4 flex flex-col text-textclr">
              <div className="flex justify-between py-4">
                <h1>Subtotal</h1>
                <h1 className="font-semibold">${orderTotal}</h1>
              </div>
              <div className="flex justify-between  py-4">
                <h1>Discount</h1>
                {/* <h1 className="font-semibold">${orderTotal}</h1> */}
              </div>
              <div className="flex justify-between  py-4">
                <h1>Delivery Charges</h1>
                {/* <h1 className="font-semibold">${orderTotal}</h1> */}
              </div>
              <div className="flex justify-between  py-4">
                <h1>Estimated Tax</h1>
                <h1 className="font-semibold">
                  ${(parseFloat(orderTotal) * 0.185).toFixed(2)}
                </h1>
              </div>
              <hr />
              <div className="flex justify-between py-2 text-xl">
                <h1 className="font-semibold">Grand Total</h1>
                {/* <h1>{}</h1> */}
              </div>
            </div>
          </CustomBox>
        </div>
   
        <div className="grid grid-cols-1">
          <CustomBox>
             <DynamicTable
             tableTitle="Order Proofs"
              columns={ProofsColumns}
              data={formattedProofsData}
             />
          </CustomBox>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
