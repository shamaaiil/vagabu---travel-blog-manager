import React, { useState } from "react";
import { ArrowLeft, Pencil, Trash } from "lucide-react";
import DynamicTable from "../../tables";
import DeleteModal from "@/ui/DeleteModal";
import RoleForm from "./RoleForm";
import { useDeleteMutation, useGetQuery } from "@/services/apiService";

const ManageRoles = () => {
  const columns = [
    { label: "Name", key: "name" },
    { label: "Permissions", key: "permissions" },
    { label: "Actions", key: "actions" },
  ];

  const [selectedRole, setSelectedRole] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // const deleteRole = useDeleteMutation()
  const [deleteRole, { isLoading: isDeleting }] = useDeleteMutation();

  const handleEdit = (row) => {
    setIsEditModalOpen(true);
  };

  const handleDelete = (role) => {
    setSelectedRole(role);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    try {
      await deleteRole({
        path: `/roles/${selectedRole.uuid}`,
      }).unwrap();

      setIsDeleteModalOpen(false);
      setSelectedRole(null);
    } catch (error) {
      console.error("Error deleting role:", error);
    }
  };

  const { data: roles } = useGetQuery({
    path: "/roles",
  });
  const rolesWithActions = roles?.data?.map((role) => ({
    id: role?.id,
    name: role?.name,
    permissions: Array.isArray(role.permissions)
      ? role.permissions.map((p) => p.name).join(", ")
      : role.permissions?.name || role.guard_name || "-",
    actions: (
      <div className="flex gap-3">
        <Pencil
          size={16}
          className="text-pinkclr cursor-pointer"
          onClick={() => handleEdit(role)}
        />
        <Trash
          size={16}
          className="text-pinkclr cursor-pointer"
          onClick={() => handleDelete(role)}
        />
      </div>
    ),
  }));

  return (
    <>
      {/* Conditionally render based on flags */}
      {isAddModalOpen ? (
        <div className="p-6">
          <button
            onClick={() => setIsAddModalOpen(false)}
            className="mb-4 flex items-center text-pink-600 hover:text-pink-800 lg:ms-10"
          >
            <ArrowLeft className="text-pinkclr" />
          </button>
          <RoleForm title="Add Permissions" />
        </div>
      ) : isEditModalOpen ? (
        <div className="p-6">
          <button
            onClick={() => setIsEditModalOpen(false)}
            className="mb-4 flex items-center text-pink-600 hover:text-pink-800 lg:ms-10"
          >
            <ArrowLeft />
          </button>
          <RoleForm title="Edit Permissions" />
        </div>
      ) : (
     <div className="m-4">
         <DynamicTable
          tableTitle="Roles"
          columns={columns}
          data={rolesWithActions}
          onAdd={() => setIsAddModalOpen(true)}
          addButtonText="Add New Role"
          onEdit={handleEdit}
          onDelete={handleDelete}
          onSearch={(term) => console.log("Search:", term)}
          onPageChange={(page) => console.log("Page changed to:", page)}
          currentPage={1}
          totalItems={rolesWithActions?.length}
          itemsPerPage={10}
        />
     </div>
      )}

      {/* Delete Modal */}
      <DeleteModal
        open={isDeleteModalOpen}
        setOpen={setIsDeleteModalOpen}
        onDelete={confirmDelete}
        item="staff"
        onClose={() => setIsDeleteModalOpen(false)}
      />
    </>
  );
};

export default ManageRoles;
