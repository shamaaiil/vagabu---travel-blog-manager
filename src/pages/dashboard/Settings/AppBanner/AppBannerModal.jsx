import React from "react";
import BannerForm from "./BannerForm";
import { X } from "lucide-react";

const AddBannerModal = ({ isOpen, onClose, selectedItem }) => {
  if (!isOpen) return null;

  const isEditMode = !!selectedItem;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 z-50 flex items-center justify-center">
      <div className="relative bg-white max-w-screen-md w-full max-h-[90vh] overflow-y-auto p-8 rounded-2xl shadow-lg">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <X size={20} />
        </button>

        <h2 className="text-pink-600 text-base font-semibold mb-6">
          {isEditMode ? "Edit App Banner" : "Add App Banner"}
        </h2>

        <BannerForm onClose={onClose} selectedItem={selectedItem} />
      </div>
    </div>
  );
};

export default AddBannerModal;
