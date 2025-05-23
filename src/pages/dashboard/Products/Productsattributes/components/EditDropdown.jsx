import { Plus, PlusIcon } from "lucide-react";
import { useState, useRef, useEffect } from "react";

const EditDropdown = ({ onEdit, onViewGallery, onHighlights, onDuplicate }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const toggleDropdown = (e) => {
    e.stopPropagation();
    setIsOpen(!isOpen);
  };
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={toggleDropdown}
        className="text-pinkclr"
        aria-label="Edit options"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
          />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
          <div className="py-1 rounded-md bg-white shadow-xs">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit();
                setIsOpen(false);
              }}
              className="flex items-center px-4 py-2 text-sm text-textclr hover:bg-gray-100 w-full text-left"
            >
              <svg
                className="mr-3 h-5 w-5 text-textclr"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                />
              </svg>
              Edit
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                onViewGallery();
                setIsOpen(false);
              }}
              className="flex items-center px-4 py-2 text-sm text-textclr hover:bg-gray-100 w-full text-left"
            >
              <svg
                className="mr-3 h-5 w-5 text-textclr"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              View Gallery
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                onDuplicate();
                setIsOpen(false);
              }}
              className="flex items-center px-4 py-2 text-sm text-textclr hover:bg-gray-100 w-full text-left"
            >
              <PlusIcon className="mr-3 h-5 w-5 text-textclr" />
              Duplicate Product
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                onHighlights();
                setIsOpen(false);
              }}
              className="flex items-center px-4 py-2 text-sm text-textclr hover:bg-gray-100 w-full text-left"
            >
              <svg
                className="mr-3 h-5 w-5 text-textclr"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
                />
              </svg>
              Highlights
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditDropdown;
