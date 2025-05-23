import { toast } from "react-toastify";

export const handleAdd = async (
  newData,
  createCategory,
  refetch,
  toast,
  setIsCreateModalOpen,
) => {
  try {
    const formData = new FormData();
    if (newData.name) {
      formData.append("name", newData.name);
    }

    if (newData.slug) {
      formData.append("slug", newData.slug);
    }

    if (newData.title) {
      formData.append("title", newData.title);
    }

    if (newData.metaTags && newData.metaTags.trim() !== "") {
      formData.append("meta_tags", newData.metaTags);
    }

    if (newData.ordering) {
      formData.append("ordering", newData.ordering);
    }

    if (newData.meta_description && newData.meta_description.trim() !== "") {
      formData.append("meta_description", newData.meta_description);
    }

    formData.append("status", newData.status === "Active" ? 1 : 0); // Convert status to 0 or 1

    if (newData.type) {
      formData.append("type", newData.type);
    } else {
      formData.append("type", "prints"); // Default to "prints"
    }

    if (newData.icon) {
      formData.append("icon", newData.icon);
    }

    const res = await createCategory({
      path: "/categories",
      method: "POST",
      body: formData,
    });
    if (!res.error) {
      toast.success("Category added successfully");
      refetch();
      setIsCreateModalOpen(false);
    } else {
      toast.error(res.error.data.message || "Failed to add category");
    }
  } catch (error) {
    toast.error("An unexpected error occurred");
  }
};

export const handleEdit = async (
  updatedData,
  createCategory,
  refetch,
  toast,
  setIsEditModalOpen,
) => {
  try {
    const formData = new FormData();
    if (updatedData.name) {
      formData.append("name", updatedData.name);
    }

    if (updatedData.slug) {
      formData.append("slug", updatedData.slug);
    }

    if (updatedData.title) {
      formData.append("title", updatedData.title);
    }

    if (updatedData.metaTags && updatedData.metaTags.trim() !== "") {
      formData.append("meta_tags", updatedData.metaTags);
    }

    if (updatedData.ordering) {
      formData.append("ordering", updatedData.ordering);
    }

    if (
      updatedData.metaDescription &&
      updatedData.metaDescription.trim() !== ""
    ) {
      formData.append("meta_description", updatedData.metaDescription);
    }

    formData.append("status", updatedData.status === "Active" ? 1 : 0);

    formData.append("type", updatedData.type || "prints");

    if (updatedData.icon instanceof File) {
      formData.append("icon", updatedData.icon);
    }

    const res = await createCategory({
      path: `/categories/${updatedData.uuid}?_method=patch`, // Use UUID for the update
      method: "POST",
      body: formData,
    });

    if (!res.error) {
      toast.success("Category updated successfully");
      setIsEditModalOpen(false);
      refetch();
    } else {
      toast.error(res.error.data.message || "Failed to update category");
    }
  } catch (error) {
    console.error("An unexpected error occurred", error);
    toast.error("An unexpected error occurred");
  }
};

export const handleStatusChange = async (
  row,
  newStatus,
  createCategory,
  refetch,
  toast,
) => {
  try {
    // Create a FormData object for the update
    const formData = new FormData();
    formData.append("name", row.name);
    formData.append("slug", row.slug);
    formData.append("title", row.title);
    formData.append("meta_tags", row.metaTags);
    formData.append("ordering", row.ordering);

    // Convert to 0 or 1 explicitly
    formData.append("status", newStatus === "Active" ? 1 : 0);
    formData.append("type", row.type || "prints");

    // Make the API call
    const res = await createCategory({
      path: `/categories/${row.uuid}?_method=patch`,
      method: "POST",
      body: formData,
    });

    if (!res.error) {
      toast.success("Status updated successfully");
      refetch(); // Refresh the data
    } else {
      toast.error(res.error.data.message || "Failed to update status");
    }
  } catch (error) {
    console.error("Error updating status:", error);
    toast.error("Failed to update status");
  }
};

export const handleDelete = async (
  currentRowData,
  deleteCategory,
  refetch,
  toast,
  setIsDeleteModalOpen,
) => {
  try {
    const res = await deleteCategory({
      path: `/categories/${currentRowData.uuid}`,
      method: "DELETE",
    });
    if (!res.error) {
      toast.success("Category deleted successfully");
      refetch();
    } else {
      toast.error(res.error.data.message || "Failed to delete category");
    }
    setIsDeleteModalOpen(false);
  } catch (error) {
    toast.error("An unexpected error occurred");
  }
};

// const handleStatusChange = async (row, newStatus) => {
//   try {
//     // Create a FormData object for the update
//     const formData = new FormData();
//     formData.append("name", row.name);
//     formData.append(
//       "slug",
//       row.slug || row.name.toLowerCase().replace(/\s+/g, "-"),
//     ); // Fallback slug
//     formData.append("title", row.title || row.name);
//     formData.append("meta_tags", row.meta_tags || "");
//     formData.append("ordering", row.ordering || 0);
//     formData.append("status", newStatus === "Active" ? 1 : 0);
//     formData.append("type", row.type || "prints");

//     // Make the API call
//     const res = await createCategory({
//       path: `/categories/${row.uuid}?_method=patch`,
//       method: "POST",
//       body: formData,
//     });

//     if (!res.error) {
//       toast.success("Status updated successfully");
//       refetch(); // Refresh the data
//     } else {
//       toast.error(res.error.data.message || "Failed to update status");
//     }
//   } catch (error) {
//     console.error("Error updating status:", error);
//     toast.error("Failed to update status");
//   }
// };

export const handleEditClick = (row, setCurrentRowData, setIsEditModalOpen) => {
  setCurrentRowData(row);
  setIsEditModalOpen(true);
};

export const handleDeleteClick = (
  row,
  setCurrentRowData,
  setIsDeleteModalOpen,
) => {
  setCurrentRowData(row);
  setIsDeleteModalOpen(true);
};
