import { useGetQuery } from "@/services/apiService";
import React from "react";

const QuoteDetailModal = ({
  isOpen,
  onClose,
  quoteData,
  sellerQuotes = [],
  data,
}) => {
  if (!isOpen) return null;
  const columns = [
    { label: "Seller", key: "seller" },
    { label: "Bid Date", key: "bidDate" },
    { label: "Price", key: "price" },
    { label: "Status", key: "status" },
  ];

  const uuid = data.quote_request_uuid;

  const { data: quoteBids } = useGetQuery({
    path: `admin/quote-bids/quote-request/${uuid}`,
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-2xl p-4 sm:p-6 w-full max-w-3xl shadow-xl overflow-y-auto max-h-[90vh]">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-pink-600 font-bold text-lg">Quote Detail</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-xl font-bold"
          >
            ✕
          </button>
        </div>

        {/* Customer & Product Info */}
        <div className="border rounded-lg p-4 mb-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 text-sm">
            <div>
              <p className="text-gray-500 mb-1">Customer Name</p>
              <p className="font-medium">{quoteData?.customerName}</p>
            </div>
            <div>
              <p className="text-gray-500 mb-1">Product</p>
              <p className="font-medium">{quoteData?.product}</p>
            </div>
            <div>
              <p className="text-gray-500 mb-1">Date</p>
              <p className="font-medium">{quoteData?.date}</p>
            </div>
          </div>
        </div>

        {/* Seller Table */}
        <h3 className="font-semibold text-gray-700 mb-2">
          Quotation By Seller
        </h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-gray-50">
              <tr>
                {columns.map((col) => (
                  <th
                    key={col.key}
                    className="text-left px-4 py-2 font-medium text-gray-500"
                  >
                    {col.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {quoteBids?.data?.map((quote, index) => (
                <tr key={index}>
                  <td className="px-4 py-2">
                    {quote.service_provider.service_provider_name}
                  </td>
                  <td className="px-4 py-2">
                    {" "}
                    {new Date(quote.created_at).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </td>
                  <td className="px-4 py-2">{quote.bid_price}</td>
                  <td className="px-4 py-2 font-medium">{quote.status}</td>
                </tr>
              ))}
              {quoteBids?.length === 0 && (
                <tr>
                  <td colSpan={4} className="text-center text-gray-400 py-4">
                    No seller data found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default QuoteDetailModal;
