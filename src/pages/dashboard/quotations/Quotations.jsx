import React, { useState } from "react";
import { Eye } from "lucide-react";
import DynamicTable from "../tables";
import { useGetQuery } from "@/services/apiService";
import QuoteDetailModal from "./QuoteDetailModal";

const Quotations = () => {
  const { data, isLoading, isError, error } = useGetQuery({
    path: "/quote-requests",
  });

  const columns = [
    { label: "Customer", key: "full_name" },
    { label: "Front Image", key: "front_image" },
    { label: "Back Image", key: "back_image" },
    { label: "Created At", key: "created_at" },
    { label: "Actions", key: "actions" },
  ];

  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedQuote, setSelectedQuote] = useState(null); // State to store the selected quote

  const handleView = (row) => {
    setSelectedQuote(row); // Store the selected quote
    setIsDetailModalOpen(true);
  };

  const quotationData = data?.data || [];

  const dataWithActions = quotationData.map((quote) => ({
    ...quote,
    full_name: quote.customer.full_name,
    actions: (
      <div className="flex gap-2">
        <Eye
          size={16}
          className="text-pinkclr cursor-pointer ml-5 hover:text-pink-700"
          onClick={() => handleView(quote)}
        />
      </div>
    ),
    front_image: (
      <img
        src={quote.front_image}
        alt="Front"
        className="w-16 h-16 object-cover rounded-md"
      />
    ),
    back_image: (
      <img
        src={quote.back_image}
        alt="Back"
        className="w-16 h-16 object-cover rounded-md"
      />
    ),
  }));

  return (
    <>
      <div className="mt-12 px-8">
        <DynamicTable
          tableTitle="Quotations"
          columns={columns}
          data={dataWithActions}
          onEdit={handleView}
          onSearch={(search) => console.log("Search:", search)}
          onPageChange={(page) => console.log("Page:", page)}
          currentPage={1}
          totalItems={dataWithActions.length}
          itemsPerPage={10}
        />
      </div>

      {isDetailModalOpen && (
        <QuoteDetailModal
          isOpen={isDetailModalOpen}
          onClose={() => {
            setIsDetailModalOpen(false);
            setSelectedQuote(null); // Clear selected quote on close
          }}
          quoteData={{
            customerName: selectedQuote?.customer?.full_name || "N/A",
            product: selectedQuote?.product || "N/A",
            date: selectedQuote?.created_at || "N/A",
          }}
          sellerQuotes={selectedQuote?.seller_quotes || []} // Pass seller quotes if available
          data={selectedQuote} // Pass the entire quote object as data prop
        />
      )}
    </>
  );
};

export default Quotations;
