import React, { useState } from "react";
import { Eye, Pencil, Trash } from "lucide-react";
import DeleteModal from "@/ui/DeleteModal";
import DynamicModal from "@/ui/DynmicModal";
import { Checkbox } from "@material-tailwind/react";
import DynamicTable from "../dashboard/tables";

const BussinessFreferred = () => {
  const columns = [
    { label: "Business Name", key: "Business_Name" },
    { label: "Name", key: "name" },
    { label: "Email", key: "email" },
    { label: "Phone #", key: "phone" },
    { label: "Percentage", key: "Percentage" },
    { label: "Allowed Balance", key: "allowbalance" },
    { label: "Used Balance", key: "usedbalance" },
    { label: "status", key: "status" },
    { label: "Actions", key: "actions" },
  ];

  const BussinessData = [
    {
      id: 1,
      Business_Name: "Abc",
      name: "qwe",
      email: "email@gmail.com",
      phone: "1234567890",
      Percentage: "10%",
      allowbalance: "1000",
      usedbalance: "500",
      status: "pending",
    },
  ];

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

  // Actions
  const handleView = (row) => {
    setIsDetailsModalOpen(true);
  };

  const handleEdit = (row) => {
    setIsEditModalOpen(true);
  };

  const handleDelete = (row) => {
    setIsDeleteModalOpen(true);
  };

  // Inject actions JSX in data
  const rolesWithActions = BussinessData.map((role) => ({
    ...role,
    actions: (
      <div className="flex gap-3">
        <Pencil
          size={16}
          className="text-pink-500 cursor-pointer hover:text-pink-700"
          onClick={() => handleEdit(role)}
        />
        <Trash
          size={16}
          className="text-pink-500 cursor-pointer hover:text-pink-700"
          onClick={() => handleDelete(role)}
        />
      </div>
    ),
  }));

  return (
    <>
      <div className="mt-12 px-8">
        <DynamicTable
          tableTitle="Business Line Credit Application"
          columns={columns}
          data={rolesWithActions}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onSearch={(term) => console.log("Search:", term)}
          onPageChange={(page) => console.log("Page changed to:", page)}
          currentPage={1}
          totalItems={rolesWithActions.length}
          itemsPerPage={10}
        />
      </div>
      <DeleteModal
        open={isDeleteModalOpen}
        setOpen={setIsDeleteModalOpen}
        onDelete={handleDelete}
        item="staff"
        onClose={() => setIsDeleteModalOpen(false)}
      />

      {isEditModalOpen && <DynamicModal title="Edit Permissions" fields={[]} />}
    </>
  );
};

export default BussinessFreferred;
