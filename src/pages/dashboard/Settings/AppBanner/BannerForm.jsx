import React, { useEffect, useState } from "react";

const BannerForm = ({ onClose, selectedItem }) => {
  const [formData, setFormData] = useState({
    heading: "",
    subHeading: "",
    type: "",
    description: "",
  });

  // Populate form if editing
  useEffect(() => {
    if (selectedItem) {
      setFormData({
        heading: selectedItem.heading || "",
        subHeading: selectedItem.subHeading || "",
        type: selectedItem.type || "",
        description: selectedItem.description || "",
      });
    } else {
      setFormData({
        heading: "",
        subHeading: "",
        type: "",
        description: "",
      });
    }
  }, [selectedItem]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    if (selectedItem) {
    } else {
    }
    onClose();
  };

  return (
    <>
      <div className="flex flex-col items-center">
        <div className="border border-gray-300 w-80 h-36 flex items-center justify-center rounded-md mb-2">
          <span className="text-sm text-gray-500">Current Featured Image</span>
        </div>
        <p className="text-xs text-gray-500 mb-4">
          Preferred size: (1280x600 Square size)
        </p>
      </div>

      <button
        type="button"
        className="mb-6 border border-teal-500 text-teal-600 px-4 py-2 rounded-md hover:bg-teal-50"
      >
        Upload Image
      </button>

      <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
        <div className="mx-auto w-full max-w-md">
          {/* Heading */}
          <div className="flex flex-col gap-1 mb-2">
            <label className="text-sm font-medium text-gray-700">
              Heading *
            </label>
            <input
              name="heading"
              value={formData.heading}
              onChange={handleChange}
              type="text"
              placeholder="Write Heading"
              className="border border-gray-300 rounded-md px-3 py-2"
            />
          </div>

          {/* Sub-Heading */}
          <div className="flex flex-col gap-1 mb-2">
            <label className="text-sm font-medium text-gray-700">
              Sub-Heading *
            </label>
            <input
              name="subHeading"
              value={formData.subHeading}
              onChange={handleChange}
              type="text"
              placeholder="Write Sub-Heading"
              className="border border-gray-300 rounded-md px-3 py-2"
            />
          </div>

          {/* Type */}
          <div className="flex flex-col gap-1 mb-2">
            <label className="text-sm font-medium text-gray-700">Type</label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-700"
            >
              <option value="">Select Type</option>
              <option value="promo">Promo</option>
              <option value="update">Update</option>
            </select>
          </div>

          {/* Description */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              placeholder="Enter Description"
              className="border border-gray-300 rounded-md px-3 py-2"
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end mt-6">
        <button
          onClick={handleSubmit}
          className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-2 rounded-md"
        >
          {selectedItem ? "Update" : "Create"}
        </button>
      </div>
    </>
  );
};

export default BannerForm;
