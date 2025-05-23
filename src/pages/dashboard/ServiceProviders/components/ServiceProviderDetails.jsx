import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useGetQuery } from "@/services/apiService";

export function ServiceProviderDetails() {
  const { uuid } = useParams();
  const navigate = useNavigate();
  const [serviceProvider, setServiceProvider] = useState(null);

  // Try to get from localStorage first (for immediate display)
  useEffect(() => {
    const storedProvider = localStorage.getItem('selectedServiceProvider');
    if (storedProvider) {
      setServiceProvider(JSON.parse(storedProvider));
    }
  }, []);

  // Then fetch fresh data from API
  const { data, isLoading } = useGetQuery({
    path: `/service-provider/${uuid}`,
    skip: !uuid
  });

  useEffect(() => {
    if (data?.data) {
      setServiceProvider(data.data);
    }
  }, [data]);

  if (isLoading) {
    return <div className="container mx-auto py-8 text-center">Loading...</div>;
  }

  if (!serviceProvider) {
    return <div className="container mx-auto py-8 text-center">Service provider not found</div>;
  }

  return (
    <div className="container mx-auto py-20">
      <div className="bg-white rounded-lg shadow-md p-6 pl-12"> {/* Increased left padding from pl-8 to pl-12 */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-pinkclr">Business Details</h1>
          <button 
            onClick={() => navigate(-1)} 
            className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
          >
            Back
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-center justify-center mb-6">
              {serviceProvider.logo ? (
                <img 
                  src={serviceProvider.logo} 
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
              <h2 className="text-xl font-semibold text-pinkclr mb-4">Basic Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-600">Business Name</p>
                  <p className="font-medium">{serviceProvider.name}</p>
                </div>
                <div>
                  <p className="text-gray-600">Email</p>
                  <p className="font-medium">{serviceProvider.email}</p>
                </div>
                <div>
                  <p className="text-gray-600">Phone Number</p>
                  <p className="font-medium">{serviceProvider.phoneNumber}</p>
                </div>
                <div>
                  <p className="text-gray-600">Legal Structure</p>
                  <p className="font-medium">{serviceProvider.legalStructure}</p>
                </div>
                <div>
                  <p className="text-gray-600">Year Established</p>
                  <p className="font-medium">{serviceProvider.yearEstablished}</p>
                </div>
                <div>
                  <p className="text-gray-600">Registration Number</p>
                  <p className="font-medium">{serviceProvider.registrationNumber}</p>
                </div>
                <div>
                  <p className="text-gray-600">Tax ID</p>
                  <p className="font-medium">{serviceProvider.taxId}</p>
                </div>
                <div>
                  <p className="text-gray-600">Average Turnaround Time</p>
                  <p className="font-medium">{serviceProvider.turnaroundTime}</p>
                </div>
              </div>
            </div>
            
            <div className="border-t pt-4">
              <h2 className="text-xl font-semibold text-pinkclr mb-4">Address</h2>
              <p>{serviceProvider.address}</p>
              {serviceProvider.latitude && serviceProvider.longitude && (
                <div className="mt-2">
                  <p>
                    <span className="text-gray-600">Coordinates: </span>
                    {serviceProvider.latitude}, {serviceProvider.longitude}
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <div className="border-t pt-4 md:border-t-0 md:pt-0">
              <h2 className="text-xl font-semibold text-pinkclr mb-4">Business Details</h2>
              <div className="space-y-3">
                <div>
                  <p className="text-gray-600">Specialization</p>
                  <p className="font-medium">{serviceProvider.specialization}</p>
                </div>
                <div>
                  <p className="text-gray-600">Services Offered</p>
                  <p className="font-medium">{serviceProvider.servicesOffered || "Not specified"}</p>
                </div>
                <div>
                  <p className="text-gray-600">Production Capacity</p>
                  <p className="font-medium">{serviceProvider.productionCapacity || "Not specified"}</p>
                </div>
                <div>
                  <p className="text-gray-600">Target Market</p>
                  <p className="font-medium">{serviceProvider.targetMarket || "Not specified"}</p>
                </div>
                <div>
                  <p className="text-gray-600">Website</p>
                  <p className="font-medium">
                    {serviceProvider.websiteUrl ? (
                      <a href={serviceProvider.websiteUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                        {serviceProvider.websiteUrl}
                      </a>
                    ) : (
                      "Not specified"
                    )}
                  </p>
                </div>
              </div>
            </div>

            <div className="border-t pt-4">
              <h2 className="text-xl font-semibold text-pinkclr mb-4">Business Documents</h2>
              <div className="space-y-3">
                <div>
                  <p className="text-gray-600">Portfolio</p>
                  {serviceProvider.portfolio ? (
                    <a href={serviceProvider.portfolio} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                      View Portfolio
                    </a>
                  ) : (
                    <p>Not available</p>
                  )}
                </div>
                <div>
                  <p className="text-gray-600">Proof of Business Registration</p>
                  {serviceProvider.proofOfRegistration ? (
                    <a href={serviceProvider.proofOfRegistration} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                      View Document
                    </a>
                  ) : (
                    <p>Not available</p>
                  )}
                </div>
                <div>
                  <p className="text-gray-600">Verification Document</p>
                  {serviceProvider.verificationDocument ? (
                    <a href={serviceProvider.verificationDocument} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                      View Document
                    </a>
                  ) : (
                    <p>Not available</p>
                  )}
                </div>
              </div>
            </div>

            <div className="border-t pt-4">
              <h2 className="text-xl font-semibold text-pinkclr mb-4">Social Media</h2>
              <div className="space-y-3">
                <div>
                  <p className="text-gray-600">Facebook</p>
                  <p className="font-medium">
                    {serviceProvider.facebookLink ? (
                      <a href={serviceProvider.facebookLink} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                        {serviceProvider.facebookLink}
                      </a>
                    ) : (
                      "Not available"
                    )}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600">Instagram</p>
                  <p className="font-medium">
                    {serviceProvider.instagramLink ? (
                      <a href={serviceProvider.instagramLink} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                        {serviceProvider.instagramLink}
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
      </div>
    </div>
  );
}

export default ServiceProviderDetails;