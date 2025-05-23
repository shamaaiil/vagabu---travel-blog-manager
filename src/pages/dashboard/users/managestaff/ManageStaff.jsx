import React, { useState } from "react";
import { Trash, Pencil, Eye } from "lucide-react";
import DynamicTable from "../../tables";
import DeleteModal from "@/ui/DeleteModal";
import StaffForm from "./StaffForm";
import { useDeleteMutation, useGetQuery } from "@/services/apiService";

const columns = [
  { label: "Name", key: "full_name" },
  { label: "Email", key: "email" },
  { label: "Phone", key: "phone_number" },
  { label: "Role", key: "role" },
  { label: "Actions", key: "actions" },
];

const ManageStaff = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentRowData, setCurrentRowData] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const [deleteUser] = useDeleteMutation();
  const { data: usersData, refetch } = useGetQuery({ path: "/users" });

  const handleAdd = () => {
    setIsCreateModalOpen(false);
    refetch(); // Refresh after creation if your form handles API
  };

  const handleEdit = () => {
    setIsEditModalOpen(false);
    refetch(); // Refresh after editing
  };

  const handleDelete = async () => {
    try {
      await deleteUser({ path: `/user/${currentRowData.uuid}` }).unwrap();
      setIsDeleteModalOpen(false);
      setCurrentRowData(null);
      refetch(); // Refresh data after delete
    } catch (error) {
      console.error("Failed to delete user:", error);
    }
  };

  const handleViewDetails = (user) => {
    setCurrentRowData(user);
    setIsDetailsModalOpen(true);
  };

  const formattedUser =
    usersData?.data?.map((user) => {
      const userData = {
        uuid: user.user_uuid,
        full_name: user.full_name,
        email: user.email,
        phone_number: user.phone_number,
        role: user.roles,
        joined_date: user.created_at || "N/A",
        id: user.id || "N/A",
        photo: user.photo || "https://example.com/photo.jpg",
      };

      return {
        ...userData,
        actions: (
          <div className="flex gap-2">
            <Eye
              size={16}
              className="text-pinkclr cursor-pointer"
              onClick={() => handleViewDetails(userData)}
            />
            <Pencil
              size={16}
              className="text-pinkclr cursor-pointer"
              onClick={() => {
                setCurrentRowData(userData);
                setIsEditModalOpen(true);
              }}
            />
            <Trash
              size={16}
              className="text-pinkclr cursor-pointer"
              onClick={() => {
                setCurrentRowData(userData);
                setIsDeleteModalOpen(true);
              }}
            />
          </div>
        ),
      };
    }) || [];

  const generateStaffDetails = () => {
    if (!currentRowData) return [];

    return [
      { label: "Staff ID#", value: currentRowData.id || "N/A" },
      { label: "Staff Photo", value: currentRowData.image },
      { label: "Staff Name", value: currentRowData.full_name || "N/A" },
      { label: "Staff Role", value: currentRowData.role || "N/A" },
      { label: "Staff Email", value: currentRowData.email || "N/A" },
      { label: "Staff Phone", value: currentRowData.phone_number || "N/A" },
      { label: "Joined", value: currentRowData.joined_date || "N/A" },
    ];
  };

  return (
    <>
      <div className="mt-12 px-8">
        <DynamicTable
          tableTitle="Staffs"
          columns={columns}
          data={formattedUser}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          onAdd={() => setIsCreateModalOpen(true)}
          addButtonText="Add New staff"
          onPageChange={(page) => console.log("Page changed to:", page)}
          currentPage={1}
          itemsPerPage={10}
          totalItems={usersData?.data?.length}
        />
      </div>

      <DeleteModal
        open={isDeleteModalOpen}
        setOpen={setIsDeleteModalOpen}
        onDelete={handleDelete}
        item="staff"
        onClose={() => setIsDeleteModalOpen(false)}
      />

      {isEditModalOpen && currentRowData && (
        <StaffForm
          title="Edit Staff"
          buttonText="Save"
          onClose={() => setIsEditModalOpen(false)}
          onSubmit={handleEdit}
          initialData={currentRowData}
        />
      )}

      {isCreateModalOpen && (
        <StaffForm
          title="Add New Staff"
          buttonText="Create Staff"
          onClose={() => setIsCreateModalOpen(false)}
          onSubmit={handleAdd}
        />
      )}

      {isDetailsModalOpen && currentRowData && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-30 flex items-center justify-center">
          <div className="bg-white p-6 rounded-xl shadow-xl max-w-md w-full">
            <h2 className="text-xl font-semibold mb-4 border-b text-pink-500 pb-2">
              Staff Details
            </h2>

            {generateStaffDetails().map((item, index) => (
              <div
                key={index}
                className="flex justify-between items-center mb-3"
              >
                <span className="font-medium text-gray-600">{item.label}</span>
                {item.label === "Staff Photo" ? (
                  <img
                    src={item.value}
                    alt=""
                    className="w-10 h-10 rounded-full object-cover"
                  />
                ) : (
                  <span className="text-right">{item.value}</span>
                )}
              </div>
            ))}

            <div className="mt-6 text-right">
              <button
                onClick={() => setIsDetailsModalOpen(false)}
                className="px-4 py-2 bg-teal-500 text-white rounded hover:bg-teal-600"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ManageStaff;
