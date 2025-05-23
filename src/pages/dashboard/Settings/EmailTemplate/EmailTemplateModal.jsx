import React, { useState } from "react";
import { X } from "lucide-react";

const EmailTemplateModal = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    emailName: "",
    emailType: "",
    emailSubject: "",
    emailBody: "",
  });

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onClose(); // Optional: close modal after saving
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 z-50 flex items-center justify-center">
      <div className="relative bg-white max-w-screen-md w-full max-h-[90vh] overflow-y-auto p-8 rounded-2xl shadow-lg">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <X size={20} />
        </button>

        <h2 className="text-pink-600 font-semibold text-sm mb-4">
          Prints Add Template
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-gray-700 text-sm mb-1">
              Email Name:
            </label>
            <input
              type="text"
              name="emailName"
              value={formData.emailName}
              onChange={handleChange}
              placeholder="Enter title"
              className="w-full border border-gray-300 rounded-md px-3 py-2"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-700 text-sm mb-1">
                Email Type:
              </label>
              <input
                type="text"
                name="emailType"
                value={formData.emailType}
                onChange={handleChange}
                placeholder="Email Type"
                className="w-full border border-gray-300 rounded-md px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-gray-700 text-sm mb-1">
                Email Subject:
              </label>
              <input
                type="text"
                name="emailSubject"
                value={formData.emailSubject}
                onChange={handleChange}
                placeholder="Email Subject"
                className="w-full border border-gray-300 rounded-md px-3 py-2"
              />
            </div>
          </div>

          <div>
            <label className="block text-gray-700 text-sm mb-1">
              Email Body:
            </label>
            <textarea
              name="emailBody"
              value={formData.emailBody}
              onChange={handleChange}
              rows={6}
              placeholder="Enter title"
              className="w-full border border-gray-300 rounded-md px-3 py-2"
            ></textarea>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-teal-600 text-white px-6 py-2 rounded-md hover:bg-teal-700"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EmailTemplateModal;
