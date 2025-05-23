import BackButton from "@/ui/BackButton";
import React from "react";

export default function OrderInvoice({ order }) {
  const getValue = (value) => value || "N/A";
  const invoiceData = {
    // invoiceNumber: `#INV${order?.data?.id || "N/A"}`,
    status: order.data.payment_status,
    from: {
      company: "Mecarvi Prints",
      address: "1055 Station Street Fremont, CA - 94539",
      phone: "510-875-0008",
    },
    to: {
      company: "Customer",
      address: getValue(order?.data?.user_address?.address || ""),
      address: getValue(order?.data?.user_address?.address || ""),
      city: getValue(order?.data?.user_address?.city || ""),
      state: getValue(order?.data?.user_address?.state || ""),
      country: getValue(order?.data?.user_address?.country || ""),
      // phone: "510-875-0005",
    },
    // to: order.data.user_address?.city,
    dates: {
      invoice: getValue(order?.data?.created_at || ""),
      due: getValue(order?.data?.updated_at || ""),
    },
    items: (order?.data?.order_details || []).map((item) => ({
      name: getValue(item.product_name || ""),
      price: parseFloat(item.price) || 0,
      size: item.variation_detail?.[0]?.size || "N/A", // If variation_detail has size info
    })),
    summary: {
      qty: `${(order?.data?.order_details || []).length || 0}`,
      unitPrice: `$${getValue(order?.data?.total_price || "")}`,
      subTotal: `$${getValue(order?.data?.total_price || "")}`,
      tax: "$0.00",
      giftCard: "$0.00",
      couponDiscount: "-",
      grandAmount: `$${getValue(order?.data?.total_price || "")}`,
    },
  };
  console.log(order, "oooo");

  return (
    <div className="bg-[#F2F7FB] px-8 mt-6 font-sans">
      <div className="flex justify-between mb-6">
        <div className="text-pinkclr font-bold text-xl md:text-2xl ">
          Order Invoice
        </div>
        <BackButton />
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-sm mb-4">
        <div className="flex justify-between items-center mb-8">
          <div>
            <img
              src="/src/assets/images/PRlogo.png"
              alt="Mecarvi Prints Logo"
              className="h-10"
            />
          </div>
          <div className="flex items-center">
            <div className="bg-[#E9F7E6] text-[#6AC75A] border-[#6AC75A] border-2 px-3 py-1 rounded-full font-bold">
              {invoiceData.status}
            </div>
          </div>
        </div>

        <div className="text-right mb-6">
          <div className="text-[#2B3674] text-2xl">
            Invoice: {invoiceData.invoiceNumber}
          </div>
        </div>

        <div className="flex  flex-wrap -mx-4">
          <div className="w-full md:w-1/2 px-4 mb-6">
            <div className="text-pinkclr font-medium mb-6">Invoice From :</div>
            <div className="text-[#2B3674] font-medium mb-4">
              {invoiceData.from.company}
            </div>
            <div className="text-gray-500 text-sm mt-1">
              {invoiceData.from.address}
            </div>
            <div className="text-gray-500 text-sm mt-1">
              Phone: {invoiceData.from.phone}
            </div>
          </div>

          <div className="w-full md:w-1/2 px-4 mb-8">
            <div className="text-pinkclr font-medium mb-6">Bill To :</div>
            <div className="text-[#2B3674] font-medium mb-4">
              {invoiceData.to.company}
            </div>
            <div className="text-[#9BA6B7] text-sm mt-1">
              {invoiceData.to.address}
            </div>
            <div className="text-[#9BA6B7] text-sm mt-1">
              {invoiceData.to.city}, {invoiceData.to.state}
            </div>
            <div className="text-[#9BA6B7] text-sm mt-1">
              {invoiceData.to.country}
            </div>
          </div>

          <div className="w-full md:w-1/2 px-4 mb-6">
            <div className="text-pinkclr font-medium mb-2">Invoice Date :</div>
            <div className="text-[#9BA6B7]">{invoiceData.dates.invoice}</div>
          </div>

          <div className="w-full md:w-1/2 px-4 mb-6">
            <div className="text-pinkclr font-medium mb-2">Due Date :</div>
            <div className="text-[#9BA6B7]">{invoiceData.dates.due}</div>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap -mx-2">
        <div className="w-full lg:w-3/5 px-2 mb-4">
          <div className="bg-white rounded-2xl p-6 shadow-sm h-full">
            <div className="text-pinkclr font-bold mb-4 border-b pb-2">
              Order Items
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {invoiceData.items.map((item, index) => (
                <div key={index} className="flex items-center p-2">
                  <div className="mr-3 mt-10">
                    <div className=" rounded-md">
                      <img src="/src/assets/images/Background.png" alt="" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="text-gray-800 font-medium text-sm">
                      {item.name}
                    </div>
                    <div className="text-gray-600 text-sm">
                      Price: ${item.price.toFixed(2)}
                    </div>
                    <div className="text-gray-600 text-sm">
                      Size: {item.size}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="w-full lg:w-2/5 px-2 mb-4">
          <div className="bg-white rounded-2xl p-6  shadow-sm h-full">
            <div className="text-pinkclr font-bold mb-4 border-b pb-2 ms-4">
              Purchase Summary
            </div>

            <div className="space-y-3 text-[#4C4C5C]">
              <div className="flex justify-between ">
                <div className="">Qty</div>
                <div className="font-medium">{invoiceData.summary.qty}</div>
              </div>

              <div className="flex justify-between ">
                <div className="">Unit Price</div>
                <div className="font-medium">
                  {invoiceData.summary.unitPrice}
                </div>
              </div>

              <div className="flex justify-between ">
                <div>Sub Total :</div>
                <div className="font-medium">
                  {invoiceData.summary.subTotal}
                </div>
              </div>

              <div className="flex justify-between">
                <div className="text-[#4C4C5C]">Tax</div>
                <div className="font-medium">{invoiceData.summary.tax}</div>
              </div>

              <div className="flex justify-between">
                <div>Gift Card</div>
                <div className="font-medium">
                  {invoiceData.summary.giftCard}
                </div>
              </div>

              <div className="flex justify-between border-b pb-8">
                <div>Coupon discount</div>
                <div className="font-medium">
                  {invoiceData.summary.couponDiscount}
                </div>
              </div>

              <div className="flex justify-between pt-2">
                <div className="text-[#313A46] font-bold">Grand Amount</div>
                <div className="font-bold">
                  {invoiceData.summary.grandAmount}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
