import TagInput from "@/ui/TagInput";
import React, { useEffect, useState } from "react";
import Editor from "@/components/common/Editor.jsx";

const SEO = ({ seo, setSeo, productName }) => {
  // Helper function to parse keywords/tags
  const parseTagsFromString = (value) => {
    if (typeof value === "string") {
      return value
        .split(",")
        .filter(Boolean)
        .map((tag) => tag.trim());
    }
    return Array.isArray(value) ? value : [];
  };

  // Initialize state
  const [keywordArray, setKeywordArray] = useState([]);
  const [tagArray, setTagArray] = useState([]);

  // Update local state when seo prop changes
  useEffect(() => {
    const newKeywords = parseTagsFromString(seo.keywords);
    const newMetaTags = parseTagsFromString(seo.meta_tags);

    // Only update if the data is actually different to prevent infinite loops
    setKeywordArray((prevKeywords) => {
      const isDifferent =
        JSON.stringify(prevKeywords) !== JSON.stringify(newKeywords);
      return isDifferent ? newKeywords : prevKeywords;
    });

    setTagArray((prevTags) => {
      const isDifferent =
        JSON.stringify(prevTags) !== JSON.stringify(newMetaTags);
      return isDifferent ? newMetaTags : prevTags;
    });
  }, [seo.keywords, seo.meta_tags]);

  // Handle keyword changes
  const handleKeywordsChange = (newKeywords) => {
    setKeywordArray(newKeywords);
    // Update parent state with comma-separated string
    setSeo((prev) => ({
      ...prev,
      keywords: newKeywords.join(","),
    }));
  };

  // Handle meta tag changes
  const handleTagsChange = (newTags) => {
    setTagArray(newTags);

    setSeo((prev) => ({
      ...prev,
      meta_tags: newTags.join(","),
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSeo((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleDetailsChange = (value, name) => {
    setSeo((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="p-6 bg-white shadow-md rounded-lg border border-gray-200">
      <h2 className="text-lg font-bold text-pinkclr mb-4 border-b pb-2">
        SEO INFORMATION
      </h2>

      <div className="mb-4">
        <label className="block text-[#1F2B6C] font-semibold mb-2">
          Title <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={seo.title || ""}
          onChange={handleChange}
          name="title"
          className="border border-gray-300 rounded-md px-4 py-3 w-full text-sm focus:outline-none"
          required
        />
      </div>

      <div className="mb-4">
        <div>
          <label className="block text-[#1F2B6C] font-semibold mb-2">
            Keywords <span className="text-red-500">*</span>
          </label>
          <TagInput tags={keywordArray} setTags={handleKeywordsChange} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-[#1F2B6C] font-semibold mb-2">
            Meta Tags
          </label>
          <TagInput tags={tagArray} setTags={handleTagsChange} />
        </div>

        <div>
          <Editor
            name="meta_description"
            value={seo.meta_description || ""}
            placeholder="Enter Meta Description..."
            label="Meta Description"
            onChange={handleDetailsChange}
          />
        </div>
      </div>
    </div>
  );
};

export default SEO;
