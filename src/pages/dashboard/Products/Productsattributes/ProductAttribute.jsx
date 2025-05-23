import { useState, useEffect } from "react";
import DynamicTable from "@/ui/DynamicTable";
import DeleteModal from "@/ui/DeleteModal";
import { useGetQuery, useDeleteMutation } from "@/services/apiService";
import { toast } from "react-toastify";
import { FiCopy } from "react-icons/fi";
import CreateEditAttribute from "./components/CreateAttribute"; // CreateEditAttribute component

function ProductAttribute() {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentRowData, setCurrentRowData] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [viewCreateForm, setViewCreateForm] = useState(false); // State for conditional rendering
  const [editingAttribute, setEditingAttribute] = useState(null);
  const itemsPerPage = 10; // Changed from 15 to 10 as requested

  // Updated API endpoint with proper pagination parameters
  const { data, isLoading, refetch } = useGetQuery({
    path: `/general-attributes?per_page=${itemsPerPage}&page=${currentPage}${searchTerm ? `&search=${searchTerm}` : ""}`,
  });

  
  // Refetch when page or search term changes
  useEffect(() => {
    refetch();
  }, [currentPage, searchTerm, refetch]);

  useEffect(() => {
    if (data) {
      // Extract total items from pagination metadata
      if (data.pagination) {
        setTotalItems(data.pagination.total);
      } else if (data.meta?.pagination) {
        setTotalItems(data.meta.pagination.total);
      } else if (data.meta) {
        setTotalItems(data.meta.total);
      } else {
        // If no pagination info, use a fallback that ensures pagination shows
        setTotalItems(Math.max(data.total || 0, data.data?.length || 0));
      }
    }
  }, [data]);

  const [deleteAttribute, { isLoading: isDeleting }] = useDeleteMutation();

  // Format data for the table
  const attributes = data?.data?.map((attribute) => {
    const attributeValues = attribute.values.map((val) => val.value).join(", ");

    const attributeData = {
      id: attribute.id,
      uuid: attribute.general_attribute_uuid,
      name: attribute.name,
      description: attribute.description || "-",
      values: attribute.values,
      valuesDisplay: attributeValues || "-",
      actions: (
        <div className="flex space-x-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleEditClick(attributeData);
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
              handleCopyClick(attributeData);
            }}
            className="text-teelclr-600 hover:text-teelclr-900"
          >
            <FiCopy className="h-5 w-5" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleDeleteClick(attributeData);
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
    };
    return attributeData;
  });

  const columns = [
    { key: "name", label: "Name" },
    { key: "valuesDisplay", label: "Values" },
    { key: "actions", label: "Actions" },
  ];

  const handleSearch = (term) => {
    setSearchTerm(term);
    setCurrentPage(1); // Reset to first page when searching
  };

  const handleEditClick = (row) => {
    setEditingAttribute(row);
    setViewCreateForm(true); // Show create/edit form in the same page
  };

  const handleCopyClick = (row) => {
    setEditingAttribute({ ...row, isClone: true });
    setViewCreateForm(true); // Show create form in clone mode
  };

  const handleAddClick = () => {
    setEditingAttribute(null);
    setViewCreateForm(true); // Show create form
  };

  const handleDeleteClick = (row) => {
    setCurrentRowData(row);
    setIsDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    try {
      const res = await deleteAttribute({
        path: `/general-attributes/${currentRowData.uuid}`,
        method: "DELETE",
      });
      if (!res.error) {
        toast.success("Attribute deleted successfully");
        refetch();
      } else {
        toast.error(res.error.data.message || "Failed to delete attribute");
      }
      setIsDeleteModalOpen(false);
    } catch (error) {
      toast.error("An unexpected error occurred");
    }
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Calculate pagination information for debugging if needed
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <div className="mt-12 mb-8 flex bg-[#F2F7FB] flex-col gap-12 px-8">
      {/* Dynamic Table for Product Attributes */}
      {!viewCreateForm ? (
        <DynamicTable
          data={attributes || []}
          columns={columns}
          tableTitle="Product Attributes"
          addButtonText="Add New Attribute"
          onAdd={handleAddClick}
          onEdit={handleEditClick}
          onDelete={handleDeleteClick}
          onSearch={handleSearch}
          isLoading={isLoading || isDeleting}
          currentPage={currentPage}
          totalItems={totalItems}
          itemsPerPage={itemsPerPage}
          onPageChange={handlePageChange}
          searchEnabled={true}
          searchPlaceholder="Search attributes..."
          tableBgColor="#FFFFFF"
        />
      ) : (
        // Conditionally render CreateEditAttribute component
        <CreateEditAttribute
          attribute={editingAttribute}
          onClose={() => {
            setViewCreateForm(false);
            setEditingAttribute(null);
            refetch();
          }}
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

export default ProductAttribute;
