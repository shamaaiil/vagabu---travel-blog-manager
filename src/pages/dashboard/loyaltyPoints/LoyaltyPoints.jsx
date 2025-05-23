import React, { useState } from "react";
import { ArrowLeft, Eye } from "lucide-react";
import DynamicTable from "../tables";
import { useGetQuery } from "@/services/apiService";
import LoyaltyPointsDetails from "./LoyaltyPointsDetails";

const LoyaltyPoints = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;

  const columns = [
    { label: "ID", key: "id" },
    { label: "Full Name", key: "fullName" },
    { label: "Total Points", key: "totalPoints" },
    { label: "Points Balance", key: "pointsBalance" },
    { label: "Status", key: "status" },
    { label: "Details", key: "details" },
  ];

  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");


  const { data } = useGetQuery({
    path : `/customers?per_page=${itemsPerPage}&page_id=${currentPage}&search=${searchTerm}`
  });

  const handleView = (customer) => {
    setSelectedCustomer(customer);
    setShowDetails(true);
  };

  const customers = data?.data.map((customer) => {
    const formattedCustomer = {
      id: customer.id,
      uuid: customer.user_uuid,
      fullName: customer.full_name,
      totalPoints: customer.total_points || 0,
      pointsBalance: customer.points_balance || 0,
      status: customer.status ? "Active" : "Inactive",
      totalPoints : customer?.wallet?.remaining_points || 0,
      pointsBalance : customer?.wallet?.balance || 0,
      details: (
        <Eye
          size={20}
          className="text-pinkclr cursor-pointer"
          onClick={() => handleView(customer)} 
        />
      ),
    };

    return formattedCustomer;
  });

  return (
    <>
      {showDetails ? (
        <div className="p-6 ">
          <button
            onClick={() => setShowDetails(false)}
            className="mb-4 flex items-center text-pinkclr"
          >
            <ArrowLeft/>
          </button>
          <LoyaltyPointsDetails customer={selectedCustomer} />
        </div>
      ) : (
       <div className="m-6">
         <DynamicTable
          tableTitle="Loyalty Points"
          columns={columns}
          data={customers}
          currentPage={1}
          itemsPerPage={20}
        />
       </div>
      )}
    </>
  );
};

export default LoyaltyPoints;
