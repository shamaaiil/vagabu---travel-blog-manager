import React, { useState } from "react";
import { Pencil } from "lucide-react";
import DynamicTable from "../../tables"; // your custom table component
import EmailTemplateModal from "./EmailTemplateModal";

const EmailTemplates = () => {
    const [isOpen, setIsOpen] = useState(false);
  const columns = [
    { label: "Email Type", key: "type" },
    { label: "Email Name", key: "name" },
    { label: "Email Subject", key: "subject" },
    { label: "Options", key: "action" },
  ];

  // Sample data with actions
  const data = [
    {
      type: "sponsorship_p",
      name: "sponsorship_p",
      subject: "sponsorship_p",
    },
  ];

  // Add action column dynamically
  const dataWithActions = data.map((item) => ({
    ...item,
    action: (
      <div className="flex gap-2">
        <Pencil
          size={16}
          className="text-pink-500 cursor-pointer hover:text-pink-700"
          onClick={() => setIsOpen(true)}
        />
      </div>
    ),
  }));

  return (
    <div className="mt-12 px-8">
      <DynamicTable
        tableTitle="Email Templates"
        addButtonText="Add New"
        columns={columns}
        data={dataWithActions}
        onSearch={(search) => console.log("Search:", search)}
        onPageChange={(page) => console.log("Page:", page)}
        currentPage={1}
        itemsPerPage={10}
      />
        <EmailTemplateModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </div>
  );
};

export default EmailTemplates;
