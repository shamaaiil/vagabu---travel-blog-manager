import DynamicTable from "../dashboard/tables";

const columns = [
  { label: "Business Name", key: "businessName" },
  { label: "Name", key: "name" },
  { label: "Email", key: "email" },
  { label: "Phone #", key: "phone" },
  { label: "Percentage", key: "percentage" },
  { label: "Allowed Balance", key: "allowedBalance" },
  { label: "Used Balance", key: "usedBalance" },
  { label: "status", key: "status" },
  { label: "Actions", key: "actions" },
];

const PayoutRequest = () => {
  return (
    <>
      <DynamicTable
        tableTitle="Net-30 Applications"
        columns={columns}
        itemsPerPage={10}
        onSearch={(term) => console.log("Search:", term)}
        onPageChange={(page) => console.log("Page changed to:", page)}
        currentPage={1}
        showSingleDateFilter={true}
      />
    </>
  );
};
export default PayoutRequest;
