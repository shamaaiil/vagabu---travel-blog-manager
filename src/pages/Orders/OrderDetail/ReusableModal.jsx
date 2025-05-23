import React from "react";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/solid";

const ReusableModal = ({
  isOpen,
  onClose,
  cancelTitle,
  title,
  fields = [],
  values = {},
  onChange = () => { },
  onSubmit = () => { },
  tableData = [],
  showTable = false,
  tableTitle = "Tracking Detail",
  tableActions = false,
  onEdit = () => { },
  onDelete = () => { },
  icon = null,
  buttons = [],
  fieldsWrapperClassName = ""
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center w-full justify-center bg-black bg-opacity-40 p-4">
      <div className="bg-white rounded-xl p-4 sm:p-6 w-full max-w-3xl shadow-lg max-h-[90vh] overflow-y-auto">
        {icon && (
          <div className="flex justify-center mb-4">
            {icon}
          </div>
        )}

        <div className="text-center border-b border-gray-300">
          <h2 className="text-center mb-4 text-pinkclr border-gray-300 font-bold text-lg sm:text-xl">{title}</h2>
          {cancelTitle && <h2 className="text-[#1C2A53] text-sm sm:text-base pb-2">{cancelTitle}</h2>}
        </div>

        {/* Form Fields */}
        {fields.length > 0 && (
          <div className={fieldsWrapperClassName || "grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 mt-4 sm:mt-6 mb-4 "}>
            {fields.map((field) => (
              <div key={field.name} className="w-full px-4">
                <label className="text-base sm:text-xl font-medium text-[#1C2A53] block mb-1">
                  {field.label}
                </label>

                {field.customRender ? (
                  field.customRender
                ) : field.type === "textarea" ? (
                  <textarea
                    rows="3"
                    name={field.name}
                    value={values[field.name] || ""}
                    onChange={(e) => onChange(field.name, e.target.value)}
                    placeholder={field.placeholder || ""}
                    className={field.className || "w-full mt-1 p-2 border rounded-md text-sm sm:text-base"}
                  />
                ) : field.type === "select" ? (
                  <select
                    name={field.name}
                    value={values[field.name] || ""}
                    onChange={(e) => onChange(field.name, e.target.value)}
                    className={field.className || "w-full mt-1 p-2 border rounded-md text-sm sm:text-base"}
                  >
                    <option value="">Select {field.label}</option>
                    {field.options?.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    type={field.type || "text"}
                    name={field.name}
                    value={values[field.name] || ""}
                    onChange={(e) => onChange(field.name, e.target.value)}
                    placeholder={field.placeholder || ""}
                    className={field.className || "w-full mt-1 p-2 border rounded-md text-sm sm:text-base"}
                  />
                )}
              </div>
            ))}

          </div>
        )}

        {onSubmit && buttons.length === 0 && (
          <div className="flex justify-center mt-2">
            <button
              onClick={onSubmit}
              className="bg-teelclr text-white px-6 sm:px-8 font-semibold py-2 rounded-xl hover:bg-teal-700 text-sm sm:text-base"
            >
              Add
            </button>
          </div>
        )}

        {/* Table */}
        {showTable && (
          <>
            <h3 className="text-base sm:text-lg font-semibold text-center text-[#1A1F6B] mt-6 sm:mt-8 mb-2 sm:mb-3">{tableTitle}</h3>
            <div className="overflow-x-auto -mx-4 sm:mx-0">
              <div className="inline-block min-w-full align-middle">
                <table className="min-w-full bg-white border rounded-lg text-xs sm:text-sm">
                  <thead className="bg-gray-100 text-gray-700">
                    <tr>
                      <th className="px-2 sm:px-4 py-2 text-left">Title</th>
                      <th className="px-2 sm:px-4 py-2 text-left">Detail</th>
                      <th className="px-2 sm:px-4 py-2 text-left">Date</th>
                      <th className="px-2 sm:px-4 py-2 text-left">Time</th>
                      {tableActions && <th className="px-2 sm:px-4 py-2 text-center">Actions</th>}
                    </tr>
                  </thead>
                  <tbody>
                    {tableData.length > 0 ? (
                      tableData.map((item) => (
                        <tr key={item.id} className="border-t">
                          <td className="px-2 sm:px-4 py-2">{item.title}</td>
                          <td className="px-2 sm:px-4 py-2">{item.detail}</td>
                          <td className="px-2 sm:px-4 py-2">{item.date}</td>
                          <td className="px-2 sm:px-4 py-2">{item.time}</td>
                          {tableActions && (
                            <td className="px-2 sm:px-4 py-2 flex justify-center gap-2 sm:gap-3">
                              <PencilIcon
                                onClick={() => onEdit(item)}
                                className="h-4 w-4 sm:h-5 sm:w-5 text-pinkclr cursor-pointer"
                              />
                              <TrashIcon
                                onClick={() => onDelete(item)}
                                className="h-4 w-4 sm:h-5 sm:w-5 text-pinkclr cursor-pointer"
                              />
                            </td>
                          )}
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={tableActions ? 5 : 4} className="px-4 py-4 text-center text-gray-500">
                          No tracking data available
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {/* Footer Buttons */}
        <div className="flex justify-end gap-3 sm:gap-4 mt-4 sm:mt-6">
          {buttons.map((btn, idx) => (
            <button
              key={idx}
              onClick={btn.onClick}
              className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl shadow-md font-semibold text-sm sm:text-base ${btn.variant === "cancel"
                  ? "bg-red-500 text-white hover:bg-red-600"
                  : "bg-teelclr text-white hover:bg-teal-700"
                }`}
            >
              {btn.label}
            </button>
          ))}

          {buttons.length === 0 && (
            <button
              onClick={onClose}
              className="bg-teelclr text-white px-4 sm:px-6 py-1.5 sm:py-2 rounded-md hover:bg-teal-700 text-sm sm:text-base"
            >
              Close
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReusableModal;