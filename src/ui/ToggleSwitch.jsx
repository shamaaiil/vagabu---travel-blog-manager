// components/ToggleSwitch.jsx
import React from "react";

const ToggleSwitch = ({ label, checked, onChange, id = "toggle-status" }) => {
  return (
    <div className="flex items-center gap-3">
      {label && (
        <label htmlFor={id} className="font-medium text-gray-700">
          {label}
        </label>
      )}
      <button
        id={id}
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 ${
          checked ? "bg-blue-500" : "bg-gray-300"
        }`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-300 ${
            checked ? "translate-x-6" : "translate-x-1"
          }`}
        />
      </button>
    </div>
  );
};

export default ToggleSwitch;
