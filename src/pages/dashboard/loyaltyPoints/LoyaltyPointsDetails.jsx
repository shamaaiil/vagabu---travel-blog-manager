import { useGetQuery } from "@/services/apiService";
import DynamicTable from "../tables";

const LoyaltyPointsDetails = ({customer}) => {
  const columns = [
    { label: "Order No", key: "orderNO" },
    { label: "Order Total", key: "orderTotal" },
    { label: "Points", key: "points" },
    { label: "Points Balance", key: "pointsBalance" },
    { label: "Points Status", key: "is_redeemed" },
  ];
  const customer_id = customer?.id
  
  const { data: loyaltyPoints } = useGetQuery({
    path : `/orders/points/loyality-points/?customer_id=${customer_id}`
  });

  const formattedData = loyaltyPoints?.data?.map((point) => ({
    orderNo: point.order_number || "N/A", 
    orderTotal: point.order_total || "N/A",  
    points: point.points || 0,  
    pointsBalance: point.points || 0, 
    pointsStatus: point.is_redeemed === 1 ? "Redeemed" : "Not Redeemed",  
  }));

  return (
    <DynamicTable
      tableTitle="Loyalty Points Detail"
      columns={columns}
      onSearch={(term) => console.log("Search:", term)}
      data={formattedData}
    />
  );
};
export default LoyaltyPointsDetails;
