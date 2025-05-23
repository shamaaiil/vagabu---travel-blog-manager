import React from "react";

const SupportTicketsCard = ({ tickets = [] }) => {
  const getStatusStyles = (status) => {
    switch (status.toLowerCase()) {
      case 'resolved':
        return 'bg-[#E8F5E9] text-[#43A047]';
      case 'open':
        return 'bg-[#FCE4EC] text-[#D81B60]';
      case 'unresolved':
        return 'bg-[#FFEBEE] text-[#E53935]';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  return (
    <div className="bg-white p-6 rounded-3xl shadow-sm w-full max-w-md">
      <h3 className="text-xl font-bold text-[#2B3674]">Support Tickets</h3>
      <div className="mt-6 space-y-4">
        {tickets.length > 0 ? (
          tickets.map((ticket, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img
                  src={ticket.image}
                  alt={ticket.name}
                  className="w-12 h-12 rounded-full"
                />
                <div className="flex flex-col">
                  <span className="text-[#2B3674] font-semibold">{ticket.name}</span>
                  <span className="text-sm text-gray-500">{ticket.description}</span>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-500">{ticket.date}</span>
                <span
                  className={`px-3 py-1 text-sm rounded-full ${getStatusStyles(ticket.status)}`}
                >
                  {ticket.status}
                </span>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center text-gray-500 py-4">
            No support tickets to display
          </div>
        )}
      </div>
    </div>
  );
};

export default SupportTicketsCard;