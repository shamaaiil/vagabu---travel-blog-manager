import React, { useState, useEffect } from "react";
import { Pencil, Trash2 } from "lucide-react";
import DynamicTable from "@/ui/DynamicTable";
import { useGetQuery, usePostMutation } from "@/services/apiService";
import DynamicModal from "@/ui/DynmicModal";

const columns = [
  { label: "Title", key: "title" },
  { label: "Cost", key: "cost" },
  { label: "Duration", key: "duration" },
  { label: "Benefits", key: "benefits" },
  { label: "Actions", key: "actions" },
];

const SubscriptionPlans = () => {
  const [isEditModal, setIsEditModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);

  const { data: subPlans, refetch, isLoading: isFetching } = useGetQuery({
    path: "/stripe/packages",
  });

  const [updatePlan, { isLoading: isUpdating }] = usePostMutation();

  const handleEdit = (plan) => {
    console.log("Plan passed to edit:", plan);
    setSelectedPlan(plan);
    setIsEditModal(true);
  };

  // Debug selectedPlan changes
  useEffect(() => {
    if (selectedPlan) {
      console.log("Selected plan updated:", selectedPlan);
    }
  }, [selectedPlan]);

  const handleModalSubmit = async (formData) => {
    console.log("Form Data Submitted:", formData);

    try {
      await updatePlan({
        path: "/stripe/update-package",
        body: {
          product_id: selectedPlan.product,
          name: formData.title,
          price: formData.cost,
          interval: formData.duration,
          benefits: formData.benefits, // should be string (html string from react-quill)
        },
      });

      setIsEditModal(false);
      setSelectedPlan(null);
      refetch();
    } catch (err) {
      console.error("Update error:", err);
    }
  };

  // Prepare data for table
  const formattedData = subPlans?.data?.map((plan) => ({
    title: plan.product_name,
    cost: plan.plan_price,
    duration: plan.recurring?.interval,
     benefits: (
    <div
      dangerouslySetInnerHTML={{ __html: plan.benefits?.benefits || "" }}
      className="prose max-w-none" // optional styling if you use Tailwind's typography plugin
    />
  ),
    actions: (
      <div className="flex gap-2">
        <button onClick={() => handleEdit(plan)} className="text-pinkclr">
          <Pencil size={16} />
        </button>
        {/* Add delete if needed */}
        {/* <button onClick={() => handleDelete(plan)} className="text-pinkclr">
          <Trash2 size={16} />
        </button> */}
      </div>
    ),
  }));

  // Pagination & Search state (to be wired to API if needed)
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(2); // Adjust if total count is available from API
  const itemsPerPage = 10;
  const [searchQuery, setSearchQuery] = useState("");

  const handlePageChange = (page) => setCurrentPage(page);
  const handleSearch = (query) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  const handleDelete = (plan) => {
    console.log("Delete plan:", plan);
  };

  return (
    <div className="mt-12 mb-8 flex bg-[#F2F7FB] flex-col gap-12 px-8">
      <DynamicTable
        data={formattedData}
        columns={columns}
        tableTitle="Subscription Plan"
        showAddButton={false}
        currentPage={currentPage}
        totalItems={totalItems}
        itemsPerPage={itemsPerPage}
        onPageChange={handlePageChange}
        onSearch={handleSearch}
        onEdit={handleEdit}
        onDelete={handleDelete}
        isLoading={isFetching || isUpdating}
      />

      {isEditModal && (
        <DynamicModal
          title="Edit Subscription"
          initialData={{
            title: selectedPlan?.product_name || "",
            cost: selectedPlan?.plan_price || "",
            duration: selectedPlan?.recurring?.interval || "",
            benefits: selectedPlan?.benefits?.benefits || "",
          }}
          fields={[
            { name: "title", label: "Subscription Title", type: "text" },
            { name: "cost", label: "Cost", type: "text" },
            { name: "duration", label: "Duration", type: "text" },
            { name: "benefits", label: "Benefits", type: "textarea" },
          ]}
          onSubmit={handleModalSubmit}
          isLoading={isUpdating}
          onClose={() => {
            setIsEditModal(false);
            setSelectedPlan(null);
          }}
        />
      )}
    </div>
  );
};

export default SubscriptionPlans;
