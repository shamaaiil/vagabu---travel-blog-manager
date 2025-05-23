import React from "react";

const CustomSelect = ({
  name,
  label,
  options = [],
  value,
  onChange,
  placeholder = "Select an option",
  id = "custom-select",
  className = "",
  customLabel = "",
  required = false,
}) => {
  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label htmlFor={id} className={`block mb-1 font-medium ${customLabel}`}>
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <select
        name={name}
        id={id}
        value={value}
        onChange={onChange}
        className="w-full border border-gray-300 rounded-md px-3 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="" disabled>
          {placeholder}
        </option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label ?? option.value}
          </option>
        ))}
      </select>
    </div>
  );
};

export default CustomSelect;
