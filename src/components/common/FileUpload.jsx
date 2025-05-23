import React, { useState } from "react";
import IconUpload from "./IconUpload";
import CustomSelect from "./CustomSelect";
import CustomInput from "./CustomInput";

// Custom FileUpload component
const FileUpload = ({
  id,
  label,
  accept,
  multiple = false,
  onFileChange,
  preview,
  onRemove,
  dragType,
  maxSize,
  children,
  buttonText = "Upload Files",
}) => {
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onFileChange({ target: { files: e.dataTransfer.files } });
    }
  };

  return (
    <div>
      <label className="block text-[#1F2B6C] font-semibold mb-2">{label}</label>
      <div
        className={`border ${
          dragActive ? "border-teelclr border-dashed" : "border-gray-300"
        } rounded-md w-full h-40 flex items-center justify-center overflow-hidden relative`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        {preview ? (
          <div className="relative w-full h-full">
            {children}
            <button
              type="button"
              onClick={onRemove}
              className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
            >
              ×
            </button>
          </div>
        ) : (
          <div className="text-center">
            <span className="text-gray-400 text-2xl block">+</span>
            <span className="text-gray-500 text-sm">
              Drag & drop or click to upload
            </span>
          </div>
        )}
      </div>
      <input
        type="file"
        className="hidden"
        id={id}
        accept={accept}
        multiple={multiple}
        onChange={onFileChange}
      />
      <label
        htmlFor={id}
        className="mt-2 block text-center px-3 py-2 bg-teelclr text-white rounded-md cursor-pointer hover:bg-opacity-90 transition-colors text-sm"
      >
        {buttonText}
      </label>
    </div>
  );
};

export default FileUpload;
