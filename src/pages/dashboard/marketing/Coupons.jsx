import { useState } from "react";
import DynamicTable from "../tables";
import { Eye, Pencil, Trash } from "lucide-react";
import DeleteModal from "@/ui/DeleteModal";
import DynamicModal from "@/ui/DynmicModal";
import { Switch } from "@material-tailwind/react";

const Coupons = () => {
  const initialData = [
    {
      id: 1,
      code: "SAVE20",
      type: "Percentage",
      amount: "20%",
      used: 15,
      status: "Active",
    },
    {
      id: 2,
      code: "FLAT50",
      type: "Flat",
      amount: "$50",
      used: 5,
      status: "Inactive",
    },
  ];

  const columns = [
    { key: "code", label: "Code" },
    { key: "type", label: "Type" },
    { key: "amount", label: "Amount" },
    { key: "used", label: "Used" },
    { key: "status", label: "Status", toggleable: true },
    { key: "actions", label: "Actions" },
  ];

  const [coupons, setCoupons] = useState(initialData);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentRow, setCurrentRow] = useState(null);

  const handleEdit = (row) => {
    setCurrentRow(row);
    setIsEditModalOpen(true);
  };

  const handleDelete = (row) => {
    setCurrentRow(row);
    setIsDeleteModalOpen(true);
  };

  const handleStatusToggle = (id) => {
    const updated = coupons.map((item) =>
      item.id === id
        ? { ...item, status: item.status === "Active" ? "Inactive" : "Active" }
        : item,
    );
    setCoupons(updated);
  };

  const couponsWithActions = coupons.map((coupon) => ({
    ...coupon,
    status: (
      <Switch
        checked={coupon.status === "Active"}
        onChange={() => handleStatusToggle(coupon.id)}
        color="green" // You can customize the color of the switch here
        className="inline-block"
      />
    ),
    actions: (
      <div className="flex gap-3">
        <Pencil
          size={16}
          className="text-pinkclr cursor-pointer ml-2 "
          onClick={() => handleEdit(coupon)}
        />
        <Trash
          size={16}
          className="text-pinkclr cursor-pointer hover:text-pink-700"
          onClick={() => handleDelete(coupon)}
        />
      </div>
    ),
  }));

  return (
    <>
      <div className="mt-12 px-8">
        <DynamicTable
          tableTitle="Coupons"
          columns={columns}
          data={couponsWithActions}
          onAdd={() => console.log("Add Coupon")}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onSearch={(term) => console.log("Search:", term)}
          onPageChange={(page) => console.log("Page changed to:", page)}
          currentPage={1}
          totalItems={couponsWithActions.length}
          itemsPerPage={10}
        />
      </div>

      <DeleteModal
        open={isDeleteModalOpen}
        setOpen={setIsDeleteModalOpen}
        onDelete={() => {
          setIsDeleteModalOpen(false);
        }}
        item="coupon"
        onClose={() => setIsDeleteModalOpen(false)}
      />

      {isEditModalOpen && (
        <DynamicModal
          title="Edit Coupon"
          fields={[
            { name: "code", label: "Code", type: "text", required: true },
            { name: "type", label: "Type", type: "text", required: true },
            { name: "amount", label: "Amount", type: "text", required: true },
            { name: "used", label: "Used", type: "number", required: true },
            { name: "status", label: "Status", type: "text", required: true },
          ]}
          onClose={() => setIsEditModalOpen(false)}
        />
      )}
    </>
  );
};

export default Coupons;
