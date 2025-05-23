import { toast } from "react-toastify";

const SubCategoryHelpers = ({
  createCategory,
  deleteCategory,
  refetch,
  setIsCreateModalOpen,
  setIsEditModalOpen,
  setIsDeleteModalOpen,
  setCurrentRowData,
}) => {
  const handleEditClick = (row) => {
    setCurrentRowData(row);
    setIsEditModalOpen(true);
  };

  const handleDeleteClick = (row) => {
    setCurrentRowData(row);
    setIsDeleteModalOpen(true);
  };

  const handleAdd = async (newData) => {
    try {
      const formData = new FormData();
      if (!newData.parentId) {
        throw new Error("parent_id is required");
      }

      formData.append("name", newData.name);
      formData.append("parent_id", newData.parentId);

      if (newData.metaTags && newData.metaTags.trim() !== "") {
        formData.append("meta_tags", newData.metaTags);
      }

      if (newData.ordering && newData.ordering.trim() !== "") {
        formData.append("ordering", newData.ordering);
      }

      if (newData.meta_description && newData.meta_description.trim() !== "") {
        formData.append("meta_description", newData.meta_description);
      }

      formData.append("status", 1);
      formData.append("type", "prints");

      if (newData.icon) {
        formData.append("icon", newData.icon);
      }

      const res = await createCategory({
        path: "/categories",
        method: "POST",
        body: formData,
      });
      if (!res.error) {
        toast.success("Sub category added successfully");
        setIsCreateModalOpen(false);
        refetch();
      } else {
        toast.error(res.error.data.message || "Failed to add sub category");
      }
    } catch (error) {
      toast.error("An unexpected error occurred");
    }
  };

  const handleEdit = async (updatedData) => {
    try {
      const formData = new FormData();
      if (!updatedData.parentId) {
        throw new Error("parent_id is required");
      }

      formData.append("name", updatedData.name);
      formData.append("parent_id", updatedData.parentId);

      if (updatedData.metaTags && updatedData.metaTags.trim() !== "") {
        formData.append("meta_tags", updatedData.metaTags);
      }
      if (updatedData.ordering && updatedData.ordering.trim() !== "") {
        formData.append("ordering", updatedData.ordering);
      }

      if (
        updatedData.meta_description &&
        updatedData.meta_description.trim() !== ""
      ) {
        formData.append("meta_description", updatedData.meta_description);
      }

      formData.append("status", updatedData.status === "Active" ? 1 : 0);
      formData.append("type", "prints");

      if (updatedData.icon && updatedData.icon instanceof File) {
        formData.append("icon", updatedData.icon);
      }

      const res = await createCategory({
        path: `/categories/${updatedData.uuid}?_method=patch`,
        method: "POST",
        body: formData,
      });

      if (!res.error) {
        toast.success("Subcategory updated successfully");
        setIsEditModalOpen(false);
        refetch();
      } else {
        toast.error(res.error.data.message || "Failed to update subcategory");
      }
    } catch (error) {
      toast.error("An unexpected error occurred");
    }
  };

  const handleDelete = async () => {
    try {
      const res = await deleteCategory({
        path: `/categories/${currentRowData.uuid}`,
        method: "DELETE",
      });
      if (!res.error) {
        toast.success("Subcategory deleted successfully");
        refetch();
      } else {
        toast.error(res.error.data.message || "Failed to delete subcategory");
      }
      setIsDeleteModalOpen(false);
    } catch (error) {
      toast.error("An unexpected error occurred");
    }
  };

  const handleStatusChange = async (row, newStatus) => {
    try {
      const formData = new FormData();
      if (!row.parentId) {
        throw new Error("parent_id is required");
      }

      formData.append("name", row.name);
      formData.append("parent_id", row.parentId);
      formData.append("status", newStatus === "Active" ? 1 : 0);
      formData.append("type", "prints");

      const res = await createCategory({
        path: `/categories/${row.uuid}?_method=patch`,
        method: "POST",
        body: formData,
      });

      if (!res.error) {
        toast.success("Status updated successfully");
        refetch();
      } else {
        toast.error(res.error.data.message || "Failed to update status");
      }
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Failed to update status");
    }
  };

  return {
    handleAdd,
    handleEdit,
    handleDelete,
    handleStatusChange,
    handleEditClick,
    handleDeleteClick,
  };
};

export default SubCategoryHelpers;
