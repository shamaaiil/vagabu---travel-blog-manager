import React, { useState, useRef } from "react";

const TagInput = ({ tags = [], setTags, placeholder = "Add tag..." }) => {
  const [input, setInput] = useState("");
  const inputRef = useRef(null);
  const tagsArray =
    typeof tags === "string"
      ? tags
          .split(",")
          .filter(Boolean)
          .map((tag) => tag.trim())
      : Array.isArray(tags)
        ? tags
        : [];

  const handleInputChange = (e) => {
    setInput(e.target.value);
  };

  const handleInputKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();

      if (input.trim()) {
        if (!tagsArray.includes(input.trim())) {
          setTags([...tagsArray, input.trim()]);
        }
        setInput("");
      }
      return;
    }
    if (e.key === "Backspace" && !input && tagsArray.length > 0) {
      e.preventDefault();
      e.stopPropagation();

      const newTags = [...tagsArray];
      newTags.pop();
      setTags(newTags);
    }
  };

  const removeTag = (index, e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    const newTags = [...tagsArray];
    newTags.splice(index, 1);
    setTags(newTags);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  return (
    <div className="flex flex-wrap items-center p-2 border border-gray-300 rounded-md min-h-10 focus-within:border-teelclr">
      {tagsArray.map((tag, index) => (
        <div
          key={index}
          className="flex items-center bg-gray-200 rounded-md px-2 py-1 m-1"
        >
          <span className="mr-1">{tag}</span>
          <button
            type="button"
            onClick={(e) => removeTag(index, e)}
            onMouseDown={(e) => e.preventDefault()}
            className="focus:outline-none"
            tabIndex={-1}
          >
            &times;
          </button>
        </div>
      ))}
      <input
        ref={inputRef}
        type="text"
        value={input}
        onChange={handleInputChange}
        onKeyDown={handleInputKeyDown}
        placeholder={tagsArray.length === 0 ? placeholder : ""}
        className="flex-grow px-2 py-1 focus:outline-none"
      />
    </div>
  );
};

export default TagInput;
