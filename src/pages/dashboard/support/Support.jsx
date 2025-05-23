import {
  useGetQuery,
  usePatchMutation,
  usePostMutation,
} from "@/services/apiService";
import React, { useState, useEffect, useCallback } from "react";
import { FaArrowRight } from "react-icons/fa";
import { MdAttachEmail, MdAttachFile } from "react-icons/md";
import { useParams } from "react-router-dom";

const Support = () => {
  const [activeTab, setActiveTab] = useState("All");
  const [message, setMessage] = useState("");
  const [showTickets, setShowTickets] = useState(true);
  const [showChat, setShowChat] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTicketUuid, setSelectedTicketUuid] = useState(null);
  const [selectedTicketId, setSelectedTicketId] = useState(null);
  const [error, setError] = useState(null);
  const [assignee, setAssignee] = useState("");
  const [status, setStatus] = useState("");
  const [priority, setPriority] = useState("");
  const { uuid } = useParams();
  const [createChat, { isLoading: creatingChat }] = usePostMutation();
  const [updateStatus, { isLoading: updatingStatus }] = usePatchMutation();

  // Fetch all support tickets
  const { data: supportTicketsResponse, isLoading: ticketsLoading } =
    useGetQuery({
      path: "/support-tickets",
      tag: ["SupportTickets"],
    });

  const { data: users } = useGetQuery({
    path: "users",
  });

  const supportTickets = supportTicketsResponse?.data || [];

  // Fetch selected ticket's messages
  const { data: selectedTicketResponse, isLoading: messagesLoading } =
    useGetQuery({
      path: selectedTicketUuid
        ? `admin/support-tickets/${selectedTicketUuid}`
        : null,
      skip: !selectedTicketUuid,
    });

  const selectedTicketData = selectedTicketResponse?.data || null;

  // Set the initial selected ticket from URL parameter if available
  useEffect(() => {
    if (uuid) {
      setSelectedTicketUuid(uuid);
      if (window.innerWidth < 768) {
        setShowTickets(false);
        setShowChat(true);
      }
    }
  }, [uuid]);

  // Handle window resize for responsive layout
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setShowTickets(true);
        setShowChat(true);
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Current messages for selected ticket
  const currentMessages = selectedTicketData?.messages || [];

  // Get current ticket details
  const currentTicket = supportTickets.find(
    (ticket) => ticket.support_ticket_uuid === selectedTicketUuid,
  );

  // Convert status strings to display format (capitalize first letter)
  const formatStatus = (status) => {
    if (!status) return "";
    if (status === "in_progress") return "In Progress";
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  // Format timestamp to readable time
  const formatTime = (timestamp) => {
    if (!timestamp) return "";
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  // Format date for ticket display
  const formatDate = (timestamp) => {
    if (!timestamp) return "";
    const date = new Date(timestamp);
    return date.toLocaleDateString("en-US", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // Filter tickets based on active tab
  const filteredTickets = supportTickets.filter((ticket) => {
    if (activeTab === "All") return true;
    return formatStatus(ticket.status) === activeTab;
  });

  // Handle ticket selection
  const handleTicketClick = useCallback((uuid, id) => {
    setSelectedTicketUuid(uuid);
    setSelectedTicketId(id);
    setError(null);
    if (window.innerWidth < 768) {
      setShowTickets(false);
      setShowChat(true);
    }
  }, []);

  // Handle back button on mobile
  const handleBackToTickets = useCallback(() => {
    setShowTickets(true);
    setShowChat(false);
  }, []);

  // Toggle ticket action modal and prepopulate form
  const toggleModal = useCallback(() => {
    if (!isModalOpen && currentTicket) {
      setAssignee(currentTicket.assignee || "");
      setStatus(currentTicket.status || "");
      setPriority(currentTicket.priority || "");
    }
    setIsModalOpen((prev) => !prev);
  }, [isModalOpen, currentTicket]);

  // Handle sending a message
  const handleSendMessage = useCallback(async () => {
    if (!message.trim() || !selectedTicketId) return;

    try {
      const response = await createChat({
        path: `/support-tickets/createChat/${selectedTicketId}`,
        body: { message },
      }).unwrap();
      setMessage("");
      setError(null);
    } catch (err) {
      console.error("Failed to send message:", err);
      setError("Failed to send message. Please try again.");
    }
  }, [message, selectedTicketId, createChat]);

  // Handle key press for message input
  const handleKeyPress = useCallback(
    (e) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleSendMessage();
      }
    },
    [handleSendMessage],
  );

  // Determine if current user is the sender of a message
  const isCurrentUser = (userId) => {
    return userId === 1;
  };

  const handleSubmitUpdate = async (e) => {
    e.preventDefault();

    // Validate form data
    if (!assignee || !status || !priority) {
      setError("Please select an assignee, status, and priority.");
      return;
    }

    try {
      console.log("Updating ticket:", selectedTicketUuid, {
        assigned_to: assignee,
        status,
        priority,
      });
      await updateStatus({
        path: `/support-tickets/${selectedTicketUuid}`,
        body: {
          assigned_to: assignee,
          status,
          priority,
        },
      }).unwrap();
      setIsModalOpen(false);
      setError(null);
    } catch (err) {
      console.error("Update failed:", JSON.stringify(err, null, 2));
      setError(
        err?.data?.message || "Failed to update ticket. Please try again.",
      );
    }
  };

  return (
    <div className="flex flex-col md:flex-row p-2 md:p-4 min-h-screen">
      {/* Left Panel - Tickets List */}
      <div
        className={`${
          showTickets ? "block" : "hidden"
        } md:block md:w-1/2 bg-white rounded-xl shadow-sm md:mr-4 p-4 md:p-6 mb-4 md:mb-0 overflow-y-auto`}
      >
        <h2 className="text-2xl font-bold text-pinkclr mb-4 md:mb-6">
          Tickets
        </h2>

        {/* Tabs */}
        <div className="bg-gray-100 rounded-md mb-4 md:mb-6 overflow-x-auto">
          <div className="flex whitespace-nowrap justify-between">
            {["All", "Open", "In Progress", "Closed"].map((tab) => (
              <button
                key={tab}
                className={`py-2 md:py-4 px-3 md:px-4 text-xs md:text-sm font-medium ${
                  activeTab === tab
                    ? "border-b-2 border-pinkclr"
                    : "text-gray-500 hover:text-gray-700"
                }`}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Tickets List */}
        <div className="space-y-3">
          {ticketsLoading ? (
            <div className="text-center py-4">Loading tickets...</div>
          ) : filteredTickets.length > 0 ? (
            filteredTickets.map((ticket) => (
              <div
                key={ticket.support_ticket_uuid}
                className={`flex items-center p-2 md:p-3 rounded-xl cursor-pointer hover:bg-gray-50 ${
                  ticket.support_ticket_uuid === selectedTicketUuid
                    ? "border border-pinkclr"
                    : ""
                }`}
                onClick={() =>
                  handleTicketClick(ticket.support_ticket_uuid, ticket.id)
                }
              >
                <div className="w-6 md:w-8 h-6 md:h-8 flex-shrink-0 bg-gray-200 rounded-md text-center flex items-center justify-center text-gray-600 mr-2">
                  {ticket.id}
                </div>
                <div className="flex-grow min-w-0">
                  <h3 className="font-medium text-gray-800 text-sm md:text-base truncate">
                    {ticket.ticket_number}
                  </h3>
                  <p className="text-gray-500 text-xs md:text-sm truncate">
                    {ticket.subject}
                  </p>
                  <p className="text-gray-500 text-xs md:text-sm truncate">
                    {ticket.message}
                  </p>
                </div>
                <div className="text-right ml-2">
                  <p className="text-xs text-gray-500">
                    {ticket.messages && ticket.messages.length > 0
                      ? formatDate(ticket.messages[0].created_at)
                      : "No date"}
                  </p>
                  <span
                    className={`text-xs px-2 py-1 rounded-md mt-1 inline-block flex justify-center ${
                      ticket.status === "closed"
                        ? "bg-blue-100 text-blue-600"
                        : ticket.status === "in_progress"
                          ? "bg-red-100 text-red-600"
                          : "bg-green-100 text-green-600"
                    }`}
                  >
                    {formatStatus(ticket.status)}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-4 text-gray-500">
              No tickets found
            </div>
          )}
        </div>
      </div>

      {/* Right Panel - Chat */}
      <div
        className={`${
          showChat ? "block" : "hidden md:block"
        } md:block md:w-2/3 bg-white rounded-xl shadow-sm flex flex-col min-h-[600px] md:min-h-[700px] relative`}
      >
        {selectedTicketUuid ? (
          <>
            {/* Chat Header */}
            <div className="p-3 md:p-4 border-b flex items-center">
              {window.innerWidth < 768 && (
                <button
                  className="mr-2 p-1 rounded-full hover:bg-gray-100"
                  onClick={handleBackToTickets}
                  aria-label="Back to tickets"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              )}
              <div className="w-8 md:w-10 h-8 md:h-10 rounded-full mr-2 md:mr-3 bg-gray-200 flex items-center justify-center text-gray-500">
                {(
                  selectedTicketData?.user?.full_name?.[0] || "U"
                ).toUpperCase()}
              </div>
              <div>
                <h3 className="font-medium text-sm md:text-base">
                  {selectedTicketData?.user?.full_name}
                </h3>
                <p className="text-xs md:text-sm text-gray-500">
                  {selectedTicketData?.ticket_number}
                </p>
              </div>
              <button
                className="ml-auto relative"
                onClick={toggleModal}
                aria-label="Ticket actions"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 md:h-6 w-5 md:w-6 text-gray-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                </svg>
              </button>

              {/* Modal */}
              {isModalOpen && (
                <div className="fixed inset-0 z-50 bg-black bg-opacity-30 flex items-center justify-center">
                  <div className="bg-white rounded-xl shadow-lg border border-gray-200 w-full max-w-3xl p-6 mx-4">
                    <h2 className="text-pinkclr text-lg font-semibold mb-4 border-b pb-2">
                      Update
                    </h2>

                    <form className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Assign to
                        </label>
                        <select
                          className="w-full border rounded-md px-4 py-2 text-sm text-gray-700 focus:outline-none"
                          onChange={(e) => setAssignee(e.target.value)}
                          value={assignee}
                        >
                          <option value="">Select Assignee</option>
                          {users?.data?.map((user) => (
                            <option key={user.id} value={user.id}>
                              {user.full_name}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Status
                        </label>
                        <select
                          className="w-full border rounded-md px-4 py-2 text-sm text-gray-700 focus:outline-none"
                          value={status}
                          onChange={(e) => setStatus(e.target.value)}
                        >
                          <option value="">Select Status</option>
                          <option value="open">Open</option>
                          <option value="in_progress">In Progress</option>
                          <option value="closed">Closed</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Priority
                        </label>
                        <select
                          className="w-full border rounded-md px-4 py-2 text-sm text-gray-700 focus:outline-none"
                          value={priority}
                          onChange={(e) => setPriority(e.target.value)}
                        >
                          <option value="">Select Priority</option>
                          <option value="low">Low</option>
                          <option value="medium">Medium</option>
                          <option value="high">High</option>
                        </select>
                      </div>

                      <div className="col-span-full flex justify-center mt-4 space-x-4">
                        <button
                          className="bg-teelclr text-white px-6 py-2 rounded hover:bg-teal-600 text-sm"
                          onClick={handleSubmitUpdate}
                          type="button"
                        >
                          {updatingStatus ? "Updating..." : "Submit"}
                        </button>
                        <button
                          className="bg-gray-200 text-gray-700 px-6 py-2 rounded hover:bg-gray-400 text-sm"
                          onClick={() => setIsModalOpen(false)}
                          type="button"
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </div>

            {/* Messages Container */}
            <div className="flex-grow p-3 md:p-4 overflow-y-auto space-y-3 md:space-y-4">
              {messagesLoading ? (
                <div className="text-center py-4">Loading messages...</div>
              ) : currentMessages.length > 0 ? (
                currentMessages.map((msg) => {
                  const sender = msg.user;
                  const isSender = isCurrentUser(sender?.id);

                  return (
                    <div
                      key={msg.id}
                      className={`flex ${isSender ? "justify-end" : "justify-start"}`}
                    >
                      {!isSender && (
                        <div className="mr-2 flex-shrink-0">
                          <div className="w-6 md:w-8 h-6 md:h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 text-xs">
                            {sender?.full_name?.[0] || "U"}
                          </div>
                        </div>
                      )}
                      <div
                        className={`max-w-xs p-2 md:p-3 rounded-lg ${
                          isSender
                            ? "bg-teal-500 text-white"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        <p className="text-xs md:text-sm">{msg.message}</p>
                        <p
                          className={`text-xs mt-1 ${
                            isSender ? "text-teal-100" : "text-gray-500"
                          }`}
                        >
                          {formatTime(msg.created_at)}
                        </p>
                      </div>
                      {isSender && (
                        <div className="ml-2 flex-shrink-0">
                          <div className="w-6 md:w-8 h-6 md:h-8 rounded-full bg-teal-200 flex items-center justify-center text-teal-700 text-xs">
                            {sender?.full_name?.[0] || "A"}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-4 text-gray-500">
                  No messages yet
                </div>
              )}
            </div>

            {/* Message Input */}
            <div className="p-3 md:p-4 border-t">
              <div className="flex items-center bg-gray-50 rounded-lg border border-gray-200 overflow-hidden">
                <input
                  type="text"
                  placeholder="Write a message..."
                  className="flex-grow px-3 md:px-4 py-2 bg-transparent focus:outline-none text-sm"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                />
                <button
                  className="p-2 bg-teal-500 text-white rounded-r hover:bg-teal-600 transition"
                  onClick={handleSendMessage}
                  disabled={!message.trim() || creatingChat}
                  aria-label="Send message"
                >
                  {creatingChat ? (
                    <FaArrowRight />
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 md:h-5 w-4 md:w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                </button>
                <button className="p-2">
                  <MdAttachFile />
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500">
            <div className="text-center p-6">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-12 w-12 mx-auto mb-4 text-gray-300"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                />
              </svg>
              <p className="text-lg font-medium">No chat selected</p>
              <p className="text-sm mt-1">
                Select a ticket to view the conversation
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Support;
