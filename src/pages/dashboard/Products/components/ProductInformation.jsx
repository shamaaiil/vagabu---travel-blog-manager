import React, { useState, useEffect } from "react";
import { FaSpinner } from "react-icons/fa";
import { useGetQuery } from "@/services/apiService";
import CustomInput from "@/components/common/CustomInput";
import CustomSelect from "@/components/common/CustomSelect";

const ProductInformation = ({
  productInfo,
  setProductInfo,
  handleLabelsChange,
  categories = [],
  subCategories = [],
  childCategories = [],
  isLoadingCategories = false,
  isLoadingSubCategories = false,
  isLoadingChildCategories = false,
}) => {
  // State for labels from API
  const [availableLabels, setAvailableLabels] = useState([]);
  const [isLoadingLabels, setIsLoadingLabels] = useState(false);
  const [labelInput, setLabelInput] = useState("");

  // Fetch labels from API
  const { data: labelsData, isLoading: isFetchingLabels } = useGetQuery({
    path: '/labels',
  });
  useEffect(() => {
    setIsLoadingLabels(isFetchingLabels);
    if (labelsData?.data) {
      setAvailableLabels(labelsData.data);
    }
  }, [labelsData, isFetchingLabels]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'category_id') {
      setProductInfo((prev) => ({
        ...prev,
        category_id: value,
        subCategory: "",
        childCategory: "",
      }));
    } else if (name === 'subCategory') {
      setProductInfo((prev) => ({
        ...prev,
        subCategory: value,
        childCategory: "",
      }));
    } else if (name === 'productLabels') {
      // Handle single label selection
      const labelId = parseInt(value);
      handleLabelsChange([labelId]);
      setProductInfo((prev) => ({
        ...prev,
        productLabels: [labelId],
      }));
    } else if (name === "labelInput") {
      setLabelInput(value);
    } else {
      setProductInfo((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  // Add a label to the selected labels
  const addLabel = (labelId) => {
    const id = parseInt(labelId);
    if (!productInfo.productLabels.includes(id)) {
      const newLabels = [...productInfo.productLabels, id];
      handleLabelsChange(newLabels);
      setProductInfo((prev) => ({
        ...prev,
        productLabels: newLabels,
      }));
    }
    setLabelInput(""); // Clear the input after adding
  };

  // Remove a label from the selected labels
  const removeLabel = (labelId) => {
    const newLabels = productInfo.productLabels.filter((id) => id !== labelId);
    handleLabelsChange(newLabels);
    setProductInfo((prev) => ({
      ...prev,
      productLabels: newLabels,
    }));
  };

  const getLabelName = (labelId) => {
    const label = availableLabels.find((label) => label.id === labelId);
    return label ? label.label : "";
  };

  return (
    <div className="p-6 border border-gray-300 rounded-xl shadow-md bg-white">
      <h2 className="text-xl font-bold text-pinkclr mb-4 border-b-2 border-gray-300 pb-2">
        PRODUCT INFORMATION
      </h2>
      <div className="grid grid-cols-2 gap-6">
        <div>
          <CustomInput
            label={"Product Name"}
            name={"productName"}
            required={true}
            type="text"
            value={productInfo.productName}
            onChange={handleChange}
          />

          {/* <label className="text-[#1F2B6C] font-semibold">Product Name*</label>
          <input
            type="text"
            name="productName"
            value={productInfo.productName}
            onChange={handleChange}
            placeholder="Enter Product Name"
            className="border p-3 rounded-md w-full bg-white"
          /> */}
        </div>
        <div>
          <CustomInput
            label={"Listing Type"}
            type="text"
            value={"Prints"}
            disabled
            className="border p-3 rounded-md w-full bg-gray-100"
          />
          {/* <label className="text-[#1F2B6C] font-semibold">Listing Type</label>
          <input
            type="text"
            value="Prints"
            disabled
            className="border p-3 rounded-md w-full bg-gray-100"
          /> */}
        </div>
        <div className="col-span-2">
          <label className="text-[#1F2B6C] font-semibold">Product Labels</label>

          {/* Display selected labels as tags */}
          <div className="flex flex-wrap gap-2 mb-2">
            {Array.isArray(productInfo.productLabels) &&
              productInfo.productLabels.map((labelId) => (
                <div
                  key={labelId}
                  className="flex items-center bg-blue-500 text-white px-3 py-1 rounded-md"
                >
                  {getLabelName(labelId)}
                  <button
                    type="button"
                    onClick={() => removeLabel(labelId)}
                    className="ml-2 text-white font-bold"
                  >
                    ×
                  </button>
                </div>
              ))}
          </div>

          <div className="relative">
            <select
              name="labelInput"
              onClick={() => {
                if (labelInput) {
                  addLabel(labelInput);
                }
              }}
              value={labelInput}
              onChange={handleChange}
              onBlur={(e) => {
                if (e.target.value) {
                  addLabel(e.target.value);
                }
              }}
              className="border p-3 rounded-md w-full bg-white appearance-none"
              disabled={isLoadingLabels}
            >
              <option value="">Select Label</option>
              {availableLabels.map((label) => (
                <option key={label.id} value={label.id}>
                  {label.label}
                </option>
              ))}
            </select>
            {/* <button
              type="button"
              onClick={() => {
                if (labelInput) {
                  addLabel(labelInput);
                }
              }}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 px-2 text-blue-500"
              disabled={!labelInput}
            >
              Add
            </button> */}
            {isLoadingLabels && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <FaSpinner className="animate-spin text-pinkclr" />
              </div>
            )}
          </div>
        </div>
        <div className="grid grid-cols-3 gap-6 col-span-2 mt-4">
          <div>
            <div className="relative">
              <CustomSelect
                label={"Category"}
                required={true}
                name={"category_id"}
                value={productInfo.category_id}
                onChange={handleChange}
                options={categories.map((category) => ({
                  value: category.id,
                  label: category.name,
                }))}
                placeholder="Select Category"
                customLabel="text-[#1F2B6C] font-semibold"
              />
              {/* <select
                name="category_id"
                value={productInfo.category_id}
                onChange={handleChange}
                className="border p-3 rounded-md w-full bg-white appearance-none"
                disabled={isLoadingCategories}
              >
                <option value="">Select Category</option>
                {Array.isArray(categories) ? (
                  categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))
                ) : (
                  <option value="">No categories available</option>
                )}
              </select> */}
              {isLoadingCategories && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <FaSpinner className="animate-spin text-pinkclr" />
                </div>
              )}
            </div>
          </div>
          <div>
            {/* <label className="text-[#1F2B6C] font-semibold">Sub Category</label> */}
            <div className="relative">
              <CustomSelect
                label={"Sub Category"}
                name={"subCategory"}
                value={productInfo.subCategory}
                onChange={handleChange}
                disabled={!productInfo.category_id}
                options={subCategories.map((subCategory) => ({
                  value: subCategory.id,
                  label: subCategory.name,
                }))}
                placeholder="Select Sub Category"
                customLabel="text-[#1F2B6C] font-semibold"
              />
              {/* <select
                name="subCategory"
                value={productInfo.subCategory}
                onChange={handleChange}
                className="border p-3 rounded-md w-full bg-white appearance-none"
                disabled={!productInfo.category_id || isLoadingSubCategories}
              >
                <option value="">Select Sub Category</option>
                {subCategories.map((subCategory) => (
                  <option key={subCategory.id} value={subCategory.id}>
                    {subCategory.name}
                  </option>
                ))}
              </select> */}
              {isLoadingSubCategories && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <FaSpinner className="animate-spin text-pinkclr" />
                </div>
              )}
            </div>
            {!productInfo.category_id && (
              <p className="text-sm text-gray-500 mt-1">
                Please select a category first
              </p>
            )}
          </div>
          <div>
            {/* <label className="text-[#1F2B6C] font-semibold">
              Child Category
            </label> */}
            <div className="relative">
              <CustomSelect
                label={"Child Category"}
                name={"childCategory"}
                value={productInfo.childCategory}
                onChange={handleChange}
                disabled={!productInfo.subCategory_id}
                options={childCategories.map((childCategory) => ({
                  value: childCategory.id,
                  label: childCategory.name,
                }))}
                placeholder="Select Child Category"
                customLabel="text-[#1F2B6C] font-semibold"
              />
              {/* <select
                name="childCategory"
                value={productInfo.childCategory}
                onChange={handleChange}
                className="border p-3 rounded-md w-full bg-white appearance-none"
                disabled={!productInfo.subCategory || isLoadingChildCategories}
              >
                <option value="">Select Child Category</option>
                {childCategories.map((childCategory) => (
                  <option key={childCategory.id} value={childCategory.id}>
                    {childCategory.name}
                  </option>
                ))}
              </select> */}
              {isLoadingChildCategories && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <FaSpinner className="animate-spin text-pinkclr" />
                </div>
              )}
            </div>
            {!productInfo.subCategory && (
              <p className="text-sm text-gray-500 mt-1">
                Please select a sub category first
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductInformation;