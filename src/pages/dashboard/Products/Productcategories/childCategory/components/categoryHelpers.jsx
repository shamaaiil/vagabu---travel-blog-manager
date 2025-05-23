import { SquarePen, Trash2 } from "lucide-react";
export const formatChildCategories = (
  data,
  handleEditClick,
  handleDeleteClick,
) => {
  return (
    data?.map((category) => {
      const categoryData = category.data || category;

      return {
        id: categoryData.id,
        uuid: categoryData.category_uuid,
        name: (
          <div className="flex items-center space-x-2">
            {categoryData.icon && (
              <img
                src={categoryData.icon}
                alt={`${categoryData.name} icon`}
                className="w-6 h-6 object-cover rounded-full"
              />
            )}
            <span>{categoryData.name}</span>
          </div>
        ),
        subCategory: categoryData.parent_name || "Unknown",
        status: categoryData.status ? "Active" : "Inactive",
        parentId: categoryData.parent_id,
        data: categoryData,
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
    }) || []
  );
};

export const getModalFields = ({
  parentCategoryOptions,
  subcategoryOptions,
  selectedParentId,
  handleParentChange,
  handleSubcategoryChange,
  currentRowData,
}) => {
  const createModalFields = [
    {
      name: "parentId",
      label: "Category",
      type: "select",
      options: parentCategoryOptions,
      required: true,
      onChange: handleParentChange,
    },
    {
      name: "subCategoryId",
      label: "Sub Category",
      type: "select",
      options: subcategoryOptions,
      required: true,
      disabled: !selectedParentId,
      onChange: handleSubcategoryChange,
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
      name: "metaDescription",
      label: "Meta Description",
      type: "textarea",
    },
    {
      name: "ordering",
      label: "Ordering",
      type: "text",
    },
    {
      name: "icon",
      label: "Set Icon",
      type: "file",
    },
  ];

  const editModalFields = [
    {
      name: "parentId",
      label: "Category",
      type: "select",
      options: parentCategoryOptions,
      required: true,
      onChange: handleParentChange,
      defaultValue: currentRowData?.parentId,
    },
    {
      name: "subCategoryId",
      label: "Sub Category",
      type: "select",
      options: subcategoryOptions,
      required: true,
      disabled: !selectedParentId,
      onChange: handleSubcategoryChange,
      defaultValue: currentRowData?.subCategoryId,
    },
    {
      name: "name",
      label: "Name",
      type: "text",
      required: true,
      defaultValue: currentRowData?.name,
    },
    {
      name: "metaTags",
      label: "Meta Tags",
      type: "text",
      defaultValue: currentRowData?.meta_tags,
    },
    {
      name: "metaDescription",
      label: "Meta Description",
      type: "textarea",
      defaultValue: currentRowData?.meta_description,
    },
    {
      name: "ordering",
      label: "Ordering",
      type: "text",
      defaultValue: currentRowData?.ordering,
    },
    {
      name: "status",
      label: "Status",
      type: "select",
      options: [
        { value: "Active", label: "Active" },
        { value: "Inactive", label: "Inactive" },
      ],
      defaultValue: currentRowData?.status,
    },
    {
      name: "icon",
      label: "Set Icon",
      type: "file",
    },
  ];

  return { createModalFields, editModalFields };
};
