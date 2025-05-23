import DynamicTable from "@/ui/DynamicTable";
import CreateModal from "@/ui/DynmicModal";
import { useState } from "react";
import EditModal from "@/ui/EditModal";
import DeleteModal from "@/ui/DeleteModal";
import {
  useDeleteMutation,
  useGetQuery,
  usePostMutation,
} from "@/services/apiService";
import Tabs from "@/ui/Tabs";
import { toast } from "react-toastify";
import Loader from "@/ui/Loader";

export function ProjectsPage() {
  const columns = [
    "feature image",
    "images",
    "title",
    "subtitle",
    "description",
    "Category",
  ];
  const tableColumns = [
    "feature image",
    "title",
    "subtitle",
    "description",
    "Category",
  ];
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentRowData, setCurrentRowData] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentCategory, setCurrentCategory] = useState({
    id: 6,
    category: "Completed",
  });

  const { data, isLoading, refetch } = useGetQuery({
    path: `/section/projects?category_id=${currentCategory.id}`,
  });

  const [deleteEvent, { isLoading: deleteLoading }] = useDeleteMutation();
  const [createEvent, { isLoading: isPosting }] = usePostMutation();

  const sectionData = data?.data?.section_data;

  const dropdownOptions = {
    Category: [
      { id: 6, category: "Completed" },
      { id: 5, category: "Ongoing" },
      { id: 7, category: "Upcoming" },
    ],
  };

  const categories = [
    { id: 6, category: "Completed" },
    { id: 5, category: "Ongoing" },
    { id: 7, category: "Upcoming" },
  ];

  const handleAdd = async (newData) => {
    try {
      const formData = new FormData();

      formData.append("title", newData.title);
      if (newData?.subtitle) {
        formData.append("subtitle", newData.subtitle);
      }
      if (newData?.description) {
        formData.append("description", newData.description);
      }
      if (newData?.category) {
        formData.append("category_id", newData.category);
      }
      formData.append("section_id", data?.data?.id);

      // Append feature image
      if (newData?.featureImage) {
        formData.append("foreground_image", newData.featureImage);
      }
      if (newData.images && newData.images.length > 0) {
        Array.from(newData.images).forEach((image) => {
          formData.append("images[]", image);
        });
      }

      // Append images

      const res = await createEvent({
        path: "/section-data/create",
        method: "POST",
        body: formData,
      });

      if (!res.error) {
        toast.success("Project created successfully!");
        refetch();
        setIsCreateModalOpen(false);
      } else {
        toast.error(res.error.data.message || "Failed to create project");
      }
    } catch (error) {
      console.error("Error creating project:", error);
      toast.error("An unexpected error occurred!");
    }
  };

  const fetchImageAsFile = async (imageObject, index) => {
    try {
      const response = await fetch(imageObject.file_url); // Fetch the image from the URL
      const blob = await response.blob(); // Convert the response to a Blob

      // Use the file_name from the server, preserving the original extension
      const fileName = imageObject.file_name || `existing_image_${index}.webp`;

      // Create a File object
      const file = new File([blob], fileName, { type: blob.type });

      return file;
    } catch (error) {
      console.error(`Failed to fetch image: ${imageObject.file_url}`, error);
      throw error;
    }
  };
  const handleEdit = async (updatedData) => {
    ("updateData.image", updatedData?.images);

    try {
      const formData = new FormData();

      formData.append("title", updatedData?.title);

      if (updatedData?.subtitle) {
        formData.append("subtitle", updatedData?.subtitle);
      }
      if (updatedData?.description) {
        formData.append("description", updatedData?.description);
      }

      // Ensure category_id is correctly extracted
      if (updatedData.category && updatedData.category.id) {
        formData.append("category_id", updatedData.category.id);
      } else if (updatedData.category) {
        formData.append("category_id", updatedData.category); // For cases where the category is already the ID
      }

      formData.append("section_id", data?.data?.id);

      // Append feature image
      if (updatedData?.featureImage) {
        formData.append("foreground_image", updatedData.featureImage);
      }

      // Append images

      const allImages = [];

      ("updatedData.images", updatedData?.images);

      // Process all images (existing + new)
      if (updatedData.images && updatedData.images.length > 0) {
        for (const [index, image] of updatedData.images.entries()) {
          if (image.file_url) {
            // Existing image: fetch and convert to File
            const file = await fetchImageAsFile(image, index);
            allImages.push(file);
          } else if (image instanceof File || image instanceof Blob) {
            // New or compressed image
            const fileName = image.name || `compressed_image_${index}.jpg`;
            const file = new File([image], fileName, { type: image.type });
            allImages.push(file);
          }
        }
      }

      const res = await createEvent({
        path: `/section-data/${currentRowData?.slug}?_method=patch`,
        method: "POST",
        body: formData,
      });

      if (!res.error) {
        toast.success("Project updated successfully!");
        refetch();
        setIsEditModalOpen(false);
      } else {
        toast.error(res.error.data.message || "Failed to update project");
      }
    } catch (error) {
      console.error("Error updating project:", error);
      toast.error("An unexpected error occurred!");
    }
  };

  const handleDeleteConfirm = async () => {
    if (!currentRowData) return;

    const res = await deleteEvent({
      path: `/section-data/${currentRowData?.uuid}`,
      method: "DELETE",
    });

    if (!res.error) {
      toast.success("Project deleted successfully!");
      refetch();
      setIsDeleteModalOpen(false);
    } else {
      toast.error(res.error?.data?.message || "Failed to delete project");
    }
  };

  const handleDelete = (row) => {
    setCurrentRowData(row);
    setIsDeleteModalOpen(true);
  };

  const handleEditClick = (row) => {
    setCurrentRowData(row);
    setIsEditModalOpen(true);
  };
  const validations = {
    title: [
      { type: "required" },
      {
        type: "minLength",
        value: 3,
        message: "Title must be at least 3 characters long.",
      },
    ],
    // subtitle: [
    //   { type: "required" },
    //   {
    //     type: "minLength",
    //     value: 3,
    //     message: "Subtitle must be at least 3 characters long.",
    //   },
    // ],
    // description: [
    //   { type: "required" },
    //   {
    //     type: "minLength",
    //     value: 10,
    //     message: "Description must be at least 10 characters long.",
    //   },
    // ],
    // category: [{ type: "required", message: "Category is required." }],
    // featureImage: [{ type: "required", message: "Feature Image is required." }],
    // images: [{ type: "required", message: "At least one image is required." }],
  };
  return (
    <>
      <div className="mt-12 mb-8 flex flex-col gap-12">
        {/* Category Tabs */}
        <Tabs
          categories={categories}
          currentCategory={currentCategory}
          setCurrentCategory={setCurrentCategory}
        />

        {/* Dynamic Table */}
        <DynamicTable
          tableTitle={`Projects (${currentCategory.category})`}
          columns={tableColumns}
          data={sectionData}
          onAdd={handleAdd}
          dropdownOptions={dropdownOptions}
          onDelete={handleDelete}
          isLoading={isLoading}
          onEdit={handleEditClick}
          open={() => setIsCreateModalOpen(true)}
        />

        {/* CreateModal Component */}
        <CreateModal
          open={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onSubmit={handleAdd}
          columns={columns}
          validations={validations}
          dropdownOptions={dropdownOptions}
        />

        {/* EditModal Component */}
        <EditModal
          open={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          onSubmit={handleEdit}
          columns={columns}
          validations={validations}
          dropdownOptions={dropdownOptions}
          rowData={currentRowData}
        />

        {/* Delete Modal */}
        <DeleteModal
          open={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          onDelete={handleDeleteConfirm}
          rowData={currentRowData}
        />
      </div>
      {isPosting && <Loader />}
      {deleteLoading && <Loader />}
    </>
  );
}

export default ProjectsPage;
