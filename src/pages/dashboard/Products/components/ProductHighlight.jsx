import { useGetQuery } from "@/services/apiService";
import { X } from "lucide-react";
import { useState } from "react";

const highlightsOptions = [
  "Featured",
  "Top Rated",
  "Hot",
  "Trending",
  "Flash Deal",
  "Best Seller",
  "Bid Save",
  "New",
  "Sale",
  "Hottest Save",
];

const ProductHighlight = ({ product, onBack, isOpen, onClose }) => {
  const [selected, setSelected] = useState([]);

  const { data: highlights } = useGetQuery({
    path: `/products/highlights/${product.uuid}`,
  });

  const handleToggle = (option) => {
    setSelected((prev) =>
      prev.includes(option)
        ? prev.filter((o) => o !== option)
        : [...prev, option],
    );
  };

  const handleSubmit = () => {
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-xl">
        <div className="flex justify-between items-center mb-4">
          <div></div>
          <h2 className="text-xl font-semibold mb-4 text-pinkclr">
            Highlight Options
          </h2>
          <button onClick={onClose} className="text-pinkclr">
            <X />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-y-4 gap-x-8 mb-6">
          {highlightsOptions.map((option) => (
            <label key={option} className="flex items-center space-x-3 text-lg">
              <input
                type="checkbox"
                className="w-5 h-5 text-blue-600 border-2 border-blue-900 rounded"
                checked={selected.includes(option)}
                onChange={() => handleToggle(option)}
              />
              <span className="font-medium">Highlight in {option}</span>
            </label>
          ))}
        </div>
        <div className="flex justify-end">
          <button
            onClick={handleSubmit}
            className="bg-teelclr text-white px-6 py-2 rounded-full shadow hover:bg-teal-600 transition"
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductHighlight;
