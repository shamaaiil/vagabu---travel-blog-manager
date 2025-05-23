import React from "react";

const DeleteModal = ({
  open,
  onClose,
  onDelete,
  title = "Confirm Delete",
  message,
}) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg max-w-xl w-full mx-4 overflow-hidden">
        <div className="p-6">
          <h2 className="text-xl font-semibold text-gray-800 text-center mb-6">
            {title}
          </h2>

          <div className="text-center mb-6">
            <p className="text-gray-700">
              {message || "You are about to delete this entry."}
            </p>
            <p className="text-gray-700 mt-2">Do you want to proceed?</p>
          </div>

          <div className="flex justify-center space-x-4">
            <button
              onClick={onDelete}
              className="bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-8 rounded-xl"
            >
              Delete
            </button>

            <button
              onClick={onClose}
              className="text-[#2B3674] font-medium py-2 px-8"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteModal;
