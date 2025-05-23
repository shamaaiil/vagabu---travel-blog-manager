import React, { useEffect } from "react";
import CustomSelect from "@/components/common/CustomSelect";
import CustomInput from "@/components/common/CustomInput";

const ShippingOptions = ({
  freeShipping,
  setFreeShipping,
  deliveryTime,
  setDeliveryTime,
  shippingVariant,
  setShippingVariant,
  shippingCost,
  setShippingCost,
  shippingLocation,
  setShippingLocation,
}) => {
  const toggleFreeShipping = () => {
    const isNowFree = freeShipping === 1 || freeShipping === true ? 0 : 1;
    setFreeShipping(isNowFree);
    if (isNowFree === 1) {
      setShippingCost("0");
    }
  };

  useEffect(() => {
    if (freeShipping === undefined || freeShipping === null) {
      setFreeShipping(0);
    }
    if (freeShipping === true) setFreeShipping(1);
    if (freeShipping === false) setFreeShipping(0);

    if (!deliveryTime) setDeliveryTime("3-5 Days");
    if (!shippingVariant) setShippingVariant("Whole order");
    if (!shippingCost && freeShipping !== 1 && freeShipping !== true)
      setShippingCost("0");
    if (!shippingLocation) setShippingLocation("Worldwide");
  }, []);

  const isCurrentlyFree = freeShipping === 1 || freeShipping === true;

  return (
    <div className="p-6 bg-white shadow-md rounded-lg border border-gray-200">
      <h2 className="text-lg font-bold text-pinkclr mb-4 border-b pb-2">
        SHIPPING
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="flex items-center">
          <label className="text-[#1F2B6C] font-semibold mr-4">
            Free Shipping <span className="text-red-500">*</span>
          </label>
          <div
            onClick={toggleFreeShipping}
            className={`relative w-14 h-7 rounded-full cursor-pointer transition-all duration-300 flex items-center ${
              isCurrentlyFree ? "bg-teelclr" : "bg-gray-400"
            }`}
          >
            <span
              className={`absolute left-1 w-5 h-5 bg-white rounded-full transition-transform duration-300 ${
                isCurrentlyFree ? "translate-x-7" : "translate-x-0"
              }`}
            ></span>
          </div>
          <span className="ml-3 text-sm text-gray-500">
            {isCurrentlyFree ? "Free" : "Not Free"} (Value: {freeShipping})
          </span>
        </div>

        {/* Replace Delivery Time select with CustomSelect */}
        <CustomSelect
          label="Delivery Time"
          value={deliveryTime || ""}
          onChange={(e) => setDeliveryTime(e.target.value)}
          required={true}
          options={[
            { value: "Next Day", label: "Next Day" },
            { value: "2-3 Days", label: "2-3 Days" },
            { value: "3-5 Days", label: "3-5 Days" },
            { value: "5-7 Days", label: "5-7 Days" },
          ]}
          placeholder="Select Delivery Time"
          customLabel="text-[#1F2B6C] font-semibold"
        />

        {/* Replace Shipping Variant select with CustomSelect */}
        <CustomSelect
          label="Shipping Variant"
          value={shippingVariant || ""}
          onChange={(e) => setShippingVariant(e.target.value)}
          required={true}
          options={[
            { value: "Whole order", label: "Whole order" },
            { value: "Per item", label: "Per item" },
          ]}
          placeholder="Select Variant"
          customLabel="text-[#1F2B6C] font-semibold"
        />

        {/* Replace Shipping Cost input with CustomInput */}
        <CustomInput
          type={"number"}
          name="shippingCost"
          label="Shipping Cost"
          value={isCurrentlyFree ? "0" : shippingCost || ""}
          onChange={(e) => setShippingCost(e.target.value)}
          disabled={isCurrentlyFree}
          required={true}
          placeholder="Enter shipping cost"
        />

        {/* Replace Shipping Location input with CustomInput */}
        <CustomInput
          name="shippingLocation"
          label="Shipping Location"
          value={shippingLocation || ""}
          onChange={(e) => setShippingLocation(e.target.value)}
          required={true}
          placeholder="Enter Shipping Location"
        />
      </div>
    </div>
  );
};

export default ShippingOptions;
