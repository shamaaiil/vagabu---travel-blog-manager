import React, { useState, useRef, useEffect } from "react";
import { usePostMutation } from "@/services/apiService";
import EditOrderDropDown from "./EditOrderDropDown";
import {
  EyeIcon,
  PaperAirplaneIcon,
  TruckIcon,
  CheckBadgeIcon,
  XCircleIcon,
  PencilSquareIcon,
} from "@heroicons/react/24/solid";
import { useNavigate } from "react-router-dom";
import ReusableModal from "../OrderDetail/ReusableModal";
import { toast } from "react-toastify";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import Editor from "@/components/common/Editor.jsx";

const OrderActions = ({ order, refetchOrder, onSuccess }) => {
  const [updateDeliveryStatus, { isLoading, error }] = usePostMutation();
  const [sendEmail] = usePostMutation();
  const [createTracking] = usePostMutation();
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    status: order.order_tracking?.[0]?.status || "",
    details: order.order_tracking?.[0]?.details || "",
  });

  const [trackingList, setTrackingList] = useState(
    order.order_tracking?.map((track) => ({
      id: track.id,
      title: `#${track.id}`,
      detail: track.details,
      status: track.status,
      date: new Date(track.created_at).toLocaleDateString(),
      time: new Date(track.update_time).toLocaleTimeString(),
    })) || []
  );

  useEffect(() => {
    if (order?.order_tracking && order?.order_tracking.length > 0) {
      const latestTracking = order.order_tracking[0];
      setFormData({
        status: latestTracking.status || "",
        details: latestTracking.details || "",
      });

      setTrackingList(
        order.order_tracking?.map((track) => ({
          id: track.id,
          title: `#${track.id}`,
          detail: track.details,
          status: track.status,
          date: new Date(track.created_at).toLocaleDateString(),
          time: new Date(track.update_time).toLocaleTimeString(),
        })) || []
      );
    }
  }, [order]);

  const handleAddTrack = async () => {
    if (!formData.status || !formData.details) {
      toast.error("Please fill in both status and details fields");
      return;
    }

    try {
      const data = new FormData();
      data.append("status", formData.status);
      data.append("details", formData.details);
      data.append("order_id", order.id);

      const response = await createTracking({
        path: "/order-tracking",
        method: "POST",
        body: data,
      });

      if (response && !response.error) {
        const newTrackingItem = response.data;
        setTrackingList((prev) => [
          {
            id: newTrackingItem.id,
            title: `#${newTrackingItem.id}`,
            detail: newTrackingItem.details,
            status: newTrackingItem.status,
            date: new Date(newTrackingItem.created_at).toLocaleDateString(),
            time: new Date(newTrackingItem.update_time).toLocaleTimeString(),
          },
          ...prev,
        ]);

        setFormData({ status: "", details: "" });
        setIsModalOpen(false);
        toast.success("Order tracking updated successfully");
        if (refetchOrder) refetchOrder();
      } else {
        toast.error(response.error?.data?.message || "Error adding tracking");
        console.error(response.error?.data?.message || "Error adding tracking");
      }
    } catch (error) {
      toast.error("Failed to add tracking info");
      console.error("Failed to add tracking info:", error);
    }
  };

  const [isDeliveryModalOpen, setIsDeliveryModalOpen] = useState(false);
  const [deliveryForm, setDeliveryForm] = useState({
    paymentStatus: order?.payment_status || "",
    deliveryStatus: order?.order_tracking?.[0]?.status || "",
    note: order?.order_tracking?.[0]?.details || "",
  });
  const [isCancelOpen, setIsCancelOpen] = useState(false);
  const [isRefundOpen, setIsRefundOpen] = useState(false);
  const [isEmailModal, setIsEmailModal] = useState(false);
  const email = order?.customer?.email;
  const [emailForm, setEmailForm] = useState({
    email: email,
    subject: "",
    message: "",
  });

  const handleSendEmail = async () => {
    try {
      await sendEmail({
        path: `/marketing/send-email/${order?.order_uuid}`,
        method: "POST",
        body: emailForm,
      });

      setIsEmailModal(false);
      setEmailForm({ email: {}, subject: "", message: "" });
      toast.success("Email sent successfully");
    } catch (error) {
      console.error(error);
      toast.error("Failed to send email");
    } finally {
      setIsEmailModal(false);
    }
  };

  const handleDirectInputChange = (e) => {
    const { name, value } = e.target;
    setEmailForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleQuillChange = (value) => {
    setEmailForm((prev) => ({
      ...prev,
      message: value,
    }));
  };

  const handleCancelConfirm = async () => {
    try {
      if (order.payment_status === "paid") {
        const response = await createTracking({
          path: `orders/${order.order_uuid}/cancel`,
          method: "POST",
          body: {
            orderId: order.order_uuid,
          },
        });

        if (response && !response.error) {
          toast.success("Order successfully cancelled!");
          setIsCancelOpen(false);
          if (refetchOrder) refetchOrder();
        } else {
          toast.error("Failed to cancel order.");
        }
      } else {
        toast.error("Order cannot be canceled as payment is not completed.");
      }
    } catch (error) {
      console.error("Failed to cancel the order:", error);
      toast.error("An unexpected error occurred while canceling the order.");
    }
  };

  const handleDeliveryUpdate = async () => {
    try {
      await updateDeliveryStatus({
        path: `/order/delivery-status/${order?.order_uuid}?_method=patch`,
        method: "POST",
        body: deliveryForm,
      }).unwrap();

      toast.success("Delivery status updated successfully");
      if (onSuccess) onSuccess();
    } catch (err) {
      console.error("Delivery update failed:", err);
      toast.error("Failed to update delivery status");
    }
  };

  const handleDelete = async (item) => {
    try {
      setTrackingList((prev) => prev.filter((i) => i.id !== item.id));
      toast.success("Tracking info deleted successfully");
      if (refetchOrder) refetchOrder();
    } catch (error) {
      toast.error("Failed to delete tracking info");
      console.error("Failed to delete tracking info:", error);
    }
  };

  const handleEdit = (item) => {
    // Implement if needed
  };

  const handleItemClick = (item) => {
    if (item.onClick) {
      item.onClick();
    } else if (item.to) {
      navigate(item.to);
    }
    setShowDropdown(false);
  };

  const handleClickOutside = (e) => {
    if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
      setShowDropdown(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const isCancelled =
    order.order_tracking &&
    order.order_tracking.length > 0 &&
    order.order_tracking[order.order_tracking.length - 1].status ===
      "Cancelled";

  const items = isCancelled
    ? [
        {
          label: "Detail",
          to: `/orders/${order.order_uuid}`,
          icon: <EyeIcon className="h-5 w-5 text-inherit" />,
        },
        {
          label: "Send",
          onClick: () => setIsEmailModal(true),
          icon: <PaperAirplaneIcon className="h-5 w-5 text-inherit" />,
        },
        {
          label: "Track Order",
          onClick: () => setIsModalOpen(true),
          icon: <TruckIcon className="h-5 w-5 text-inherit" />,
        },
        {
          label: "Delivery Status",
          onClick: () => setIsDeliveryModalOpen(true),
          icon: <PencilSquareIcon className="h-5 w-5 text-inherit" />,
        },
      ]
    : [
        {
          label: "Detail",
          to: `/orders/${order.order_uuid}`,
          icon: <EyeIcon className="h-5 w-5 text-inherit" />,
        },
        {
          label: "Send",
          onClick: () => setIsEmailModal(true),
          icon: <PaperAirplaneIcon className="h-5 w-5 text-inherit" />,
        },
        {
          label: "Track Order",
          onClick: () => setIsModalOpen(true),
          icon: <TruckIcon className="h-5 w-5 text-inherit" />,
        },
        ...(order.payment_status !== "completed"
          ? [
              {
                label: "Cancel",
                onClick: () => setIsCancelOpen(true),
                icon: <XCircleIcon className="h-5 w-5 text-inherit" />,
              },
            ]
          : []),
        {
          label: "Refund",
          onClick: () => setIsRefundOpen(true),
          icon: <XCircleIcon className="h-5 w-5 text-inherit" />,
        },
        {
          label: "Delivery Status",
          onClick: () => setIsDeliveryModalOpen(true),
          icon: <PencilSquareIcon className="h-5 w-5 text-inherit" />,
        },
        {
          label: "Order Bids",
          to: `/orders/${order.order_uuid}/bids`, // Navigate to bids page
          icon: <PencilSquareIcon className="h-5 w-5 text-inherit" />,
        },
      ];

  return (
    <div className="relative flex" ref={dropdownRef}>
      <button
        onClick={(e) => {
          e.stopPropagation();
          setShowDropdown((prev) => !prev);
        }}
        className="text-pinkclr hover:text-pinkclr"
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
            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0
              112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
          />
        </svg>
      </button>

      {showDropdown && (
        <EditOrderDropDown
          items={items}
          order={order}
          onItemClick={handleItemClick}
        />
      )}

      <ReusableModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Track Order"
        fields={[
          {
            name: "status",
            label: "Order Status",
            placeholder: "Enter order status (e.g. Processing, Shipped)",
            value: formData.status,
          },
          {
            name: "details",
            label: "Details",
            placeholder: "Enter tracking details",
            value: formData.details,
          },
        ]}
        values={formData}
        onChange={(name, value) =>
          setFormData((prev) => ({ ...prev, [name]: value }))
        }
        onSubmit={handleAddTrack}
        showTable={true}
        tableTitle="Tracking Detail"
        tableData={trackingList}
        tableActions={true}
        onDelete={handleDelete}
        onEdit={handleEdit}
      />

      <ReusableModal
        isOpen={isDeliveryModalOpen}
        onClose={() => setIsDeliveryModalOpen(false)}
        title="Delivery Status"
        fields={[
          {
            name: "paymentStatus",
            label: "Payment Status",
            placeholder: "Select Payment Status",
            value: deliveryForm.paymentStatus,
            type: "select",
            options: [
              { label: "Paid", value: "paid" },
              { label: "Unpaid", value: "unpaid" },
              { label: "Cancel", value: "cancel" },
              { label: "Refunded", value: "refunded" },
              { label: "Failed", value: "failed" },
            ],
          },
          {
            name: "deliveryStatus",
            label: "Delivery Status",
            placeholder: "Select Delivery Status",
            value: deliveryForm.deliveryStatus,
            type: "select",
            options: [
              { label: "Pending", value: "pending" },
              { label: "Processing", value: "processing" },
              { label: "Canceled", value: "canceled" },
              { label: "Disputed", value: "disputed" },
              { label: "Refunded", value: "refunded" },
              { label: "Completed", value: "completed" },
            ],
          },
          {
            name: "note",
            label: "Order Tracking Note",
            placeholder: "Add notes about order status",
            value: deliveryForm.note,
          },
        ]}
        fieldsWrapperClassName="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4 mt-4 sm:mt-6 mb-4"
        values={deliveryForm}
        onChange={(name, value) =>
          setDeliveryForm((prev) => ({ ...prev, [name]: value }))
        }
        onSubmit={handleDeliveryUpdate}
      />

      <ReusableModal
        isOpen={isCancelOpen}
        onClose={() => setIsCancelOpen(false)}
        title="Are you sure?"
        cancelTitle="You won't be able to revert this action."
        icon={<div className="text-5xl text-red-500">❗</div>}
        buttons={[
          {
            label: "Yes, cancel it",
            onClick: handleCancelConfirm,
            variant: "default",
          },
          {
            label: "No, keep it",
            onClick: () => setIsCancelOpen(false),
            variant: "cancel",
          },
        ]}
      />

      <ReusableModal
        isOpen={isRefundOpen}
        onClose={() => setIsRefundOpen(false)}
        title="Are you sure?"
        cancelTitle="You won't be able to revert this action."
        icon={<div className="text-5xl text-red-500">❗</div>}
        buttons={[
          {
            label: "Yes, refund it",
            onClick: handleCancelConfirm,
            variant: "default",
          },
          {
            label: "No, keep it",
            onClick: () => setIsRefundOpen(false),
            variant: "cancel",
          },
        ]}
      />

      {isEmailModal && (
        <div className="fixed inset-0 z-50 flex items-center w-full justify-center bg-black bg-opacity-40 p-4">
          <div className="bg-white rounded-xl p-4 sm:p-6 w-full max-w-3xl shadow-lg max-h-[90vh] overflow-y-auto">
            <div className="text-center border-b border-gray-300">
              <h2 className="text-center mb-4 text-pinkclr border-gray-300 font-bold text-lg sm:text-xl">
                Send Email
              </h2>
            </div>

            <div className="mt-4 space-y-4">
              <div className="w-full px-4">
                <input
                  type="email"
                  name="email"
                  value={emailForm.email}
                  onChange={handleDirectInputChange}
                  placeholder="Enter email"
                  className="w-full mt-1 p-2 border rounded-md text-sm sm:text-base"
                />
              </div>

              <div className="w-full px-4">
                <input
                  type="text"
                  name="subject"
                  value={emailForm.subject}
                  onChange={handleDirectInputChange}
                  placeholder="Enter subject"
                  className="w-full mt-1 p-2 border rounded-md text-sm sm:text-base"
                />
              </div>
              <div className="w-full px-4">
                <Editor
                  name={"message"}
                  value={emailForm.message}
                  onChange={handleDirectInputChange}
                  placeholder="Enter your message"
                  className="w-full mt-1 border rounded-md text-sm sm:text-base"
                ></Editor>
                <ReactQuill
                  value={emailForm.message}
                  onChange={handleQuillChange}
                  placeholder="Enter your message"
                  className="w-full mt-1 border rounded-md text-sm sm:text-base"
                  modules={{
                    toolbar: [
                      [{ header: "1" }, { header: "2" }, { font: [] }],
                      [{ list: "ordered" }, { list: "bullet" }],
                      ["bold", "italic", "underline"],
                      [{ align: [] }],
                      ["link"],
                    ],
                  }}
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={handleSendEmail}
                className="bg-teelclr text-white px-6 py-2 rounded-xl hover:bg-teal-700"
              >
                Send Email
              </button>
              <button
                onClick={() => setIsEmailModal(false)}
                className="bg-red-500 text-white px-6 py-2 rounded-xl hover:bg-red-600"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderActions;