import CustomInput from "@/components/common/CustomInput";
import InputField from "@/ui/InputFields";
import React from "react";

const ToggleSwitch = ({ isEnabled, onChange, label }) => {
  return (
    <div className="flex items-center justify-between">
      <span className="text-[#1F2B6C] font-semibold">{label}</span>
      <label className="relative inline-flex items-center cursor-pointer">
        <input
          type="checkbox"
          checked={isEnabled}
          onChange={onChange}
          className="sr-only peer"
        />
        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-pinkclr"></div>
      </label>
    </div>
  );
};

const Pricing = ({ pricing, setPricing }) => {
  console.log(pricing, " from the pricing");
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "discountAmount") {
      setPricing({
        ...pricing,
        [name]: value === "" ? "0" : value,
      });
    } else {
      setPricing({ ...pricing, [name]: value });
    }
  };

  const handleWholesaleToggle = () => {
    setPricing({
      ...pricing,
      allowWholesale: !pricing.allowWholesale,
      allow_wholesale: pricing.allowWholesale ? 0 : 1,
      wholesaleFields: pricing.wholesaleFields?.length
        ? pricing.wholesaleFields
        : [{ quantity: "", price: "" }],
    });
  };

  const handleWholesaleChange = (index, field, value) => {
    const updatedFields = pricing.wholesaleFields.map((item, i) =>
      i === index ? { ...item, [field]: value } : item,
    );

    setPricing({
      ...pricing,
      wholesaleFields: updatedFields,
      wholesale_price: field === "price" ? value : pricing.wholesale_price,
      wholesale_quantity:
        field === "quantity" ? value : pricing.wholesale_quantity,
      [`wholesale_fields[${index}][${field}]`]: value,
    });
  };

  const addWholesaleField = () => {
    setPricing({
      ...pricing,
      wholesaleFields: [
        ...pricing.wholesaleFields,
        { quantity: "", price: "" },
      ],
    });
  };

  const removeWholesaleField = (index) => {
    const updatedFields = [...pricing.wholesaleFields];

    updatedFields.splice(index, 1);

    if (updatedFields.length === 0) {
      setPricing({
        ...pricing,
        wholesaleFields: [],
        allow_wholesale: 0,
        allowWholesale: false,
      });
      return;
    }

    setPricing({
      ...pricing,
      wholesaleFields: updatedFields,
      wholesale_quantity: updatedFields[0]?.quantity || "",
      wholesale_price: updatedFields[0]?.price || "",
    });

    const apiUpdatedFields = {};
    updatedFields.forEach((field, idx) => {
      apiUpdatedFields[`wholesale_fields[${idx}][quantity]`] = field.quantity;
      apiUpdatedFields[`wholesale_fields[${idx}][price]`] = field.price;
    });
  };

  return (
    <div className="mt-6 p-6 border border-gray-300 rounded-xl shadow-md bg-white">
      <h2 className="text-xl font-bold text-pinkclr mb-4 border-b-2 border-gray-300 pb-2">
        PRICING
      </h2>

      <div className="grid grid-cols-2 gap-6">
        <div>
          <CustomInput
            label={"Default Retail Price"}
            type={"number"}
            name="retailPrice"
            value={pricing.retailPrice}
            onChange={handleChange}
            placeholder="e.g 20"
            required
          />
        </div>
        <div>
          <CustomInput
            label={"Discount Amount"}
            type={"number"}
            name={"discountAmount"}
            value={pricing.discountAmount || "0"}
            onChange={handleChange}
            placeholder="e.g 10"
            required
          />
        </div>
      </div>

      <div className="mt-6">
        <ToggleSwitch
          isEnabled={pricing.allowWholesale}
          onChange={handleWholesaleToggle}
          label="Enable Wholesale Pricing"
        />
      </div>

      {pricing.allowWholesale && (
        <div className="mt-6">
          <h3 className="text-[#1F2B6C] font-semibold mb-4">
            Wholesale Pricing
          </h3>
          <div className="grid grid-cols-2 gap-6 mb-2">
            <label className="text-[#1F2B6C] font-semibold">Quantity</label>
            <label className="text-[#1F2B6C] font-semibold">Price</label>
          </div>

          {pricing.wholesaleFields?.map((field, index) => (
            <div key={index} className="flex items-center gap-4 mt-2">
              <InputField
                type="number"
                placeholder="Enter Quantity"
                value={pricing.wholesale_quantity}
                onChange={(e) =>
                  handleWholesaleChange(index, "quantity", e.target.value)
                }
                className="border border-gray-300 p-3 rounded-md w-full text-sm focus:outline-none"
                required
              />
              <InputField
                type="number"
                placeholder="Enter Price"
                value={pricing.wholesale_price}
                onChange={(e) =>
                  handleWholesaleChange(index, "price", e.target.value)
                }
                className="border border-gray-300 p-3 rounded-md w-full text-sm focus:outline-none"
                required
              />
              <button
                onClick={() => removeWholesaleField(index)}
                className="p-2 text-red-500 hover:text-red-700 focus:outline-none"
                type="button"
                aria-label="Remove wholesale tier"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>
          ))}

          <button
            onClick={addWholesaleField}
            className="mt-4 px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 text-sm"
            type="button"
          >
            Add Another Tier
          </button>
        </div>
      )}
    </div>
  );
};

export default Pricing;
