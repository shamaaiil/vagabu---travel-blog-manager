import React, { useState, useEffect } from "react";
import CustomInput from "@/components/common/CustomInput";
import Editor from "@/components/common/Editor";
import TagInput from "@/components/common/TagInput";
import IconUpload from "@/components/common/IconUpload"; // Import the IconUpload component

const DynamicCategoryModal = ({
  title = "Add New Category",
  fields = [],
  onSubmit,
  onClose,
  submitButtonText = "Create",
  initialData = null,
}) => {
  const getInitialFormData = () => {
    const base = fields.reduce((acc, field) => {
      acc[field.name] = field.defaultValue ?? "";
      return acc;
    }, {});
    return initialData
      ? { ...base, ...initialData }
      : { ...base, status: "Active" };
  };

  const [formData, setFormData] = useState(getInitialFormData());
  const [metaTags, setMetaTags] = useState([]);
  const [featuredCategory, setFeaturedCategory] = useState(
    initialData?.featuredCategory || false,
  );
  const [icon, setIcon] = useState(initialData?.icon || null);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData?.metaTags) {
      const tagsArray = initialData.metaTags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean);
      setMetaTags(tagsArray);
    }
  }, [initialData]);

  useEffect(() => {
    if (initialData) {
      setFormData((prev) => ({ ...prev, ...initialData }));
      if ("featuredCategory" in initialData)
        setFeaturedCategory(initialData.featuredCategory);
    }
  }, [initialData]);

  useEffect(() => {
    const updated = { ...formData };
    fields.forEach((field) => {
      if (
        field.defaultValue !== undefined &&
        formData[field.name] === undefined
      ) {
        updated[field.name] = field.defaultValue;
      }
    });
    setFormData(updated);
  }, [fields]);

  const handleChange = (e, customName) => {
    const name = customName || e?.target?.name;
    const value = customName
      ? e
      : e?.target?.type === "checkbox"
        ? e.target.checked
        : e?.target?.value;
    if (!name) return;

    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: null }));

    const field = fields.find((f) => f.name === name);
    if (field?.onChange) field.onChange(value);

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    const newErrors = {};
    fields.forEach((field) => {
      if (field.required && !formData[field.name])
        newErrors[field.name] = `${field.label} is required`;
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    const isValid = validateForm();
    if (!isValid) return;

    const payload = {
      ...formData,
      metaTags: metaTags.join(", "),
      featuredCategory,
      icon: icon || formData.icon,
    };
    onSubmit(payload);
  };

  const getField = (name) => fields.find((f) => f.name === name);

  const renderInput = (field) => {
    if (!field) return null;
    if (field.name === "metaTags") {
      return (
        <div className="mb-4">
          <label className="block text-sm font-medium text-[#2B3674] mb-1">
            {field.label}{" "}
            {field.required && <span className="text-red-500">*</span>}
          </label>
          <TagInput tags={metaTags} setTags={setMetaTags} />
          {errors[field.name] && (
            <p className="text-red-500 text-xs mt-1">{errors[field.name]}</p>
          )}
        </div>
      );
    }
    return (
      <CustomInput
        name={field.name}
        label={field.label}
        required={field.required}
        disabled={field.disabled}
        value={formData[field.name]}
        onChange={handleChange}
      />
    );
  };

  const renderTextareaField = (field) =>
    field && (
      <div className="mb-4">
        <Editor
          name={field.name}
          value={formData[field.name] || ""}
          placeholder={
            field.placeholder || `Enter ${field.label.toLowerCase()}`
          }
          label={field.label}
          onChange={handleChange}
        />
        {errors[field.name] && (
          <p className="text-red-500 text-xs mt-1">{errors[field.name]}</p>
        )}
      </div>
    );

  const renderSelectField = (field) =>
    field &&
    field.options && (
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {field.label}{" "}
          {field.required && <span className="text-red-500">*</span>}
        </label>
        <select
          name={field.name}
          value={formData[field.name] || ""}
          onChange={handleChange}
          className={`w-full border ${errors[field.name] ? "border-red-500" : "border-gray-300"} rounded-md px-3 py-2 text-sm`}
          disabled={field.disabled}
        >
          <option value="">Select {field.label}</option>
          {field.options.map((option, idx) => {
            const value = option?.value ?? option?.id ?? option;
            const label = option?.label ?? option?.name ?? option;
            return (
              <option key={`${field.name}-opt-${idx}`} value={value}>
                {label}
              </option>
            );
          })}
        </select>
        {errors[field.name] && (
          <p className="text-red-500 text-xs mt-1">{errors[field.name]}</p>
        )}
      </div>
    );

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center z-50">
      <div className="relative bg-white rounded-xl shadow-lg w-full max-w-2xl mx-4">
        <div className="p-4 border-b-2">
          <h2 className="text-lg font-medium text-pinkclr">{title}</h2>
        </div>

        <div className="p-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {fields.map((field) => {
              if (field.type === "select") return renderSelectField(field);
              if (field.type === "textarea" || field.type === "file")
                return null;
              return renderInput(field);
            })}
          </div>

          {fields.filter((f) => f.type === "textarea").map(renderTextareaField)}
          {fields.some((f) => f.name === "icon") && (
            <IconUpload icon={icon} setIcon={setIcon} />
          )}
        </div>

        <div className="p-4 border-t bg-gray-50 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-white border border-gray-300 text-gray-700 rounded-md text-sm mr-2 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-6 py-1.5 bg-teal-500 text-white rounded-md text-sm hover:bg-teal-600"
          >
            {submitButtonText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DynamicCategoryModal;
