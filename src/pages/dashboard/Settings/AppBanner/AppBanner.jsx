// components/AppBanner/AppBanner.js
import React, { useState } from "react";
import { Pencil, Trash } from "lucide-react";
import DynamicTable from "@/ui/DynamicTable";
import AddBannerModal from "./AppBannerModal";

const AppBanner = () => {
  const columns = [
    { label: "Featured Image", key: "image" },
    { label: "Heading", key: "heading" },
    { label: "Sub Heading", key: "subHeading" },
    { label: "Description", key: "description" },
    { label: "Type", key: "type" },
    { label: "Options", key: "action" },
  ];

  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const data = [
    {
      image: <img src="path-to-image" alt="Featured" className="w-16 h-16 object-cover" />,
      heading: "Compare",
      subHeading: "Compare",
      description: "Mecarvi",
      type: "Application",
    },
    {
      image: <img src="path-to-image" alt="Featured" className="w-16 h-16 object-cover" />,
      heading: "Compare",
      subHeading: "Compare",
      description: "Mecarvi",
      type: "Application",
    },
  ];

  const handleEdit = (item) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedItem(null);
  };

  const dataWithActions = data.map((item) => ({
    ...item,
    action: (
      <div className="flex gap-2">
        <Pencil className="text-pink-500 cursor-pointer" size={16} onClick={() => handleEdit(item)} />
        <Trash className="text-red-500 cursor-pointer" size={16} onClick={() => console.log("Delete:", item)} />
      </div>
    ),
  }));

  return (
    <div className="mt-12 px-8">
      <DynamicTable
        tableTitle="App Banner"
        columns={columns}
        data={dataWithActions}
        onSearch={(search) => console.log("Search:", search)}
        onPageChange={setCurrentPage}
        currentPage={currentPage}
        itemsPerPage={10}
        onAdd={() => {
          setSelectedItem(null); // Clear any edit state
          setIsModalOpen(true);  // Open modal in add mode
        }}
      />
          <AddBannerModal
           isOpen={isModalOpen}
             onClose={handleCloseModal}
           selectedItem={selectedItem}
              />
           </div>
  );
};

export default AppBanner;
