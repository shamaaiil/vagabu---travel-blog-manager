import { useState, useEffect } from "react";
import DynamicTable from "@/ui/DynamicTable";
import { useGetQuery } from "@/services/apiService";

export function ServiceProviders() {
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState(null);
  const itemsPerPage = 10; // Changed from 15 to 10 as requested

  // Updated API endpoint with pagination parameters
  const { data, isLoading, refetch } = useGetQuery({
    path: `/service-provider?per_page=${itemsPerPage}&page=${currentPage}${searchTerm ? `&search=${searchTerm}` : ""}`,
  });

  // Refetch when page or search term changes
  useEffect(() => {
    refetch();
  }, [currentPage, searchTerm, refetch]);

  useEffect(() => {
    if (data) {
      // Extract total items from pagination metadata
      if (data.pagination) {
        setTotalItems(data.pagination.total);
      } else if (data.meta?.pagination) {
        setTotalItems(data.meta.pagination.total);
      } else if (data.meta) {
        setTotalItems(data.meta.total);
      } else {
        setTotalItems(data.total || data.data.length);
      }
    }
  }, [data]);

  // Format data for the table
  const serviceProviders = data?.data?.map((provider) => {
    return {
      id: provider.id,
      // Show user information instead of business information in the table
      name: provider.user?.full_name || "N/A",
      email: provider.user?.email || "N/A",
      phoneNumber: provider.user?.user_phone_number || "N/A",
      specialization: provider.specialization,
      legalStructure: provider.legal_structure,
      turnaroundTime: provider.average_turnaround_time,
      logo: provider.logo ? (
        <img
          src={provider.logo}
          alt="Logo"
          className="h-10 w-10 object-cover rounded"
        />
      ) : (
        "No Logo"
      ),
      actions: (
        <button
          onClick={() => handleViewDetails(provider)}
          className="bg-teelclr hover:bg-teelclr text-white px-3 py-1 rounded text-sm"
        >
          View Details
        </button>
      ),
      // Store all provider data for modal
      fullData: provider,
    };
  });

  const columns = [
    { key: "name", label: "User Name" },
    { key: "email", label: "User Email" },
    { key: "phoneNumber", label: "User Phone Number" },
    { key: "specialization", label: "Specialization" },
    { key: "legalStructure", label: "Legal Structure" },
    { key: "turnaroundTime", label: "Turnaround Time" },
    { key: "logo", label: "Logo" },
    { key: "actions", label: "Actions" },
  ];

  const handleViewDetails = (provider) => {
    setSelectedProvider(provider);
    setShowModal(true);
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
    setCurrentPage(1); // Reset to page 1 on new search
  };

  // Custom modal component
  const Modal = ({ isOpen, onClose, title, children }) => {
    if (!isOpen) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
        <div className="bg-white rounded-lg shadow-xl max-w-5xl w-full max-h-[90vh] overflow-y-auto">
          <div className="flex justify-between items-center border-b p-4">
            <h3 className="text-xl font-semibold">{title}</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                ></path>
              </svg>
            </button>
          </div>
          <div className="p-4">{children}</div>
        </div>
      </div>
    );
  };

  return (
    <div className="mt-12 mb-8 flex bg-[#F2F7FB] flex-col gap-12 px-8">
      <DynamicTable
        data={serviceProviders}
        columns={columns}
        onSearch={handleSearch}
        isLoading={isLoading}
        currentPage={currentPage}
        totalItems={totalItems}
        itemsPerPage={itemsPerPage}
        onPageChange={handlePageChange}
        tableTitle="All Service Providers"
        showAddButton={false}
      />

      {showModal && selectedProvider && (
        <Modal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          title="Business Details"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center justify-center mb-6">
                {selectedProvider.logo ? (
                  <img
                    src={selectedProvider.logo}
                    alt="Business Logo"
                    className="h-32 w-32 object-cover rounded-lg"
                  />
                ) : (
                  <div className="h-32 w-32 bg-gray-200 flex items-center justify-center rounded-lg">
                    <span>No Logo</span>
                  </div>
                )}
              </div>

              <div className="border-t pt-4">
                <h2 className="text-xl font-semibold mb-4">
                  Basic Information
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-gray-600">Business Name</p>
                    <p className="font-medium">
                      {selectedProvider.service_provider_name}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600">Email</p>
                    <p className="font-medium">
                      {selectedProvider.service_provider_email}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600">Phone Number</p>
                    <p className="font-medium">
                      {selectedProvider.service_provider_phone_number}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600">Legal Structure</p>
                    <p className="font-medium">
                      {selectedProvider.legal_structure}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600">Year Established</p>
                    <p className="font-medium">
                      {selectedProvider.year_established}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600">Registration Number</p>
                    <p className="font-medium">
                      {selectedProvider.registration_number}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600">Tax ID</p>
                    <p className="font-medium">
                      {selectedProvider.tax_identification_number}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600">Turnaround Time</p>
                    <p className="font-medium">
                      {selectedProvider.average_turnaround_time}
                    </p>
                  </div>
                </div>
              </div>

              <div className="border-t pt-4">
                <h2 className="text-xl font-semibold mb-4">Address</h2>
                <p>{selectedProvider.address}</p>
                {selectedProvider.latitude && selectedProvider.longitude && (
                  <div className="mt-2">
                    <p>
                      <span className="text-gray-600">Coordinates: </span>
                      {selectedProvider.latitude}, {selectedProvider.longitude}
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <div className="border-t pt-4 md:border-t-0 md:pt-0">
                <h2 className="text-xl font-semibold mb-4">Business Details</h2>
                <div className="space-y-3">
                  <div>
                    <p className="text-gray-600">Specialization</p>
                    <p className="font-medium">
                      {selectedProvider.specialization}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600">Services Offered</p>
                    <p className="font-medium">
                      {selectedProvider.services_offered?.join(", ") ||
                        "Not specified"}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600">Production Capacity</p>
                    <p className="font-medium">
                      {selectedProvider.production_capacity || "Not specified"}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600">Target Market</p>
                    <p className="font-medium">
                      {selectedProvider.target_market || "Not specified"}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600">Website</p>
                    <p className="font-medium">
                      {selectedProvider.website_url ? (
                        <a
                          href={selectedProvider.website_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          {selectedProvider.website_url}
                        </a>
                      ) : (
                        "Not specified"
                      )}
                    </p>
                  </div>
                </div>
              </div>

              <div className="border-t pt-4">
                <h2 className="text-xl font-semibold mb-4">User Information</h2>
                <div className="space-y-3">
                  <div>
                    <p className="text-gray-600">Full Name</p>
                    <p className="font-medium">
                      {selectedProvider.user?.full_name || "Not specified"}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600">Email</p>
                    <p className="font-medium">
                      {selectedProvider.user?.email || "Not specified"}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600">Phone Number</p>
                    <p className="font-medium">
                      {selectedProvider.user?.user_phone_number ||
                        "Not specified"}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600">LinkedIn</p>
                    <p className="font-medium">
                      {selectedProvider.user?.linkedin_link ? (
                        <a
                          href={selectedProvider.user.linkedin_link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          {selectedProvider.user.linkedin_link}
                        </a>
                      ) : (
                        "Not available"
                      )}
                    </p>
                  </div>
                </div>
              </div>

              <div className="border-t pt-4">
                <h2 className="text-xl font-semibold mb-4">
                  Business Documents
                </h2>
                <div className="space-y-3">
                  <div>
                    <p className="text-gray-600">Portfolio</p>
                    {selectedProvider.portfolio ? (
                      <a
                        href={selectedProvider.portfolio}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        View Portfolio
                      </a>
                    ) : (
                      <p>Not available</p>
                    )}
                  </div>
                  <div>
                    <p className="text-gray-600">
                      Proof of Business Registration
                    </p>
                    {selectedProvider.proof_of_business_registration ? (
                      <a
                        href={selectedProvider.proof_of_business_registration}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        View Document
                      </a>
                    ) : (
                      <p>Not available</p>
                    )}
                  </div>
                  <div>
                    <p className="text-gray-600">Verification Document</p>
                    {selectedProvider.verification_document ? (
                      <a
                        href={selectedProvider.verification_document}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        View Document
                      </a>
                    ) : (
                      <p>Not available</p>
                    )}
                  </div>
                </div>
              </div>

              <div className="border-t pt-4">
                <h2 className="text-xl font-semibold mb-4">Social Media</h2>
                <div className="space-y-3">
                  <div>
                    <p className="text-gray-600">Facebook</p>
                    <p className="font-medium">
                      {selectedProvider.facebook_link ? (
                        <a
                          href={selectedProvider.facebook_link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          {selectedProvider.facebook_link}
                        </a>
                      ) : (
                        "Not available"
                      )}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600">Instagram</p>
                    <p className="font-medium">
                      {selectedProvider.instagram_link ? (
                        <a
                          href={selectedProvider.instagram_link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          {selectedProvider.instagram_link}
                        </a>
                      ) : (
                        "Not available"
                      )}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="flex justify-end mt-6 border-t pt-4">
            <button
              onClick={() => setShowModal(false)}
              className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
            >
              Close
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}

export default ServiceProviders;
