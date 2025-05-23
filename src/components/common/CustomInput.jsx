import React from "react";

const CustomInput = ({
  type = "",
  name,
  value,
  onChange,
  label,
  required = false,
  placeholder = "",
  disabled = false,
}) => {
  return (
    <div className="mb-4">
      <label className="block font-semibold text-[#2B3674] mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        type={type}
        name={name}
        value={value || ""}
        onChange={onChange}
        disabled={disabled}
        required={required}
        placeholder={placeholder || `Enter ${label.toLowerCase()}`}
        className="w-full border border-gray-300 rounded-md px-3 py-3 text-sm"
      />
    </div>
  );
};

export default CustomInput;
