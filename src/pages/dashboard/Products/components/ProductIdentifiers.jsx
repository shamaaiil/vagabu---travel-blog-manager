import CustomInput from "@/components/common/CustomInput";
import React from "react";

const ProductIdentifiers = ({ productIdentifiers, setProductIdentifiers }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProductIdentifiers({ ...productIdentifiers, [name]: value });
  };

  return (
    <div className="mt-6 p-6 border border-gray-300 rounded-xl shadow-md bg-white">
      <h2 className="text-xl font-bold text-pinkclr mb-4 border-b-2 border-gray-300 pb-2">
        PRODUCT IDENTIFIERS
      </h2>
      {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label className="text-[#1F2B6C] font-semibold mb-2 block">
            Product SKU<span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="sku"
            value={productIdentifiers.sku || ""}
            onChange={handleChange}
            placeholder="Enter SKU"
            className="border border-gray-300 p-3 rounded-md w-full bg-white text-sm focus:outline-none"
          />
        </div>
        <div>
          <label className="text-[#1F2B6C] font-semibold mb-2 block">
            Manufacturer<span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="manufacturer"
            value={productIdentifiers.manufacturer || ""}
            onChange={handleChange}
            placeholder="Enter a Brand"
            className="border border-gray-300 p-3 rounded-md w-full bg-white text-sm focus:outline-none"
          />
        </div>
        <div>
          <label className="text-[#1F2B6C] font-semibold mb-2 block">
            Model<span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="model"
            value={productIdentifiers.model || ""}
            onChange={handleChange}
            placeholder="Enter a Model"
            className="border border-gray-300 p-3 rounded-md w-full bg-white text-sm focus:outline-none"
          />
        </div>
      </div> */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <CustomInput
            label={"Product SKU"}
            name="sku"
            value={productIdentifiers.sku || ""}
            onChange={handleChange}
            placeholder="Enter SKU"
            className="border border-gray-300 p-3 rounded-md w-full bg-white text-sm focus:outline-none"
            required={true}
          />
        </div>
        <div>
          <CustomInput
            label={"Manufacturer"}
            name="manufacturer"
            value={productIdentifiers.manufacturer || ""}
            onChange={handleChange}
            placeholder="Enter a Brand"
            className="border border-gray-300 p-3 rounded-md w-full bg-white text-sm focus:outline-none"
            required={true}
          />
        </div>
        <div>
          <CustomInput
            label={"Model"}
            name="model"
            value={productIdentifiers.model || ""}
            onChange={handleChange}
            placeholder="Enter a Model"
            className="border border-gray-300 p-3 rounded-md w-full bg-white text-sm focus:outline-none"
            required={true}
          />
        </div>
      </div>
    </div>
  );
};

export default ProductIdentifiers;