import React, { useState, useRef } from "react";

const IconUpload = ({ icon, setIcon }) => {
  const [currentImage, setCurrentImage] = useState(
    icon ? URL.createObjectURL(icon) : null,
  );
  const fileInputRef = useRef(null);

  const handleIconUpload = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setIcon(file);
      setCurrentImage(URL.createObjectURL(file));
    }
  };

  const handleRemoveImage = () => {
    setIcon(null);
    setCurrentImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = ""; // Reset file input
    }
  };

  return (
    <div className="text-center mb-4">
      <label className="block text-sm font-medium text-[#2B3674] mb-2">
        Set Icon
      </label>
      <div className="mb-2 relative">
        {!currentImage ? (
          <div className="w-24 h-24 mx-auto border border-gray-300 flex items-center justify-center">
            <span className="text-gray-400 text-xs">No image</span>
          </div>
        ) : (
          <div className="relative w-24 h-24 mx-auto">
            <img
              src={currentImage}
              alt="Icon preview"
              className="w-24 h-24 object-cover rounded-full"
            />
            <button
              type="button"
              onClick={handleRemoveImage}
              className="absolute top-0 right-0 -mt-2 -mr-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600"
              title="Remove image"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        )}
      </div>
      <input
        type="file"
        accept="image/*"
        onChange={handleIconUpload}
        className="hidden"
        id="icon-upload"
        ref={fileInputRef}
      />
      <button
        type="button"
        onClick={() => document.getElementById("icon-upload").click()}
        className="px-4 py-1.5 border border-teal-500 text-teal-500 rounded-md font-bold text-sm"
      >
        Upload Icon
      </button>
    </div>
  );
};

export default IconUpload;
