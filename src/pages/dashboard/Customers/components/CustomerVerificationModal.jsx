import { AlertTriangle, CheckCircle, X, XCircle } from "lucide-react";
import React from "react";

const CustomerVerificationModal = ({
  customer,
  setIsOpen,
  getStatusColor,
  customerData,
}) => {
  console.log("customerData", customerData);

  return (
    <>
      <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
        {/* Modal content */}
        <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl">
          {/* Modal header */}
          <div className="flex items-center justify-between p-3 border-b">
            <h2 className="text-lg font-medium">Verification Images</h2>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              <X size={20} />
            </button>
          </div>

          {/* Modal body */}
          <div className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Security Image */}
              {customerData.profile && (
                <div className="flex flex-col items-center">
                  <img
                    src={customerData.profile}
                    alt="Customer Security Image"
                    className="w-full h-60 object-cover rounded border border-gray-200"
                  />
                  <span className="mt-2 text-sm text-center">
                    Customer Image
                  </span>
                </div>
              )}

              {/* CNIC Image */}
              {customerData.cnic_image && (
                <div className="flex flex-col items-center">
                  <img
                    src={customerData.cnic_image}
                    alt="Customer CNIC"
                    className="w-full h-60 object-cover rounded border border-gray-200"
                  />
                  <span className="mt-2 text-sm text-center">CNIC Image</span>
                </div>
              )}

              {/* Credit Card Image */}
              {customerData.credit_card_image && (
                <div className="flex flex-col items-center">
                  <img
                    src={customerData.credit_card_image}
                    alt="Credit Card"
                    className="w-full h-60 object-cover rounded border border-gray-200"
                  />
                  <span className="mt-2 text-sm text-center">Card Image</span>
                </div>
              )}
            </div>
          </div>

          {/* Modal footer */}
          <div className="border-t px-4 py-3 flex justify-end">
            <button
              onClick={() => setIsOpen(false)}
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-1 px-3 rounded text-sm"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default CustomerVerificationModal;
