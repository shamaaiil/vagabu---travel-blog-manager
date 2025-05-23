import { useState } from "react";
import DynamicTable from "@/ui/DynamicTable";
import DynamicCategoryModal from "../components/CategoryModal";
import DeleteModal from "@/ui/DeleteModal";
import useChildCategories from "./components/useChildCategories";
import { getModalFields } from "./components/categoryHelpers";

const ChildCategories = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const {
    childCategories,
    columns,
    isLoading,
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
  } = useChildCategories({
    setIsEditModalOpen,
    setIsDeleteModalOpen,
    setIsCreateModalOpen,
  });

  const { createModalFields, editModalFields } = getModalFields({
    parentCategoryOptions,
    subcategoryOptions,
    selectedParentId,
    handleParentChange,
    handleSubcategoryChange,
    currentRowData,
  });

  return (
    <div className="mt-12 mb-8 flex bg-[#F2F7FB] flex-col gap-12 px-8">
      <DynamicTable
        data={childCategories || []}
        columns={columns}
        tableTitle="Child Category"
        addButtonText="Add New Child Category"
        onAdd={() => setIsCreateModalOpen(true)}
        onEdit={handleEditClick}
        onDelete={handleDeleteClick}
        onStatusChange={handleStatusChange}
        isLoading={isLoading}
        currentPage={currentPage}
        totalItems={totalItems}
        itemsPerPage={itemsPerPage}
        onPageChange={handlePageChange}
        searchEnabled={true}
        onSearch={handleSearch}
        searchPlaceholder="Search child categories..."
      />

      {isCreateModalOpen && (
        <DynamicCategoryModal
          title="Add New Child Category"
          fields={createModalFields}
          onSubmit={handleAdd}
          onClose={() => {
            setIsCreateModalOpen(false);
          }}
          submitButtonText="Create"
        />
      )}

      {isEditModalOpen && currentRowData && (
        <DynamicCategoryModal
          title="Edit Child Category"
          fields={editModalFields}
          onSubmit={handleEdit}
          onClose={() => {
            setIsEditModalOpen(false);
          }}
          submitButtonText="Update"
          initialData={{
            ...currentRowData,
            parentId: selectedParentId,
            subCategoryId: selectedSubcategoryId,
            meta_tags: currentRowData.meta_tags,
            meta_description: currentRowData.meta_description,
            ordering: currentRowData.ordering,
            status: currentRowData.status,
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
};

export default ChildCategories;
