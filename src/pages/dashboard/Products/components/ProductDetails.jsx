import React, { useEffect, useState } from "react";
import Editor from "@/components/common/Editor.jsx";

const ProductDetails = ({
  details,
  setDetails,
  handleSpecificationsChange,
}) => {
  // Handle details change for description and refund policy
  const handleDetailsChange = (value, name) => {
    setDetails((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle specifications directly as a string
  const handleSpecsChange = (value) => {
    // Update details state directly
    setDetails((prev) => ({
      ...prev,
      specifications: value || "",
    }));

    // Call the parent handler if provided
    if (handleSpecificationsChange) {
      handleSpecificationsChange(value);
    }
  };

  return (
    <div className="p-6 bg-white shadow-md rounded-lg border border-gray-200">
      <h2 className="text-lg font-bold text-pinkclr mb-4 border-b pb-2">
        Product Details
      </h2>

      <div>
        <Editor
          name="description"
          value={details.description || ""}
          placeholder="Enter Description..."
          label="Description"
          onChange={handleDetailsChange}
        />

        <Editor
          name="specifications"
          value={details.specifications || ""}
          placeholder="Enter specifications..."
          label="Specifications"
          onChange={handleSpecsChange}
        />

        <Editor
          name="refund_policy"
          value={details.refund_policy || ""}
          placeholder="Enter Refund Policy..."
          label="Refund Policy"
          onChange={handleDetailsChange}
        />
      </div>
    </div>
  );
};

export default ProductDetails;
