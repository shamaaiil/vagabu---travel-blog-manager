import { useState, useEffect } from "react";
import DynamicTable from "@/ui/DynamicTable";
import DynamicCategoryModal from "../components/CategoryModal";
import DeleteModal from "@/ui/DeleteModal";
import {
  useGetQuery,
  usePostMutation,
  useDeleteMutation,
} from "@/services/apiService";
import { toast } from "react-toastify";
import SubCategoryHelpers from "./components/subCategoryHelpers";
import { SquarePen, Trash2 } from "lucide-react";

export function SubCategories() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentRowData, setCurrentRowData] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const itemsPerPage = 10;

  const { data, isLoading, refetch } = useGetQuery({
    path: `/categories?per_page=${itemsPerPage}&page=${currentPage}&parent_only=0&sub_only=1&child_only=0${searchTerm ? `&search=${searchTerm}` : ""}`,
  });

  // Refetch when page or search term changes
  useEffect(() => {
    refetch();
  }, [currentPage, searchTerm, refetch]);

  useEffect(() => {
    if (data) {
      // Extract total items from pagination metadata
      if (data.meta?.pagination?.total) {
        setTotalItems(data.meta.pagination.total);
      } else if (data.pagination?.total) {
        setTotalItems(data.pagination.total);
      } else if (data.meta?.total) {
        setTotalItems(data.meta.total);
      } else if (data.total) {
        setTotalItems(data.total);
      } else if (Array.isArray(data.data)) {
        setTotalItems(data.data.length);
      }
    }
  }, [data]);

  const { data: parentCategories, isLoading: isLoadingParents } = useGetQuery({
    path: `/categories?parent_only=1`,
  });

  const [createCategory, { isLoading: isCreating }] = usePostMutation();
  const [deleteCategory, { isLoading: isDeleting }] = useDeleteMutation();
  const categories = data?.data?.map((category) => {
    const categoryData = {
      id: category.id,
      uuid: category.category_uuid,
      name: category.name,
      parent: category.parent_name,
      parentId: category.parent_id,
      status: category.status ? "Active" : "Inactive",
      icon: category.icon || "",
      parentIcon: category.parent_icon || "",
      ordering: category.ordering || "",
      meta_description: category.meta_description || "",
      metaTags: category.meta_tags || "",
      parentWithIcon: (
        <div className="flex items-center space-x-2">
          {category.parent_icon ? (
            <img
              src={category.parent_icon}
              alt={`${category.parent_name} icon`}
              className="w-6 h-6 object-contain"
            />
          ) : (
            <span className="w-6 h-6 bg-gray-300 flex items-center justify-center text-white">
              ?
            </span>
          )}
          <span>{category.parent_name}</span>
        </div>
      ),
      nameWithIcon: (
        <div className="flex items-center space-x-2">
          {category.icon ? (
            <img
              src={category.icon}
              alt={`${category.name} icon`}
              className="w-6 h-6 object-contain"
            />
          ) : (
            <span className="w-6 h-6 bg-gray-300 flex items-center justify-center text-white">
              ?
            </span>
          )}
          <span>{category.name}</span>
        </div>
      ),
      actions: (
        <div className="flex space-x-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleEditClick(categoryData);
            }}
            className="text-pink-600 hover:text-pink-900"
          >
            <SquarePen size={20} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleDeleteClick(categoryData);
            }}
            className="text-red-600 hover:text-red-900"
          >
            <Trash2 size={20} />
          </button>
        </div>
      ),
    };
    return categoryData;
  });

  // Format parent categories properly
  const parentCategoryOptions =
    parentCategories?.data?.map((cat) => ({
      id: cat.id,
      name: cat.name,
    })) || [];

  const columns = [
    { key: "parentWithIcon", label: "Category" },
    { key: "nameWithIcon", label: "Sub Category" },
    { key: "ordering", label: "Order" },
    { key: "status", label: "Status", toggleable: true },
    { key: "actions", label: "Actions" },
  ];

  // Handle search function
  const handleSearch = (term) => {
    setSearchTerm(term);
    setCurrentPage(1);
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };
  const {
    handleAdd,
    handleEdit,
    handleDelete,
    handleStatusChange,
    handleEditClick,
    handleDeleteClick,
  } = SubCategoryHelpers({
    createCategory,
    deleteCategory,
    refetch,
    setIsCreateModalOpen,
    setIsEditModalOpen,
    setIsDeleteModalOpen,
    setCurrentRowData,
  });

  return (
    <div className="mt-12 mb-8 flex bg-[#F2F7FB] flex-col gap-12 px-8">
      <DynamicTable
        data={categories || []}
        columns={columns}
        tableTitle="Sub Category"
        addButtonText="Add New Sub Category"
        onAdd={() => setIsCreateModalOpen(true)}
        onEdit={handleEditClick}
        onDelete={handleDeleteClick}
        onStatusChange={handleStatusChange}
        onBanStatusChange={() => {}} // Empty function as it's not needed
        onSearch={handleSearch}
        isLoading={isLoading || isCreating || isDeleting}
        currentPage={currentPage}
        totalItems={totalItems}
        itemsPerPage={itemsPerPage}
        onPageChange={handlePageChange}
        searchEnabled={true}
        searchPlaceholder="Search sub categories..."
      />

      {isCreateModalOpen && (
        <DynamicCategoryModal
          title="Add New Sub Category"
          fields={[
            {
              name: "parentId",
              label: "Category",
              type: "select",
              options: parentCategoryOptions,
              required: true,
            },
            {
              name: "name",
              label: "Name",
              type: "text",
              required: true,
            },
            {
              name: "metaTags",
              label: "Meta Tags",
              type: "text",
            },
            {
              name: "ordering",
              label: "Ordering",
              type: "text",
            },
            {
              name: "meta_description",
              label: "Meta Description",
              type: "textarea",
            },
            {
              name: "icon",
              label: "Icon",
              type: "file",
              accept: "image/*",
            },
          ]}
          onSubmit={handleAdd}
          onClose={() => setIsCreateModalOpen(false)}
          submitButtonText="Create"
        />
      )}

      {isEditModalOpen && currentRowData && (
        <DynamicCategoryModal
          title="Edit Sub Category"
          fields={[
            {
              name: "parentId",
              label: "Category",
              type: "select",
              options: parentCategoryOptions,
              required: true,
            },
            {
              name: "name",
              label: "Name",
              type: "text",
              required: true,
            },
            {
              name: "metaTags",
              label: "Meta Tags",
              type: "text",
            },
            {
              name: "ordering",
              label: "Ordering",
              type: "text",
            },
            {
              name: "meta_description",
              label: "Meta Description",
              type: "textarea",
            },
            {
              name: "icon",
              label: "Icon",
              type: "file",
              accept: "image/*",
              preview: currentRowData.icon ? currentRowData.icon : null,
            },
          ]}
          onSubmit={handleEdit}
          onClose={() => setIsEditModalOpen(false)}
          initialData={{
            ...currentRowData,
            parentId: currentRowData.parentId, // Ensure parentId is properly passed
          }}
        />
      )}

      <DeleteModal
        open={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onDelete={handleDelete}
      />
    </div>
  );
}

export default SubCategories;
