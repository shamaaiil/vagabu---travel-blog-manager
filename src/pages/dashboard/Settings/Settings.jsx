import { useState, useEffect } from "react";
import DynamicTable from "@/ui/DynamicTable";
import {
  useGetQuery,
  usePostMutation,
  useDeleteMutation,
} from "@/services/apiService";
import { toast } from "react-toastify";
import DeleteModal from "@/ui/DeleteModal";

// Status Toggle Component
const StatusToggle = ({ isActive, onChange, isLoading }) => {
  return (
    <button
      onClick={() => !isLoading && onChange(!isActive)}
      className={`px-3 py-1 rounded-full text-white text-sm font-medium ${
        isActive
          ? "bg-green-500 hover:bg-green-600"
          : "bg-gray-400 hover:bg-gray-500"
      } transition-colors flex items-center`}
      disabled={isLoading}
    >
      {isActive ? "Active" : "Inactive"}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-4 w-4 ml-1"
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <path
          fillRule="evenodd"
          d={
            isActive
              ? "M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
              : "M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z"
          }
          clipRule="evenodd"
        />
      </svg>
    </button>
  );
};

const SettingModal = ({
  title,
  fields,
  onSubmit,
  onClose,
  initialData = null,
}) => {
  const [formData, setFormData] = useState(
    initialData || {
      setting_value: "",
      is_active: 1, // Default to active
    },
  );

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? (checked ? 1 : 0) : value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 ">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl">
        <div className="p-6">
          <h2 className="text-xl font-semibold text-pink-500 mb-4">{title}</h2>
          <hr className="mb-4" />

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-2 gap-4 mb-4">
              {fields.map((field) => (
                <div key={field.name}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {field.label}
                  </label>
                  {field.type === "checkbox" ? (
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        name={field.name}
                        checked={formData[field.name] === 1}
                        onChange={handleChange}
                        className="h-4 w-4 text-blue-500 focus:ring-blue-400 rounded"
                      />
                      <span className="ml-2 text-sm text-gray-700">
                        {formData[field.name] === 1 ? "Active" : "Inactive"}
                      </span>
                    </div>
                  ) : (
                    <input
                      type={field.type || "text"}
                      name={field.name}
                      value={formData[field.name] || ""}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                      placeholder={`Enter ${field.label.toLowerCase()}`}
                      required={field.required !== false}
                      readOnly={field.readOnly}
                      disabled={field.readOnly}
                    />
                  )}
                </div>
              ))}
            </div>

            <div className="flex justify-end">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 mr-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-white bg-teal-500 rounded-md hover:bg-teal-600"
              >
                {initialData ? "Apply" : "Create"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

const Settings = () => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentRowData, setCurrentRowData] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusUpdating, setStatusUpdating] = useState(null); // Track which setting is being updated
  const itemsPerPage = 10; // Changed from 15 to 10 as requested

  // Fetch settings data with proper pagination
  const { data, isLoading, refetch } = useGetQuery({
    path: `/admin-setting?per_page=${itemsPerPage}&page=${currentPage}${
      searchTerm ? `&search=${searchTerm}` : ""
    }`,
  });

  // Refetch data when page or search changes
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
        setTotalItems(data.total || data.data.length);
      }
    }
  }, [data]);

  const [createSetting, { isLoading: isCreating }] = usePostMutation();

  // Handle status toggle
  const handleStatusToggle = async (
    uuid,
    settingName,
    settingValue,
    currentStatus,
  ) => {
    setStatusUpdating(uuid); // Set updating state
    try {
      const res = await createSetting({
        path: `/admin-setting/${uuid}?_method=put`,
        method: "POST",
        body: {
          setting_name: settingName,
          setting_value: settingValue,
          is_active: currentStatus ? 0 : 1, // Toggle the status (0 for inactive, 1 for active)
        },
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
    } finally {
      setStatusUpdating(null); // Clear updating state
    }
  };

  // Format data for the table
  const settings = data?.data?.map((setting) => {
    const isActive = setting.status === true || setting.status === 1;

    const settingData = {
      id: setting.id,
      uuid: setting.uuid,
      settingName: setting.setting_name,
      settingValue: setting.setting_value,
      status: (
        <StatusToggle
          isActive={isActive}
          onChange={() =>
            handleStatusToggle(
              setting.uuid,
              setting.setting_name,
              setting.setting_value,
              isActive,
            )
          }
          isLoading={statusUpdating === setting.uuid}
        />
      ),
      // Modified actions column to only include edit button
      actions: (
        <div className="flex space-x-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleEditClick(settingData, isActive);
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
        </div>
      ),
    };
    return settingData;
  });

  const columns = [
    { key: "settingName", label: "Setting Name" },
    { key: "settingValue", label: "Setting Value" },
    { key: "status", label: "Status" },
    { key: "actions", label: "Actions" },
  ];

  const handleEditClick = (row, isActive) => {
    setCurrentRowData({ ...row, is_active: isActive ? 1 : 0 });
    setIsEditModalOpen(true);
  };

  const handleEdit = async (updatedData) => {
    try {
      const res = await createSetting({
        path: `/admin-setting/${currentRowData.uuid}?_method=put`,
        method: "POST",
        body: {
          setting_name: currentRowData.settingName, // Keep the original name
          setting_value: updatedData.setting_value,
          is_active: updatedData.is_active, // Already converted to 0/1 in form
        },
      });

      if (!res.error) {
        toast.success("Setting updated successfully");
        refetch();
        setIsEditModalOpen(false);
      } else {
        toast.error(res.error.data.message || "Failed to update setting");
      }
    } catch (error) {
      console.error("Error updating setting:", error);
      toast.error("Failed to update setting");
    }
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
    setCurrentPage(1); // Reset to page 1 on new search
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="mt-12 mb-8 flex bg-[#F2F7FB] flex-col gap-12 px-8">
      <DynamicTable
        data={settings || []}
        columns={columns}
        tableTitle="Settings Management"
        onEdit={handleEditClick}
        onSearch={handleSearch}
        isLoading={isLoading || isCreating || !!statusUpdating}
        currentPage={currentPage}
        totalItems={totalItems}
        itemsPerPage={itemsPerPage}
        onPageChange={handlePageChange}
        searchEnabled={true}
        showAddButton={false}
        searchPlaceholder="Search settings..."
      />

      {isEditModalOpen && currentRowData && (
        <SettingModal
          title="Edit Setting"
          fields={[
            {
              name: "setting_value",
              label: "Setting Value",
              type: "text",
            },
            {
              name: "is_active",
              label: "Status",
              type: "checkbox",
            },
          ]}
          onSubmit={handleEdit}
          onClose={() => setIsEditModalOpen(false)}
          initialData={{
            setting_name: currentRowData.settingName,
            setting_value: currentRowData.settingValue,
            is_active: currentRowData.is_active,
          }}
        />
      )}
    </div>
  );
};

export default Settings;
