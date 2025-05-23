import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useGetQuery, usePostMutation } from "@/services/apiService";
import ReactQuill from "react-quill";

export function CreateEditAttribute({ attribute, onClose }) {
  const isEditMode = !!attribute;
  const isCopyMode = attribute?.isClone;
  
  const [loading, setLoading] = useState(false);
  const [attributeName, setAttributeName] = useState("");
  const [description, setDescription] = useState("");
  const [attributeValues, setAttributeValues] = useState([{ value: "" }]);

  // FIXED: No trailing slash in the API path for fetching attribute data
  const { data: attributeData, isLoading: isLoadingAttribute } = useGetQuery({
    path: isEditMode && !isCopyMode ? `/general-attributes/${attribute.uuid}` : null,
    enabled: isEditMode && !isCopyMode
  });

  const [saveAttribute, { isLoading: isSaving }] = usePostMutation();

  useEffect(() => {
    if (attribute) {
      // Coming from direct navigation with state (copy mode or from table edit)
      setAttributeName(attribute.name);
      setDescription(attribute.description || "");
      
      // Format values for the form
      if (attribute.values && attribute.values.length > 0) {
        setAttributeValues(attribute.values.map(val => 
          typeof val === 'string' ? { value: val } : val
        ));
      }
    } else if (attributeData && !isLoadingAttribute) {
      // Data fetched from API in edit mode
      setAttributeName(attributeData.data.name || "");
      setDescription(attributeData.data.description || "");
      
      // Format values for the form
      if (attributeData.data.values && attributeData.data.values.length > 0) {
        setAttributeValues(attributeData.data.values);
      }
    }
  }, [attribute, attributeData, isLoadingAttribute]);

  const handleAddAttributeValue = () => {
    setAttributeValues((prevValues) => [...prevValues, { value: "" }]);
  };

  const handleAttributeValueChange = (index, value) => {
    const updatedValues = [...attributeValues];
    updatedValues[index] = { value, additionalInfo: null };
    setAttributeValues(updatedValues);
  };

  const handleSave = async () => {
    if (!attributeName || !description || attributeValues.some(val => !val.value)) {
      toast.error("Please fill all required fields.");
      return;
    }


    setLoading(true);
    try {
      const payload = {
        name: attributeName,
        description,
        values: attributeValues
      };

      // FIXED: Removed trailing slash from API path
      let apiPath = "/general-attributes";
      let method = "POST";
      
      if (isEditMode && !isCopyMode) {
        apiPath = `/general-attributes/${attribute.uuid}?_method=patch`;
      }

      const response = await saveAttribute({
        path: apiPath,
        method,
        body: payload
      });

      if (!response.error) {
        toast.success(
          isEditMode && !isCopyMode 
            ? "Attribute updated successfully" 
            : "Attribute created successfully"
        );
        onClose();
      } else {
        toast.error(response.error.data.message || "Failed to save attribute");
      }
    } catch (error) {
      console.error("Error saving attribute:", error);
      toast.error("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };
  const handleQuillChange = (value) => {
    setDescription((prev) => ({
      ...prev,
      description: value,  // Update the message field with Quill's value
    }));
  };
  // Show loading state while fetching attribute data in edit mode
  if (isEditMode && isLoadingAttribute && !isCopyMode) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-500"></div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 w-full mx-auto px-8">
     <h2 className="text-lg font-medium text-pinkclr mb-6 border-b pb-2">
  {isCopyMode
    ? "Copy Attribute"
    : isEditMode
    ? "Edit Attribute"
    : "Create Attribute"}
</h2>

      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-gray-700 mb-1">
              Attribute Name
            </label>
            <input
              type="text"
              value={attributeName}
              onChange={(e) => setAttributeName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="Enter name"
            />
          </div>
        </div>
          <label className="block text-sm text-gray-700 mb-1">
            Description
          </label>
          <ReactQuill
            value={description} // Bind React Quill's value to the message field
            onChange={handleQuillChange}
            placeholder="Enter your message"
            className="w-full mt-1 border rounded-md text-sm sm:text-base"
            modules={{
              toolbar: [
                [{ 'header': '1' }, { 'header': '2' }, { 'font': [] }],
                [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                ['bold', 'italic', 'underline'],
                [{ 'align': [] }],
                ['link'],
              ],
            }}
          />

          <div>
            <label className="block text-sm text-gray-700 mb-1">
              Attribute Value
            </label>
            <input
              type="text"
              value={attributeValues[0]?.value || ""}
              onChange={(e) => handleAttributeValueChange(0, e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="Enter Value"
            />
          </div>
        {attributeValues.length > 1 && (
          <div className="mt-4 space-y-6 ">
            {attributeValues.slice(1).map((valueObj, index) => (
              <div key={index + 1} className="flex items-center gap-">
                <input
                  type="text"
                  value={valueObj.value}
                  onChange={(e) => handleAttributeValueChange(index + 1, e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="Enter Value"
                />
              </div>
            ))}
          </div>
        )}

        <div className="flex mt-4">
          <button
            type="button"
            onClick={handleAddAttributeValue}
            className="px-4 py-2 text-sm bg-white border border-teal-500 text-teal-500 rounded-md hover:bg-teal-50"
          >
            Add Attribute Value
          </button>
        </div>
      </div>

      <div className="flex justify-end mt-6">
        <button
          onClick={handleSave}
          className="bg-teal-500 text-white py-1 px-4 rounded-md text-sm hover:bg-teal-600"
        >
          {loading ? "Saving..." : (isEditMode && !isCopyMode ? "Update" : "Create")}
        </button>
      </div>
    </div>
  );
}

export default CreateEditAttribute;