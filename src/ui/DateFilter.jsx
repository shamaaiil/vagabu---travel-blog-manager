import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { CalendarIcon } from "@heroicons/react/24/outline";

const DateFilter = ({ onFilterChange, initialStartDate = "", initialEndDate = "" }) => {
  const [startDate, setStartDate] = useState(initialStartDate);
  const [endDate, setEndDate] = useState(initialEndDate);

  // Validate dates on change
  useEffect(() => {
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      if (start > end) {
        toast.error("End date cannot be earlier than start date.");
      }
    }
  }, [startDate, endDate]);

  const handleApplyFilter = () => {
    if (startDate) {
      const start = new Date(startDate);
      if (start > end) {
        toast.error("End date cannot be earlier than start date.");
        return;
      }
    }
    onFilterChange({ startDate, endDate });
  };

  const handleClearFilter = () => {
    setStartDate("");
    setEndDate("");
    onFilterChange({ startDate: "", endDate: "" });
  };

  return (
    <div className="flex gap-4 mb-6 items-end bg-white p-4 rounded-lg shadow-md border border-gray-300">
      {/* Start Date */}
      <div className="relative">
        <label className="block text-sm font-medium text-gray-600 mb-1">
          Start Date
        </label>
        <div className="relative">
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-md border border-gray-400 bg-gray-50 text-gray-700 focus:border-gray-600 focus:ring-0 appearance-none sketch-border"
            max={new Date().toISOString().split("T")[0]} // Prevent future dates
          />
          <CalendarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500" />
        </div>
      </div>

      {/* Buttons */}
      <div className="flex gap-2">
        <button
          onClick={handleApplyFilter}
          className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 sketch-button"
        >
          Apply Filter
        </button>
        <button
          onClick={handleClearFilter}
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 sketch-button"
        >
          Clear Filter
        </button>
      </div>
    </div>
  );
};

export default DateFilter;