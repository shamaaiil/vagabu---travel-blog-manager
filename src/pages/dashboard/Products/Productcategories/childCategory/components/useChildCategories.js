import { useState } from "react";
import {
  useGetQuery,
  usePostMutation,
  useDeleteMutation,
} from "@/services/apiService";
import { toast } from "react-toastify";
import { formatChildCategories } from "./categoryHelpers";

const useChildCategories = ({
  setIsEditModalOpen,
  setIsDeleteModalOpen,
  setIsCreateModalOpen,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedParentId, setSelectedParentId] = useState(null);
  const [selectedSubcategoryId, setSelectedSubcategoryId] = useState(null);
  const [currentRowData, setCurrentRowData] = useState(null);
  const itemsPerPage = 10;

  // Fetch data
  const { data: parentCategories, isLoading: isLoadingParents } = useGetQuery({
    path: "/categories?parent_only=1",
  });

  const { data: subcategories, refetch: refetchSubcategories } = useGetQuery({
    path: selectedParentId
      ? `/categories?parent_only=0&sub_only=1&child_only=0&parent_id=${selectedParentId}`
      : null,
    enabled: !!selectedParentId,
  });

  const { data, isLoading, refetch } = useGetQuery({
    path: `/categories?per_page=${itemsPerPage}&page=${currentPage}&parent_only=0&sub_only=0&child_only=1${
      selectedSubcategoryId ? `&parent_id=${selectedSubcategoryId}` : ""
    }${searchTerm ? `&search=${searchTerm}` : ""}`,
  });

  const [createCategory, { isLoading: isCreating }] = usePostMutation();
  const [deleteCategory, { isLoading: isDeleting }] = useDeleteMutation();

  // Handlers (defined before usage in childCategories)
  const handleEditClick = (row) => {
    const categoryData = row.data || row;
    const parentCategory = parentCategories?.data?.find(
      (cat) => cat.id === categoryData.parent_id,
    );

    if (parentCategory) {
      setSelectedParentId(parentCategory.id);
      refetchSubcategories();
    }

    setCurrentRowData(categoryData);
    setIsEditModalOpen(true);
  };

  const handleDeleteClick = (row) => {
    setCurrentRowData(row);
    setIsDeleteModalOpen(true);
  };

  const handleParentChange = (parentId) => {
    setSelectedParentId(parentId);
    setSelectedSubcategoryId(null);
    if (parentId) {
      refetchSubcategories();
    }
  };

  const handleSubcategoryChange = (subcategoryId) => {
    setSelectedSubcategoryId(subcategoryId);
    refetch();
  };

  const handleAdd = async (newData) => {
    try {
      if (!newData.parentId)
        return toast.error("Please select a parent category");
      if (!newData.subCategoryId)
        return toast.error("Please select a subcategory");
      if (!newData.name)
        return toast.error("Please enter a child category name");

      const formData = new FormData();
      formData.append("name", newData.name);
      formData.append("parent_id", newData.subCategoryId);
      formData.append("type", "prints");
      formData.append("status", 1);
      if (newData.metaTags) formData.append("meta_tags", newData.metaTags);
      if (newData.metaDescription)
        formData.append("meta_description", newData.metaDescription);
      if (newData.ordering) formData.append("ordering", newData.ordering);
      if (newData.icon && typeof newData.icon !== "string")
        formData.append("icon", newData.icon);

      const res = await createCategory({
        path: "/categories",
        method: "POST",
        body: formData,
      });

      if (!res.error) {
        toast.success("Child category added successfully");
        setIsCreateModalOpen(false);
        refetch();
      } else {
        toast.error(res.error.data.message || "Failed to add child category");
      }
    } catch (error) {
      console.error("Error adding child category:", error);
      toast.error("An unexpected error occurred");
    }
  };

  const handleStatusChange = async (row, newStatus) => {
    try {
      const categoryName = row.data?.name || row.name; // Use raw name from row.data
      if (!categoryName || typeof categoryName !== "string") {
        throw new Error("Invalid category name");
      }

      const formData = new FormData();
      formData.append("name", categoryName);
      formData.append(
        "slug",
        row.data?.slug || categoryName.toLowerCase().replace(/\s+/g, "-"),
      );
      formData.append("title", row.data?.title || categoryName);
      formData.append("meta_tags", row.data?.meta_tags || "");
      formData.append("ordering", row.data?.ordering || 0);
      formData.append("status", newStatus === "Active" ? 1 : 0);
      formData.append("type", row.data?.type || "prints");

      if (!row.uuid) {
        throw new Error("Category UUID is missing");
      }

      const res = await createCategory({
        path: `/categories/${row.uuid}?_method=patch`,
        method: "POST",
        body: formData,
      });

      if (!res.error) {
        toast.success("Status updated successfully");
        refetch();
      } else {
        console.error("API error:", res.error);
        toast.error(res.error.data?.message || "Failed to update status");
      }
    } catch (error) {
      console.error("Error updating status:", error.message);
      toast.error(error.message || "Failed to update status");
    }
  };

  const handleEdit = async (updatedData) => {
    try {
      if (!updatedData.subCategoryId)
        return toast.error("Please select a subcategory");
      if (!updatedData.name)
        return toast.error("Please enter a child category name");

      const formData = new FormData();
      formData.append("name", updatedData.name);
      formData.append("parent_id", updatedData.subCategoryId);
      formData.append("status", updatedData.status === "Active" ? 1 : 0);
      formData.append("type", "prints");
      if (updatedData.metaTags)
        formData.append("meta_tags", updatedData.metaTags);
      if (updatedData.metaDescription)
        formData.append("meta_description", updatedData.metaDescription);
      if (updatedData.ordering)
        formData.append("ordering", updatedData.ordering);
      if (updatedData.icon && typeof updatedData.icon !== "string")
        formData.append("icon", updatedData.icon);

      const categoryUuid =
        currentRowData.data?.category_uuid ||
        currentRowData.category_uuid ||
        currentRowData.uuid;

      if (!categoryUuid) return toast.error("Category UUID is missing");

      const res = await createCategory({
        path: `/categories/${categoryUuid}?_method=patch`,
        method: "POST",
        body: formData,
      });

      if (!res.error) {
        toast.success("Child category updated successfully");
        refetch();
        setIsEditModalOpen(false);
      } else {
        toast.error(
          res.error.data?.message || "Failed to update child category",
        );
      }
    } catch (error) {
      console.error("Error updating child category:", error);
      toast.error("An unexpected error occurred");
    }
  };

  const handleDelete = async () => {
    try {
      const categoryUuid =
        currentRowData.data?.category_uuid ||
        currentRowData.category_uuid ||
        currentRowData.uuid;

      if (!categoryUuid) return toast.error("Category UUID is missing");

      const res = await deleteCategory({
        path: `/categories/${categoryUuid}`,
        method: "DELETE",
      });

      if (!res.error) {
        toast.success("Child category deleted successfully");
        refetch();
        setIsDeleteModalOpen(false);
      } else {
        toast.error(
          res.error.data?.message || "Failed to delete child category",
        );
      }
    } catch (error) {
      console.error("Error deleting child category:", error);
      toast.error("An unexpected error occurred");
    }
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
    setCurrentPage(1);
  };
  const parentCategoryOptions =
    parentCategories?.data?.map((cat) => ({
      value: cat.id,
      label: cat.name,
    })) || [];

  const subcategoryOptions =
    subcategories?.data?.map((subcat) => ({
      value: subcat.id,
      label: subcat.name,
    })) || [];

  const childCategories = formatChildCategories(
    data?.data,
    handleEditClick,
    handleDeleteClick,
  );

  const columns = [
    { key: "subCategory", label: "Subcategory" },
    { key: "name", label: "Child Category" },
    {
      key: "status",
      label: "Status",
      toggleable: true,
      onToggle: handleStatusChange,
    },
    { key: "actions", label: "Actions" },
  ];

  return {
    childCategories,
    columns,
    isLoading: isLoading || isCreating || isDeleting || isLoadingParents,
    currentPage,
    totalItems,
    itemsPerPage,
    selectedParentId,
    selectedSubcategoryId,
    parentCategoryOptions,
    subcategoryOptions,
    currentRowData,
    handleAdd,
    handleEdit,
    handleDelete,
    handlePageChange,
    handleSearch,
    handleEditClick,
    handleDeleteClick,
    handleParentChange,
    handleSubcategoryChange,
    handleStatusChange,
  };
};

export default useChildCategories;
