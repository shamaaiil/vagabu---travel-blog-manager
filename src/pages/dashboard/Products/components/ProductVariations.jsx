import React, { useState, useEffect } from "react";
import { useGetQuery } from "@/services/apiService";
import { Plus, X } from "lucide-react";

const ProductVariation = ({
  variations = [],
  setVariations,
  setSizeVariations,
  setSpecificAttributes,
  attributes,
  setAttributes,
  sizeVariations = [],
}) => {
  const [sizes, setSizes] = useState([{ name: "", quantity: 1, price: 0 }]);
  const [localAttributes, setLocalAttributes] = useState([
    {
      attributeId: "",
      options: [
        {
          value: "",
          price: 0,
          priceType: "Per Item",
          frontOnly: "",
          bothFrontBack: "",
        },
      ],
    },
  ]);
  const [availableAttributes, setAvailableAttributes] = useState([]);
  const [isAttributeDropdownOpen, setIsAttributeDropdownOpen] = useState(false);
  const [sizeAttributeId, setSizeAttributeId] = useState(null);

  // Remove isDataLoaded state as it's causing the race condition
  // const [isDataLoaded, setIsDataLoaded] = useState(false);

  const { data: attributesData, isLoading: isLoadingAttributes } = useGetQuery({
    path: "/general-attributes",
  });

  useEffect(() => {
    if (attributesData?.data) {
      setAvailableAttributes(attributesData.data);
      const sizeAttribute = attributesData.data.find(
        (attr) => attr.name.toLowerCase() === "size",
      );
      if (sizeAttribute) {
        setSizeAttributeId(sizeAttribute.id);
      } else {
        setSizeAttributeId(1);
      }
    }
  }, [attributesData]);

  // Load existing attributes data - FIXED: Remove isDataLoaded dependency
  useEffect(() => {
    if (attributes && attributes.length > 0 && availableAttributes.length > 0) {
      console.log("Loading existing attributes data:", attributes);

      // Transform attributes from parent to local format
      const transformedAttributes = attributes.map((attr) => ({
        attributeId: attr.attributeId?.toString() || "",
        options: attr.options?.map((opt) => ({
          value: opt.value || "",
          price: opt.price || 0,
          priceType: opt.priceType || "Per Item",
          frontOnly: opt.frontOnly || "",
          bothFrontBack: opt.bothFrontBack || "",
        })) || [
          {
            value: "",
            price: 0,
            priceType: "Per Item",
            frontOnly: "",
            bothFrontBack: "",
          },
        ],
      }));

      // Only update if the data is actually different to prevent infinite loops
      setLocalAttributes((prevLocalAttributes) => {
        const isDifferent =
          JSON.stringify(prevLocalAttributes) !==
          JSON.stringify(transformedAttributes);
        if (isDifferent) {
          return transformedAttributes;
        }
        return prevLocalAttributes;
      });
    }
  }, [attributes, availableAttributes]); // Removed isDataLoaded dependency

  useEffect(() => {
    if (sizeVariations && sizeVariations.length > 0) {
      const formattedSizes = sizeVariations.map((s) => ({
        name: s.size_name || s.name || "",
        quantity: s.size_qty || s.quantity || 1,
        price: s.size_price || s.price || 0,
      }));

      setSizes((prevSizes) => {
        const isDifferent =
          JSON.stringify(prevSizes) !== JSON.stringify(formattedSizes);
        if (isDifferent) {
          console.log("Loaded sizes from sizeVariations:", formattedSizes);
          return formattedSizes;
        }
        return prevSizes;
      });
    }
  }, [sizeVariations]);

  useEffect(() => {
    if (
      variations &&
      variations.length > 0 &&
      sizeAttributeId &&
      (!sizeVariations || sizeVariations.length === 0)
    ) {
      console.log("Loading existing variations data (fallback):", variations);

      const sizeVars = variations.filter(
        (v) =>
          v.attribute === "Size" ||
          v.general_attribute_id === sizeAttributeId ||
          (typeof v.general_attribute_id === "string" &&
            v.general_attribute_id === "size"),
      );

      if (sizeVars.length > 0) {
        const formattedSizes = sizeVars.map((s) => ({
          name: s.value || "",
          quantity: s.quantity || 1,
          price: s.price_adjustment || 0,
        }));

        setSizes((prevSizes) => {
          const isDifferent =
            JSON.stringify(prevSizes) !== JSON.stringify(formattedSizes);
          if (isDifferent) {
            console.log(
              "Loaded sizes from variations (fallback):",
              formattedSizes,
            );
            return formattedSizes;
          }
          return prevSizes;
        });
      }
    }
  }, [variations, sizeAttributeId, sizeVariations]);

  const handleAddMoreSize = (e) => {
    e.preventDefault();
    setSizes([...sizes, { name: "", quantity: 1, price: 0 }]);
  };

  const handleSizeChange = (index, field, value) => {
    const updatedSizes = [...sizes];
    updatedSizes[index][field] = value;
    setSizes(updatedSizes);
    updateParentVariations(updatedSizes, localAttributes);
  };

  const handleRemoveSize = (e, index) => {
    e.preventDefault();
    const updatedSizes = sizes.filter((_, i) => i !== index);
    setSizes(updatedSizes);
    updateParentVariations(updatedSizes, localAttributes);
  };

  const handleAddNewAttribute = (e) => {
    e.preventDefault();
    const newAttributes = [
      ...localAttributes,
      {
        attributeId: "",
        options: [
          {
            value: "",
            price: 0,
            priceType: "Per Item",
            frontOnly: "",
            bothFrontBack: "",
          },
        ],
      },
    ];
    setLocalAttributes(newAttributes);
  };

  const handleAttributeSelect = (index, attributeId) => {
    const updatedAttributes = [...localAttributes];
    updatedAttributes[index].attributeId = attributeId;

    const selectedAttribute = availableAttributes.find(
      (attr) => attr.id.toString() === attributeId.toString(),
    );

    if (
      selectedAttribute &&
      selectedAttribute.values &&
      selectedAttribute.values.length > 0
    ) {
      updatedAttributes[index].options = selectedAttribute.values.map(
        (val) => ({
          value: val.value,
          price: 0,
          priceType: "Per Item",
          frontOnly: "",
          bothFrontBack: "",
        }),
      );
    } else {
      updatedAttributes[index].options = [
        {
          value: "",
          price: 0,
          priceType: "Per Item",
          frontOnly: "",
          bothFrontBack: "",
        },
      ];
    }
    setLocalAttributes(updatedAttributes);
    setIsAttributeDropdownOpen(false);
    updateParentVariations(sizes, updatedAttributes);
  };

  const handleAddOption = (attributeIndex, e) => {
    e.preventDefault();
    const updatedAttributes = [...localAttributes];
    updatedAttributes[attributeIndex].options.push({
      value: "",
      price: 0,
      priceType: "Per Item",
      frontOnly: "",
      bothFrontBack: "",
    });
    setLocalAttributes(updatedAttributes);
    updateParentVariations(sizes, updatedAttributes);
  };

  const handleOptionChange = (attributeIndex, optionIndex, field, value) => {
    const updatedAttributes = [...localAttributes];
    updatedAttributes[attributeIndex].options[optionIndex][field] = value;
    setLocalAttributes(updatedAttributes);
    updateParentVariations(sizes, updatedAttributes);

    if (field === "price") {
      handleAttributeValueChange(
        attributeIndex,
        optionIndex,
        "price_adjustment",
        value,
      );
    } else if (field === "priceType") {
      handleAttributeValueChange(
        attributeIndex,
        optionIndex,
        "price_type",
        value === "Per Item" ? "Per Item" : "percentage",
      );
    } else if (field === "value") {
      handleAttributeValueChange(
        attributeIndex,
        optionIndex,
        "attribute_name",
        value,
      );
    }
  };

  const handleRemoveOption = (e, attributeIndex, optionIndex) => {
    e.preventDefault();
    const updatedAttributes = [...localAttributes];
    if (updatedAttributes[attributeIndex].options.length > 1) {
      updatedAttributes[attributeIndex].options = updatedAttributes[
        attributeIndex
      ].options.filter((_, i) => i !== optionIndex);
      setLocalAttributes(updatedAttributes);
      updateParentVariations(sizes, updatedAttributes);
    }
  };

  const handleAttributeValueChange = (
    attrIndex,
    valueIndex,
    field,
    newValue,
  ) => {
    setSpecificAttributes((prevAttrs) => {
      const updatedAttrs = [...prevAttrs];
      if (!updatedAttrs[attrIndex]) {
        return prevAttrs;
      }

      if (!updatedAttrs[attrIndex].values) {
        updatedAttrs[attrIndex].values = [];
      }

      if (!updatedAttrs[attrIndex].values[valueIndex]) {
        updatedAttrs[attrIndex].values[valueIndex] = {};
      }

      updatedAttrs[attrIndex].values[valueIndex][field] = newValue;
      return updatedAttrs;
    });
  };

  const handleRemoveAttribute = (e, attributeIndex) => {
    e.preventDefault();
    const updatedAttributes = localAttributes.filter(
      (_, i) => i !== attributeIndex,
    );
    setLocalAttributes(updatedAttributes);
    updateParentVariations(sizes, updatedAttributes);
  };

  const getAttributeName = (attributeId) => {
    const attribute = availableAttributes.find(
      (attr) => attr.id.toString() === attributeId.toString(),
    );
    return attribute ? attribute.name : "";
  };

  const getAttributeValues = (attributeId) => {
    const attribute = availableAttributes.find(
      (attr) => attr.id.toString() === attributeId.toString(),
    );
    return attribute?.values?.map((v) => v.value) || [];
  };

  const updateParentVariations = (
    currentSizes = sizes,
    currentAttributes = localAttributes,
  ) => {
    const formattedVariations = [
      ...currentSizes
        .filter((s) => s.name.trim() !== "")
        .map((s) => ({
          attribute: "Size",
          general_attribute_id: sizeAttributeId,
          value: s.name,
          price_adjustment: parseFloat(s.price) || 0,
          price_type: "Per Item",
          quantity: parseInt(s.quantity) || 1,
        })),

      ...currentAttributes.flatMap((attr) =>
        attr.attributeId && attr.options.length > 0
          ? attr.options
              .filter((opt) => opt.value.trim() !== "")
              .map((opt) => ({
                attribute: getAttributeName(attr.attributeId),
                general_attribute_id: parseInt(attr.attributeId),
                value: opt.value,
                price_adjustment: parseFloat(opt.price) || 0,
                price_type: opt.priceType,
                quantity: 1,
                frontOnly: opt.frontOnly,
                bothFrontBack: opt.bothFrontBack,
              }))
          : [],
      ),
    ];

    if (formattedVariations.length === 0) {
      formattedVariations.push({
        attribute: "Size",
        general_attribute_id: sizeAttributeId,
        value: "Default",
        price_adjustment: 0,
        price_type: "Per Item",
        quantity: 1,
      });
    }

    setVariations(formattedVariations);

    setSizeVariations(
      currentSizes.map((size) => ({
        size_name: size.name,
        size_qty: size.quantity,
        size_price: size.price,
      })),
    );

    setAttributes(currentAttributes);
    setSpecificAttributes(
      currentAttributes.map((attr) => ({
        general_attribute_id: attr.attributeId,
        values: attr.options.map((opt) => ({
          id: opt.value,
          value: opt.value,
          attribute_name: opt.value,
          price_adjustment: parseFloat(opt.price) || 0,
          price_type: opt.priceType,
          additional_info: opt.frontOnly || opt.bothFrontBack || "",
        })),
      })),
    );
  };

  useEffect(() => {
    if (sizeAttributeId !== null && availableAttributes.length > 0) {
      // Only update parent if we have actual data to update with
      if (
        sizes.some((size) => size.name.trim() !== "") ||
        localAttributes.some((attr) => attr.attributeId !== "")
      ) {
        updateParentVariations();
      }
    }
  }, [sizeAttributeId, availableAttributes]);

  return (
    <div className="bg-white rounded-lg border border-gray-200">
      <div className="border-b border-gray-200 p-4">
        <h2 className="text-xl font-bold text-blue-500 mb-4 border-b-2 border-gray-300 pb-2">
          PRODUCT VARIATION
        </h2>
      </div>

      {/* Size variations section */}
      {sizes.map((size, sizeIndex) => (
        <div
          key={sizeIndex}
          className="border-b border-gray-200 p-4 grid grid-cols-1 md:grid-cols-3 gap-4"
        >
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Size Name:
            </label>
            <input
              type="text"
              placeholder="Size Name"
              className="border border-gray-300 p-2 rounded-md w-full focus:outline-none"
              value={size.name}
              onChange={(e) =>
                handleSizeChange(sizeIndex, "name", e.target.value)
              }
            />
          </div>
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Size Qty:
            </label>
            <input
              type="number"
              placeholder="1"
              className="border border-gray-300 p-2 rounded-md w-full focus:outline-none"
              value={size.quantity}
              onChange={(e) =>
                handleSizeChange(sizeIndex, "quantity", e.target.value)
              }
              min="0"
            />
          </div>
          <div className="relative">
            <label className="block text-gray-700 font-semibold mb-2">
              Size Price:
            </label>
            <input
              type="number"
              placeholder="0"
              className="border border-gray-300 p-2 rounded-md w-full focus:outline-none"
              value={size.price}
              onChange={(e) =>
                handleSizeChange(sizeIndex, "price", e.target.value)
              }
              min="0"
            />

            {sizes.length > 1 && (
              <button
                className="absolute top-0 right-0 p-1 bg-red-500 text-white rounded-full"
                onClick={(e) => handleRemoveSize(e, sizeIndex)}
                type="button"
                aria-label="Remove size"
              >
                <X size={16} />
              </button>
            )}
          </div>
        </div>
      ))}

      {/* Add more size button */}
      <div className="flex justify-center p-4">
        <button
          className="border border-gray-300 px-4 py-2 rounded-md flex items-center justify-center text-blue-500"
          onClick={handleAddMoreSize}
          type="button"
        >
          <Plus size={16} className="mr-2" /> Add More Size
        </button>
      </div>

      {/* Attributes section */}
      {localAttributes.map((attribute, attrIndex) => (
        <div key={attrIndex} className="border-b border-gray-200 p-4 relative">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            <div className="relative">
              <label className="block text-gray-700 font-semibold mb-2">
                Attribute Select
              </label>
              <div className="relative">
                <input
                  type="text"
                  className="border border-gray-300 p-2 rounded-md w-full focus:outline-none cursor-pointer"
                  value={getAttributeName(attribute.attributeId)}
                  placeholder="Select Attribute"
                  onClick={() => setIsAttributeDropdownOpen(attrIndex)}
                  readOnly
                />
                {isAttributeDropdownOpen === attrIndex && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
                    {availableAttributes.map((attr) => (
                      <div
                        key={attr.id}
                        className="p-2 hover:bg-gray-100 cursor-pointer"
                        onClick={() =>
                          handleAttributeSelect(attrIndex, attr.id)
                        }
                      >
                        {attr.name}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {localAttributes.length > 1 && (
                <button
                  className="absolute top-0 right-0 p-1 bg-red-500 text-white rounded-full"
                  onClick={(e) => handleRemoveAttribute(e, attrIndex)}
                  type="button"
                  aria-label="Remove attribute"
                >
                  <X size={16} />
                </button>
              )}
            </div>
          </div>

          {/* Attribute options */}
          {attribute.options.map((option, optIndex) => (
            <div key={optIndex} className="mb-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-2">
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">
                    Attribute Value
                  </label>
                  <input
                    type="text"
                    list={`attribute-values-${attrIndex}-${optIndex}`}
                    className="border border-gray-300 p-2 rounded-md w-full focus:outline-none"
                    value={option.value}
                    placeholder="Value"
                    onChange={(e) =>
                      handleOptionChange(
                        attrIndex,
                        optIndex,
                        "value",
                        e.target.value,
                      )
                    }
                  />
                  <datalist id={`attribute-values-${attrIndex}-${optIndex}`}>
                    {getAttributeValues(attribute.attributeId).map((val, i) => (
                      <option key={i} value={val} />
                    ))}
                  </datalist>
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">
                    Attribute Price
                  </label>
                  <input
                    type="number"
                    className="border border-gray-300 p-2 rounded-md w-full focus:outline-none"
                    value={option.price}
                    placeholder="0"
                    onChange={(e) =>
                      handleOptionChange(
                        attrIndex,
                        optIndex,
                        "price",
                        e.target.value,
                      )
                    }
                    min="0"
                  />
                </div>
                <div className="relative">
                  <label className="block text-gray-700 font-semibold mb-2">
                    Price Type
                  </label>
                  <select
                    className="border border-gray-300 p-2 rounded-md w-full focus:outline-none"
                    value={option.priceType}
                    onChange={(e) =>
                      handleOptionChange(
                        attrIndex,
                        optIndex,
                        "priceType",
                        e.target.value,
                      )
                    }
                  >
                    <option value="Per Item">Per Item</option>
                    <option value="Percentage">Percentage</option>
                  </select>

                  {attribute.options.length > 1 && (
                    <button
                      className="absolute top-0 right-0 p-1 bg-red-500 text-white rounded-full"
                      onClick={(e) =>
                        handleRemoveOption(e, attrIndex, optIndex)
                      }
                      type="button"
                      aria-label="Remove option"
                    >
                      <X size={16} />
                    </button>
                  )}
                </div>
              </div>

              {/* Front/Back fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">
                    Front Only
                  </label>
                  <input
                    type="text"
                    className="border border-gray-300 p-2 rounded-md w-full focus:outline-none"
                    value={option.frontOnly}
                    onChange={(e) =>
                      handleOptionChange(
                        attrIndex,
                        optIndex,
                        "frontOnly",
                        e.target.value,
                      )
                    }
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">
                    Both Front Back
                  </label>
                  <input
                    type="text"
                    className="border border-gray-300 p-2 rounded-md w-full focus:outline-none"
                    value={option.bothFrontBack}
                    onChange={(e) =>
                      handleOptionChange(
                        attrIndex,
                        optIndex,
                        "bothFrontBack",
                        e.target.value,
                      )
                    }
                  />
                </div>
              </div>
            </div>
          ))}

          {/* Add option button */}
          <div className="flex justify-center mb-2">
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded-md w-full"
              onClick={(e) => handleAddOption(attrIndex, e)}
              type="button"
            >
              Add option
            </button>
          </div>
        </div>
      ))}

      {/* Add new attribute button */}
      <div className="p-4">
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded-md"
          onClick={handleAddNewAttribute}
          type="button"
        >
          Add New Attribute
        </button>
      </div>
    </div>
  );
};

export default ProductVariation;
