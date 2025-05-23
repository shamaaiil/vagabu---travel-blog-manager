import React from "react";
import { Eye } from "lucide-react";
import DynamicTable from "@/ui/DynamicTable";


const LoyaltyPointsDetail = () => {

  const columns = [
    { label: "# Order No", key: "orderNo" },
    { label: "Date", key: "date" },
    { label: "Order Total", key: "orderTotal" },
    { label: "Points", key: "points" },
    { label: "Points Balance", key: "pointsBalance" },
    { label: "Points Status", key: "status" },
    { label: "Details", key: "details" },
  ];

  const data = Array(10).fill(0).map((_, index) => ({
    orderNo: `31735914015`,
    date: "03 Jan 2025",
    orderTotal: "$ 107.61",
    points: 10,
    pointsBalance: "$ 5",
    status: (
      <span className="text-emerald-500 font-medium">Pending</span>
    ),
    details: (
      <Eye
        size={20}
        className="text-pink-500 cursor-pointer hover:text-pink-700"
        onClick={() => console.log(`View: ${index + 1}`)}
      />
    ),
  }));

  return (
    <div className="mt-10 ">
      {/* <h2 className="text-pink-600 font-semibold text-lg mb-4">Loyalty Points Detail</h2> */}
        <DynamicTable
          tableTitle="Loyalty Points Detail"
          columns={columns}
          data={data}
          onPageChange={(page) => console.log("Page changed to:", page)}
          currentPage={2}
          itemsPerPage={10}
        />
      </div>
  );
};

export default LoyaltyPointsDetail;
