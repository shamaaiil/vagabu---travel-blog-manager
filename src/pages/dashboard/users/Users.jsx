import DynamicTable from "@/ui/DynamicTable";
import CreateModal from "@/ui/DynmicModal";
import { useState } from "react";
import EditModal from "@/ui/EditModal";
import DeleteModal from "@/ui/DeleteModal";
import routes from "@/routes";

export function Users() {
  const columns = [
    "image",
    "Name",
    "Email",
    "Phone",
    "Designation",
    "Permissions",
  ];
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentRowData, setCurrentRowData] = useState(null);
  const [tableData, setTableData] = useState([
    {
      img: "https://via.placeholder.com/50",
      name: "John Doe",
      email: "john@example.com",
      phone: "+92 123-4567890",
      designation: "Manager",
      Permissions: ["edit", "delete", "add"],
    },
    {
      img: "https://via.placeholder.com/50",
      name: "Jane Smith",
      email: "jane@example.com",
      phone: "+92 987-6543210",
      designation: "Developer",
      Permissions: ["edit", "delete", "add"],
    },
  ]);

  ("routes", routes[0]);

  const dropdownOptions = {
    Permissions: [routes[0]?.pages],
  };

  // Handle adding a new row
  const handleAdd = (newData) => {
    setTableData((prevData) => [...prevData, newData]);
    setIsCreateModalOpen(false); // Close the modal
    ("Added Data:", newData);
  };

  // Handle editing an existing row
  const handleEdit = (updatedRow) => {
    setTableData((prevData) =>
      prevData.map((row) => (row.email === updatedRow.email ? updatedRow : row))
    );
    setIsEditModalOpen(false); // Close the modal
    ("Edited Data:", updatedRow);
  };

  // Handle deleting a row
  const handleDelete = (rowToDelete) => {
    setTableData((prevData) =>
      prevData.filter((row) => row.email !== rowToDelete.email)
    );
    setIsDeleteModalOpen(false); // Close the modal
    ("Deleted Row:", rowToDelete);
  };

  // Open edit modal with specific row data
  const handleEditClick = (row) => {
    setCurrentRowData(row);
    setIsEditModalOpen(true);
  };

  return (
    <div className="mt-12 mb-8 flex flex-col gap-12">
      {/* Dynamic Table */}
      <DynamicTable
        tableTitle="Authors Table"
        columns={columns}
        data={tableData}
        onAdd={handleAdd}
        dropdownOptions={dropdownOptions}
        onDelete={(row) => {
          setCurrentRowData(row);
          setIsDeleteModalOpen(true);
        }}
        onEdit={handleEditClick}
        open={() => setIsCreateModalOpen(true)}
      />

      {/* Create Modal */}
      <CreateModal
        open={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleAdd}
        columns={columns}
        dropdownOptions={dropdownOptions}
      />

      {/* Edit Modal */}
      <EditModal
        open={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSubmit={handleEdit}
        columns={columns}
        dropdownOptions={dropdownOptions}
        rowData={currentRowData}
      />

      {/* Delete Modal */}
      <DeleteModal
        open={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onDelete={() => handleDelete(currentRowData)}
        rowData={currentRowData}
      />
    </div>
  );
}

export default Users;
