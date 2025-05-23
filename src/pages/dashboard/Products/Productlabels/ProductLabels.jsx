import { useState, useEffect } from "react";
import DynamicTable from "@/ui/DynamicTable";
import DynamicModal from "@/ui/DynmicModal";
import DeleteModal from "@/ui/DeleteModal";
import {
  useGetQuery,
  usePostMutation,
  useDeleteMutation,
} from "@/services/apiService";
import { toast } from "react-toastify";

export function ProductLabels() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentRowData, setCurrentRowData] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const itemsPerPage = 15;

  // Get authentication token from localStorage
  const authToken = localStorage.getItem("token");

  const { data, isLoading, refetch } = useGetQuery({
    path: `labels?per_page=${itemsPerPage}&page=${currentPage}${searchTerm ? `&search=${searchTerm}` : ""}`,
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
  });

  const [labels, setLabels] = useState([]);

  useEffect(() => {
    if (data?.data) {
      setTotalItems(data.data.length);
      const formattedLabels = data.data.map((label) => ({
        id: label.id,
        uuid: label.label_uuid,
        name: label.label,
        color: label.label_color,
        description: label.description || "-",
        // Store original data for easy access
        originalData: {
          id: label.id,
          uuid: label.label_uuid,
          label: label.label,
          label_color: label.label_color,
          description: label.description || "",
        },
        colorDisplay: (
          <div
            className="w-6 h-6 rounded-full"
            style={{ backgroundColor: label.label_color }}
          ></div>
        ),
        actions: (
          <div className="flex space-x-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleEditClick(label);
              }}
              className="text-pink-600 hover:text-pink-900"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleDeleteClick(label);
              }}
              className="text-red-600 hover:text-red-900"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
            </button>
          </div>
        ),
      }));
      setLabels(formattedLabels);
    }
  }, [data]);

  useEffect(() => {
    const isModalOpen =
      isCreateModalOpen || isEditModalOpen || isDeleteModalOpen;
    if (isModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isCreateModalOpen, isEditModalOpen, isDeleteModalOpen]);

  const [createLabel, { isLoading: isCreating }] = usePostMutation();
  const [deleteLabel, { isLoading: isDeleting }] = useDeleteMutation();

  const columns = [
    { key: "id", label: "#" },
    { key: "name", label: "Name" },
    { key: "colorDisplay", label: "Color" },
    { key: "description", label: "Description" },
    { key: "actions", label: "Actions" },
  ];

  const handleSearch = (term) => {
    setSearchTerm(term);
    setCurrentPage(1);
    refetch();
  };

  // Handle edit button click - now passing the original data object
  const handleEditClick = (label) => {
    setCurrentRowData(label);
    setIsEditModalOpen(true);
  };

  // Handle delete button click
  const handleDeleteClick = (label) => {
    setCurrentRowData(label);
    setIsDeleteModalOpen(true);
  };

  const handleAdd = async (newData) => {
    try {
      const payload = {
        label: newData.name,
        label_color: newData.color,
        description: newData.description || "",
      };

      const res = await createLabel({
        path: "labels",
        method: "POST",
        body: payload,
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      if (!res.error) {
        toast.success("Label added successfully");
        refetch();
      } else {
        toast.error(res.error.data?.message || "Failed to add label");
      }
      setIsCreateModalOpen(false);
    } catch (error) {
      toast.error("An unexpected error occurred");
    }
  };

  const handleEdit = async (updatedData) => {
    try {
      if (!currentRowData || !currentRowData.label_uuid) {
        toast.error("Unable to edit label: Missing label identifier");
        return;
      }

      const payload = {
        label: updatedData.name,
        label_color: updatedData.color,
        description: updatedData.description || "",
      };

      const res = await createLabel({
        path: `labels/${currentRowData.label_uuid}?_method=patch`,
        method: "POST",
        body: payload,
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      if (!res.error) {
        toast.success("Label updated successfully");
        refetch();
      } else {
        toast.error(res.error.data?.message || "Failed to update label");
      }
      setIsEditModalOpen(false);
    } catch (error) {
      console.error("An unexpected error occurred", error);
      toast.error("An unexpected error occurred");
    }
  };

  const handleDelete = async () => {
    try {
      if (!currentRowData || !currentRowData.label_uuid) {
        toast.error("Unable to delete label: Missing label identifier");
        return;
      }

      const res = await deleteLabel({
        path: `labels/${currentRowData.label_uuid}`,
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      if (!res.error) {
        toast.success("Label deleted successfully");
        refetch();
      } else {
        toast.error(res.error.data?.message || "Failed to delete label");
      }
      setIsDeleteModalOpen(false);
    } catch (error) {
      toast.error("An unexpected error occurred");
    }
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    refetch();
  };
  return (
    <div className="mt-12 mb-8 flex bg-[#F2F7FB] flex-col gap-12 px-8">
      {/* Dynamic Table for Product Labels */}
      <DynamicTable
        tableTitle="Product Labels"
        columns={columns}
        data={labels}
        onAdd={() => setIsCreateModalOpen(true)}
        onSearch={handleSearch}
        onStatusChange={() => {}}
        onPageChange={handlePageChange}
        isLoading={isLoading || isCreating || isDeleting}
        currentPage={currentPage}
        totalItems={totalItems}
        itemsPerPage={itemsPerPage}
        addButtonText="Add New Label"
        tableBgColor="#FFFFFF"
      />

      {/* Create Label Modal */}
      {isCreateModalOpen && (
        <DynamicModal
          title="Add New Label"
          fields={[
            { name: "name", label: "Label Name", type: "text", required: true },
            {
              name: "color",
              label: "Label Color",
              type: "color",
              required: true,
            },
            { name: "description", label: "Description", type: "textarea" },
          ]}
          onSubmit={handleAdd}
          onClose={() => setIsCreateModalOpen(false)}
        />
      )}

      {/* Edit Label Modal - Now properly prefilled with current label data */}
      {isEditModalOpen && currentRowData && (
        <DynamicModal
          title="Edit Label"
          fields={[
            {
              name: "name",
              label: "Label Name",
              type: "text",
              required: true,
              defaultValue: currentRowData.label,
            },
            {
              name: "color",
              label: "Label Color",
              type: "color",
              required: true,
              defaultValue: currentRowData.label_color, // Use the original data field name
            },
            {
              name: "description",
              label: "Description",
              type: "textarea",
              defaultValue: currentRowData.description,
            },
          ]}
          initialData={{
            name: currentRowData.label,
            color: currentRowData.label_color,
            description: currentRowData.description,
          }}
          onSubmit={handleEdit}
          onClose={() => setIsEditModalOpen(false)}
        />
      )}

      {/* Delete Modal */}
      <DeleteModal
        open={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onDelete={handleDelete}
        rowData={currentRowData}
        isDeleting={isDeleting}
      />
    </div>
  );
}

export default ProductLabels;
