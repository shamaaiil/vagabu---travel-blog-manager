import React from "react";

const RecentCustomersCard = ({ customers = [] }) => {
  // Add default empty array if customers is undefined
  const customersList = customers || [];

  return (
    <div className="bg-white p-6 rounded-2xl shadow-md w-full max-w-md">
      <h3 className="text-xl font-bold text-gray-900">Recent Customers</h3>
      <div className="mt-4">
        <div className="flex justify-between mb-2">
          <div className="w-1/3">
            <span className="font-semibold text-gray-600">Customer Name</span>
          </div>
          <div className="w-1/3 text-right">
            <span className="font-semibold text-gray-600">User ID</span>
          </div>
        </div>
        {customersList.length > 0 ? (
          customersList.map((customer, index) => (
            <div key={index} className="flex justify-between items-center py-2">
              <div className="w-1/3">
                <div className="flex items-center">
                  <img
                    src={customer.image}
                    alt={customer.name}
                    className="w-10 h-10 rounded-full mr-2 border border-gray-300"
                  />
                  <span className="text-gray-800">{customer.name}</span>
                </div>
              </div>
              <div className="w-1/3 text-right">
                <span className="text-gray-700 font-medium">{customer.userId}</span>
              </div>
            </div>
          ))
        ) : (
          <div className="py-4 text-center text-gray-500">
            No customers to display
          </div>
        )}
      </div>
    </div>
  );
};

export default RecentCustomersCard;