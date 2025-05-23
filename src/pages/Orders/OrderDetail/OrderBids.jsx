import { useState } from "react";
import { useGetQuery } from "@/services/apiService";
import BackButton from "@/ui/BackButton";
import { useParams, useNavigate } from "react-router-dom";
import DynamicTable from "@/pages/dashboard/tables";
import FormattedDate from "@/common/FormattedDate";

 const columns = [
    { key: "seller", label: "Seller" },
    { key: "price", label: "Price" },
    { key: "status", label: "Status" },
  ];

 function OrderBids() {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; 
  const { uuid } = useParams(); 
  console.log(uuid)
  const navigate = useNavigate();

  // Fetch order data using order_uuid
  const {
    data: orderData,
    isLoading: orderLoading,
    error: orderError,
  } = useGetQuery({
    path: `/orders/${uuid}`,
  });

  console.log(orderData , "dataa")

  const quote_uuid = orderData?.data?.quote_uuid
  console.log(quote_uuid , "quote")

  const {data : quoteData} = useGetQuery({
    path : `quote-bids/quote-request/${quote_uuid}`
  })
  console.log(quoteData , "bidss")

 const formattedBids = quoteData?.data.map((bid) => ({
  seller : bid.service_provider.service_provider_name,
  price : bid.bid_price,
  status : bid.status
 }))

  // Handle the search term change
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to the first page on a new search
  };

  if (orderError) {
    return <div>Error fetching order: {orderError.message}</div>;
  }

  // if (bidsError) {
  //   return <div>Error fetching bids: {bidsError.message}</div>;
  // }

  return (
    <div className="p-6 min-h-screen">
      <div className="flex justify-end mb-4">
        <BackButton onClick={() => navigate(`/orders/${uuid}`)} />
      </div>

      {/* Order Details */}
      <div className="p-10 sm:p-2 border-b bg-white rounded-2xl mb-6">
        <div className="grid p-10 text-xl grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <p className="text-gray-500 mb-4">Customer Name</p>
            <p className="font-semibold text-[#2B3674]">
              {orderData?.data?.customer?.full_name }
            </p>
          </div>
          <div>
            <p className="text-gray-500 mb-4">Product</p>
            <p className="font-semibold text-[#2B3674]">
              {orderData?.product || "U-Shaped Pillow Case Tension Fabric Backdrop"}
            </p>
          </div>
          <div>
            <p className="text-gray-500 mb-4">Date</p>
            <p className="font-semibold text-[#2B3674]">
               <FormattedDate date={orderData.data.created_at}/>
            </p>
          </div>
        </div>
      </div>

     <DynamicTable
       tableTitle="Order Bids"
       columns={columns}
       data={formattedBids}
       itemsPerPage={itemsPerPage}
     />
    </div>
  );
}

export default OrderBids