import { useState, useEffect, useRef } from "react";
import DynamicTable from "@/ui/DynamicTable";
import DynamicCustomerModal from "./components/CustomerModal";
import DynamicCustomersModal from "./components/DynamicCustomersModal";
import {
  useGetQuery,
  usePostMutation,
  useDeleteMutation,
} from "@/services/apiService";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";
import DeleteModal from "@/ui/DeleteModal";
import CustomerDetail from "./CustomerDetail";
import { UserRound } from "lucide-react";
import UserCard from "./components/UserCards";

export function Customers() {
  const navigate = useNavigate();
  const { uuid: editCustomerId } = useParams();
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentRowData, setCurrentRowData] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [openActionMenu, setOpenActionMenu] = useState(null);
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });
  const [isCustomerDetail, setIsCustomerDetail] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [userCardModalOpen, setUserCardModalOpen] = useState(false);
  // Modal states
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [isPinModalOpen, setIsPinModalOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [isManageDepositOpen, setIsManageDepositOpen] = useState(false);
  const [isCustomerVerification, setIsCustomerVerification] = useState(false);

  const itemsPerPage = 10;

  const actionMenuRef = useRef(null);
  const menuButtonRefs = useRef({});

  const { data: customerData, isLoading, refetch } = useGetQuery({
    path: `/customers?per_page=${itemsPerPage}&page=${currentPage}${searchTerm ? `&search=${searchTerm}` : ""}`,
  });

  const [updateCustomer, { isLoading: isUpdating }] = usePostMutation();
  const [deleteCustomer] = useDeleteMutation();

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        actionMenuRef.current &&
        !actionMenuRef.current.contains(event.target) &&
        !Object.values(menuButtonRefs.current).some(
          (ref) => ref && ref.contains(event.target),
        )
      ) {
        setOpenActionMenu(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Refetch when page or search term changes
  useEffect(() => {
    refetch();
  }, [currentPage, searchTerm, refetch]);

  // Extract total items for pagination
  useEffect(() => {
    if (customerData) {
      setTotalItems(customerData.meta?.pagination?.total || customerData.data?.length || 0);
    }
  }, [customerData]);

  const customer = customerData?.data?.map((customer) => ({
    id: customer.id,
    uuid: customer.user_uuid,
    fullName: customer.full_name,
    email: customer.email,
    phoneNumber: customer.phone_number,
    wallet: customer.wallet?.balance || 0,
    NoOrders: customer.orders_count || 0, // Add orders count if available in API response
    isBanned: customer.is_banned ? "Yes" : "No",
    status: customer.status ? "Active" : "Inactive",
    roles: customer.roles?.join(", ") || "N/A",
    createdAt: new Date(customer.created_at).toLocaleDateString(),
    actions: (
      <div className="flex items-center space-x-4">
        <button
          ref={(el) => (menuButtonRefs.current[customer.id] = el)}
          onClick={(e) => {
            e.stopPropagation();
            setOpenActionMenu(
              openActionMenu === customer.id ? null : customer.id
            );
            const rowData = {
              id: customer.id,
              uuid: customer.user_uuid,
              fullName: customer.full_name,
              email: customer.email,
              phoneNumber: customer.phone_number,
              user_uuid: customer.user_uuid,
              wallet: customer.wallet?.balance || 0,
              isBanned: customer.is_banned ? "Yes" : "No",
              status: customer.status ? "Active" : "Inactive",
              roles: customer.roles?.join(", ") || "N/A",
              createdAt: customer.created_at,
              cnic_image: customer.cnic_image,
              credit_card_image: customer.credit_card_image,
              address: customer.address,
            };
            setCurrentRowData(rowData);
            const rect = e.currentTarget.getBoundingClientRect();
            setMenuPosition({
              top: rect.bottom + window.scrollY,
              left: rect.left + window.scrollX,
            });
          }}
          className="text-pinkclr hover:text-pink-900 flex items-center justify-center h-8 w-8"
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
            setCurrentRowData({
              id: customer.id,
              uuid: customer.user_uuid,
              fullName: customer.full_name,
              email: customer.email,
              phoneNumber: customer.phone_number,
              wallet: customer.wallet?.balance || 0,
              isBanned: customer.is_banned ? "Yes" : "No",
              status: customer.status ? "Active" : "Inactive",
              roles: customer.roles?.join(", ") || "N/A",
              createdAt: customer.created_at,
            });
            setIsDeleteModalOpen(true);
          }}
          className="text-pinkclr hover:text-red-900 flex items-center justify-center h-8 w-8"
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
  }));

  const columns = [
    { key: "fullName", label: "Customer" },
    { key: "email", label: "Email" },
    { key: "phoneNumber", label: "Phone Number" },
    { key: "wallet", label: "Wallet Balance" },
    { key: "NoOrders", label: "No. Orders" },
    { key: "createdAt", label: "Date" },
    { key: "isBanned", label: "Is Banned", toggleable: true },
    { key: "status", label: "Status", toggleable: true },
    { key: "roles", label: "Roles" },
    { key: "actions", label: "Actions" },
  ];

  const handleDetailClick = (row) => {
    setSelectedCustomer(row);
    setIsCustomerDetail(true);
  };

  const handleBack = () => {
    setIsCustomerDetail(false);
    setSelectedCustomer(null);
    navigate("/customers");
  };

  const handleEmailSubmit = async (formData) => {
    if (!currentRowData || !currentRowData.uuid) {
      toast.error("Invalid customer data");
      return;
    }
    try {
      const emailData = {
        subject: formData.subject,
        body: formData.message,
        marketingType: 'email',
        userType: 'customer'
      };
      const response = await updateCustomer({
        path: `/customers/send-email/${currentRowData.uuid}`,
        method: "POST",
        body: emailData,
      }).unwrap();
      toast.success("Email sent successfully", { theme: "colored" });
      setIsEmailModalOpen(false);
    } catch (error) {
      toast.error(error?.data?.message || "Failed to send email", {
        theme: "colored",
      });
    }
  };

  const handlePinSubmit = (formData) => {
    console.log(formData);
  };

  const handlePasswordSubmit = (formData) => {
    console.log(formData);
  };

  const handleDepositSubmit = (data) => {
    console.log('Deposit data submitted:', data);
  };

  if (isCustomerDetail && selectedCustomer) {
    return (
      <CustomerDetail
        customer={selectedCustomer}
        onBack={handleBack}
      />
    );
  }

  return (
    <div className="mt-12 mb-8 flex bg-[#F2F7FB] flex-col gap-12 px-8">
      <DynamicTable
        data={customer || []}
        columns={columns}
        onSearch={(term) => {
          setSearchTerm(term);
          setCurrentPage(1);
        }}
        onRowClick={(row) => handleDetailClick(row)}
        isLoading={isLoading || isUpdating}
        currentPage={currentPage}
        totalItems={totalItems}
        itemsPerPage={itemsPerPage}
        onPageChange={setCurrentPage}
        tableTitle="All Customers"
        showAddButton={false}
      />

      {openActionMenu && (
        <div
          ref={actionMenuRef}
          className="fixed z-50 w-64 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
          style={{
            top: `${menuPosition.top}px`,
            left: `${menuPosition.left}px`,
          }}
        >
          <div className="py-1">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setOpenActionMenu(null);
                if (currentRowData?.uuid) {
                  setSelectedCustomer(currentRowData);
                  setIsCustomerDetail(true);
                } else {
                  toast.error("Unable to view customer details: Missing UUID");
                }
              }}
              className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-3 text-textclr"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                />
              </svg>
              Detail
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setOpenActionMenu(null);
                setIsEditModalOpen(true);
              }}
              className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-3 text-textclr"
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
              Edit
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setOpenActionMenu(null);
                setIsManageDepositOpen(true);
              }}
              className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-3 text-textclr"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              Manage Deposit
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setOpenActionMenu(null);
                setIsCustomerVerification(true);
              }}
              className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-3 text-textclr"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              Customer Verification
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setOpenActionMenu(null);
                setIsEmailModalOpen(true);
              }}
              className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-3 text-textclr"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
              Send Email
            </button>
            <button 
             className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
            //  onClick={(customer) => {
            //   setSelectedCustomer(customer);
            //   setUserCardModalOpen(true)
               
            //  }}
            onClick={() => navigate('/user-card')}
            >
               <UserRound size={20} className="mr-4 text-textclr"/>
               User Cards
            </button>
            
            <button
              onClick={(e) => {
                e.stopPropagation();
                setOpenActionMenu(null);
                setIsPasswordModalOpen(true);
              }}
              className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-3 text-textclr"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
                />
              </svg>
              Change Password
            </button>
          </div>
        </div>
      )}

      {isEditModalOpen && (
        <DynamicCustomerModal
          title="Edit Customer"
          fields={[
            { name: "fullName", label: "Full Name", type: "text" },
            { name: "email", label: "Email", type: "email" },
            { name: "phoneNumber", label: "Phone Number", type: "text" },
            { name: "password", label: "Password", type: "password" },
            { name: "confirmPassword", label: "Confirm Password", type: "password" },
            { name: "isBanned", label: "Ban User" },
            {
              name: "roles",
              label: "Role",
              options: [
                { value: "customer", label: "Customer" },
                { value: "admin", label: "Admin" },
              ],
            },
          ]}
          initialData={currentRowData}
          onSubmit={async (formData) => {
            if (!formData.uuid) return;
            try {
              const data = new FormData();
              data.append("full_name", formData.fullName);
              data.append("email", formData.email);
              data.append("phone_number", formData.phoneNumber);
              data.append("is_banned", formData.isBanned === "Yes" ? 1 : 0);
              data.append("status", formData.status === "Active" ? 1 : 0);
              if (formData.password) {
                data.append("password", formData.password);
                data.append("password_confirmation", formData.confirmPassword);
              }
              await updateCustomer({
                path: `/customers/${formData.uuid}?_method=patch`,
                method: "POST",
                body: data,
              }).unwrap();
              toast.success("Customer updated successfully", { theme: "colored" });
              setIsEditModalOpen(false);
              refetch();
            } catch (error) {
              toast.error(error?.data?.message || "Failed to update customer", {
                theme: "colored",
              });
            }
          }}
          onClose={() => {
            setIsEditModalOpen(false);
            if (editCustomerId) navigate("/customers");
          }}
          submitButtonText="Update"
        />
      )}

      <DeleteModal
        open={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onDelete={async () => {
          if (!currentRowData || !currentRowData.uuid) return;
          try {
            await deleteCustomer({
              path: `/customers/${currentRowData.uuid}`,
              method: "DELETE",
            }).unwrap();
            toast.success("Customer deleted successfully", { theme: "colored" });
            refetch();
          } catch (error) {
            toast.error(error?.data?.message || "Failed to delete customer", {
              theme: "colored",
            });
          }
          setIsDeleteModalOpen(false);
        }}
        rowData={currentRowData}
      />

      {isEmailModalOpen && (
        <DynamicCustomersModal
          modalType="email"
          title="Send Email"
          open={isEmailModalOpen}
          onClose={() => setIsEmailModalOpen(false)}
          onSubmit={handleEmailSubmit}
          customer={currentRowData}
        />
      )}

      {isPinModalOpen && (
        <DynamicCustomersModal
          modalType="pin"
          title="Change PIN"
          open={isPinModalOpen}
          onClose={() => setIsPinModalOpen(false)}
          onSubmit={handlePinSubmit}
          customer={currentRowData}
        />
      )}

      {isPasswordModalOpen && (
        <DynamicCustomersModal
          modalType="password"
          title="Change Password"
          open={isPasswordModalOpen}
          onClose={() => setIsPasswordModalOpen(false)}
          onSubmit={handlePasswordSubmit}
          customer={currentRowData}
        />
      )}

      {isManageDepositOpen && (
        <DynamicCustomersModal
          modalType="manageDeposit"
          title="Manage Deposit"
          open={isManageDepositOpen}
          onClose={() => setIsManageDepositOpen(false)}
          onSubmit={handleDepositSubmit}
          customer={currentRowData}
        />
      )}

      {isCustomerVerification && (
        <DynamicCustomersModal
          modalType="verification"
          title="Customer Verification"
          open={isCustomerVerification}
          onClose={() => setIsCustomerVerification(false)}
          onSubmit={(data) => console.log(data)}
          customer={currentRowData}
        />
      )}

      
    {userCardModalOpen && 
             <UserCard 
             isOpen={userCardModalOpen}
             onClose={() => setUserCardModalOpen(false)}
             customer={currentRowData}/>
            }
            
    </div>

  );
}

export default Customers;