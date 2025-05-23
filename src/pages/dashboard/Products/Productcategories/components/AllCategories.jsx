import { useState, useEffect } from "react";
import DynamicTable from "@/ui/DynamicTable";
import DynamicCategoryModal from "./components/CategoryModal";
import DeleteModal from "@/ui/DeleteModal";
import {
  useGetQuery,
  usePostMutation,
  useDeleteMutation,
} from "@/services/apiService";
import { toast } from "react-toastify";

export function MainCategory() {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const itemsPerPage = 10;

  // Updated API endpoint with proper pagination parameters
  const { data, isLoading, refetch } = useGetQuery({
    path: `/categories?per_page=${itemsPerPage}&page=${currentPage}&parent_only=1&sub_only=0&child_only=0${searchTerm ? `&search=${searchTerm}` : ""}`,
  });

  // Refetch when page or search term changes
  useEffect(() => {
    refetch();
  }, [currentPage, searchTerm, refetch]);

  useEffect(() => {
    if (data) {
      // console.log("API response:", data);

      // Extract total items from pagination metadata
      if (data.meta?.pagination?.total) {
        setTotalItems(data.meta.pagination.total);
      } else if (data.pagination?.total) {
        setTotalItems(data.pagination.total);
      } else if (data.meta?.total) {
        setTotalItems(data.meta.total);
      } else if (data.total) {
        setTotalItems(data.total);
      } else if (Array.isArray(data.data)) {
        setTotalItems(data.data.length);
      }
    }
  }, [data]);
  // Format data for the table
  const categories = data?.data?.map((category) => {

    const categoryData = {
      id: category.id,
      uuid: category.category_uuid,
      name: category.name,
      slug: category.slug,
      title: category.title,
      metaTags: category.meta_tags,
      ordering: category.ordering,
      metaDescription: category.meta_description,
      status: category.status ? "Active" : "Inactive",
      isBanned: "No", // Default value for isBanned,
      iconWithName: (
        <div className="flex items-center space-x-2">
          {category.icon ? (
            <img
              src={category.icon}
              alt={category.name}
              className="h-6 w-6 object-cover rounded-full"
            />
          ) : (
            <span className="h-6 w-6 bg-gray-300 rounded-full flex items-center justify-center text-white">?</span> // Placeholder if no icon
          )}
          <span className="text-[#2B3674]">{category.name}</span> {/* Category Name */}
        </div>
      ),
      icon: category.icon || "", // Store the icon URL string instead of rendering it
      actions: (
        <div className="flex space-x-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleEditClick(categoryData);
            }}
            className="text-pinkclr hover:text-pink-900"
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
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleDeleteClick(categoryData);
            }}
            className="text-pinkclr hover:text-red-900"
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
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
          </button>
        </div>
      ),
    };
    return categoryData;
  });

  const columns = [
    { key: "iconWithName", label: "Name" },
    { key: "ordering", label: "Order" },
    { key: "status", label: "Status", toggleable: true },
    { key: "actions", label: "Actions" },
  ];

}

export default MainCategories;