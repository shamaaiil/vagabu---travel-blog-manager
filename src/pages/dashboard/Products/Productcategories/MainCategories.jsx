import { useState, useEffect } from "react";
import DynamicTable from "@/ui/DynamicTable";
import DynamicCategoryModal from "./components/CategoryModal";
import DeleteModal from "@/ui/DeleteModal";
import {
  useGetQuery,
  usePostMutation,
  useDeleteMutation,
} from "@/services/apiService";
import { toast } from "react-toastify";
import {
  handleAdd,
  handleEdit,
  handleDelete,
  handleStatusChange,
  handleEditClick,
  handleDeleteClick,
} from "./MainCategory/components/categoryHandlers";
import { SquarePen, Trash2 } from "lucide-react";

export function MainCategory() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentRowData, setCurrentRowData] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const itemsPerPage = 10;
  const { data, isLoading, refetch } = useGetQuery({
    path: `/categories?per_page=${itemsPerPage}&page=${currentPage}&parent_only=1&sub_only=0&child_only=0${searchTerm ? `&search=${searchTerm}` : ""}`,
  });
  console.log(data);

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

  const [createCategory, { isLoading: isCreating }] = usePostMutation();
  const [deleteCategory, { isLoading: isDeleting }] = useDeleteMutation();

  // Format data for the table
  const categories = data?.data?.map((category) => {
    const categoryData = {
      id: category.id,
      uuid: category.category_uuid,
      name: category.name,
      slug: category.slug,
      title: category.title,
      metaTags: category.meta_tags,
      ordering: category.ordering,
      metaDescription: category.meta_description,
      status: category.status ? "Active" : "Inactive",
      isBanned: "No",
      iconWithName: (
        <div className="flex items-center space-x-2">
          {category.icon ? (
            <img
              src={category.icon}
              alt={category.name}
              className="h-6 w-6 object-cover rounded-full"
            />
          ) : (
            <span className="h-6 w-6 bg-gray-300 rounded-full flex items-center justify-center text-white">
              ?
            </span>
          )}
          <span className="text-[#2B3674]">{category.name}</span>{" "}
        </div>
      ),
      icon: category.icon || "",
      actions: (
        <div className="flex space-x-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleEditClick(
                categoryData,
                setCurrentRowData,
                setIsEditModalOpen,
              );
            }}
            className="text-pinkclr hover:text-pink-900"
          >
            <SquarePen size={20} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleDeleteClick(
                categoryData,
                setCurrentRowData,
                setIsDeleteModalOpen,
              );
            }}
            className="text-pinkclr hover:text-red-900"
          >
            <Trash2 size={20} />
          </button>
        </div>
      ),
    };
    return categoryData;
  });

  const columns = [
    { key: "iconWithName", label: "Name" },
    { key: "ordering", label: "Order" },
    { key: "status", label: "Status", toggleable: true },
    { key: "actions", label: "Actions" },
  ];

  // Handle search function
  const handleSearch = (term) => {
    setSearchTerm(term);
    setCurrentPage(1); // Reset to first page when searching
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="mt-12 mb-8 flex bg-[#F2F7FB] flex-col gap-12 px-8">
      <DynamicTable
        data={categories || []}
        columns={columns}
        tableTitle="Main Category"
        addButtonText="Add New Category"
        onAdd={() => setIsCreateModalOpen(true)}
        onEdit={handleEditClick}
        onDelete={handleDeleteClick}
        onStatusChange={(row, newStatus) =>
          handleStatusChange(row, newStatus, createCategory, refetch, toast)
        }
        onBanStatusChange={() => {}}
        onSearch={handleSearch}
        isLoading={isLoading || isCreating || isDeleting}
        currentPage={currentPage}
        totalItems={totalItems}
        itemsPerPage={itemsPerPage}
        onPageChange={handlePageChange}
        searchEnabled={true}
        searchPlaceholder="Search categories..."
        lowerCase="capitalize"
      />

      {isCreateModalOpen && (
        <DynamicCategoryModal
          title="Add New Category"
          fields={[
            { name: "name", label: "Name", type: "text" },
            { name: "title", label: "Title", type: "text" },
            { name: "metaTags", label: "Meta Tags", type: "text" },
            { name: "ordering", label: "Ordering", type: "number" },
            {
              name: "meta_description",
              label: "Meta Description",
              type: "textarea",
            },
            { name: "icon", label: "Set Icon", type: "file" },
          ]}
          onSubmit={(newData) =>
            handleAdd(
              newData,
              createCategory,
              refetch,
              toast,
              setIsCreateModalOpen,
            )
          }
          onClose={() => setIsCreateModalOpen(false)}
        />
      )}
      {isEditModalOpen && currentRowData && (
        <DynamicCategoryModal
          title="Edit Category"
          fields={[
            { name: "name", label: "Name", type: "text" },
            { name: "title", label: "Title", type: "text" },
            { name: "metaTags", label: "Meta Tags", type: "text" },
            { name: "ordering", label: "Ordering", type: "number" },
            {
              name: "metaDescription",
              label: "Meta Description",
              type: "textarea",
            },
            { name: "icon", label: "Set Icon", type: "file" },
          ]}
          onSubmit={(updatedData) =>
            handleEdit(
              updatedData,
              createCategory,
              refetch,
              toast,
              setIsEditModalOpen,
            )
          }
          onClose={() => setIsEditModalOpen(false)}
          initialData={currentRowData}
        />
      )}

      <DeleteModal
        open={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onDelete={() =>
          handleDelete(
            currentRowData,
            deleteCategory,
            refetch,
            toast,
            setIsDeleteModalOpen,
          )
        }
      />
    </div>
  );
}

export default MainCategory;
