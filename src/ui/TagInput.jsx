import { useState } from "react";

const TagInput = ({ tags, setTags }) => {
  const [input, setInput] = useState("");
  const handleInputChange = (e) => {
    setInput(e.target.value);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && input.trim() !== "") {
      e.preventDefault();
      addTag(input.trim());
    }
  };

  const addTag = (tag) => {
    if (!tags.includes(tag)) {
      setTags([...tags, tag]);
    }
    setInput("");
  };
  // Remove a tag from the list
  const removeTag = (tagToRemove) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };
  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-4">
        {Array.isArray(tags) &&
          tags.map((tag, index) => (
            <div
              key={index}
              className="bg-teal-500 text-white px-3 py-1 rounded-full flex items-center"
            >
              {tag}
              <button
                type="button"
                onClick={() => removeTag(tag)}
                className="ml-2 text-red-500"
              >
                ×
              </button>
            </div>
          ))}
      </div>
      <input
        type="text"
        value={input}
        onChange={handleInputChange}
        onKeyDown={handleKeyPress}
        className="p-2 border rounded-md w-full"
        placeholder="Enter tags and press Enter"
      />
    </div>
  );
};

export default TagInput;
