import { useState, useEffect } from "react";
import { X, Search } from "lucide-react";
import CustomInput from "@/components/common/CustomInput";

const DynamicCustomersModal = ({
  // Basic props
  title = "Modal",
  open = false,
  onClose,
  onSubmit,
  customer = {},

  // Props for standard form
  fields = [],
  initialData = {},
  submitButtonText = "Submit",

  // Modal type control
  modalType = "standard", // standard, email, pin, password, verification, loginHistory, manageDeposit
}) => {
  // Form state management
  const [formData, setFormData] = useState({});
  // State for specific modal types
  const [details, setDetails] = useState("");
  const [pin, setPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [email, setEmail] = useState(customer.email || initialData.email || "");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [depositAmount, setDepositAmount] = useState("");
  const [walletDetails, setWalletDetails] = useState("");
  const [selectedAction, setSelectedAction] = useState("Add");

  // Mock login history data
  const loginHistory = [
    {
      date: "Apr-26-2024/10:25 AM",
      location: "United States-Chicago 60606",
      ip: "162.158.187.143",
    },
    {
      date: "Apr-26-2024/10:25 AM",
      location: "United States-Chicago 60606",
      ip: "162.158.187.143",
    },
    {
      date: "Apr-26-2024/10:25 AM",
      location: "United States-Chicago 60606",
      ip: "162.158.187.143",
    },
    {
      date: "Apr-26-2024/10:25 AM",
      location: "United States-Chicago 60606",
      ip: "162.158.187.143",
    },
    {
      date: "Apr-26-2024/10:25 AM",
      location: "United States-Chicago 60606",
      ip: "162.158.187.143",
    },
    {
      date: "Apr-26-2024/10:25 AM",
      location: "United States-Chicago 60606",
      ip: "162.158.187.143",
    },
    {
      date: "Apr-26-2024/10:25 AM",
      location: "United States-Chicago 60606",
      ip: "162.158.187.143",
    },
    {
      date: "Apr-26-2024/10:25 AM",
      location: "United States-Chicago 60606",
      ip: "162.158.187.143",
    },
    {
      date: "Apr-26-2024/10:25 AM",
      location: "United States-Chicago 60606",
      ip: "162.158.187.143",
    },
    {
      date: "Apr-26-2024/10:25 AM",
      location: "United States-Chicago 60606",
      ip: "162.158.187.143",
    },
  ];

  // Initialize form data from props
  useEffect(() => {
    if (initialData && Object.keys(initialData).length > 0) {
      setFormData({ ...initialData });
    }
  }, [initialData]);

  // Reset form fields on modal close
  useEffect(() => {
    if (!open) {
      setFormData({});
      setDetails("");
      setPin("");
      setConfirmPin("");
      setPassword("");
      setConfirmPassword("");
      setSubject("");
      setMessage("");
      setSearchTerm("");
      setDepositAmount("");
      setWalletDetails("");
      setSelectedAction("Add");
    }
  }, [open]);

  // Handle standard form field changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    let submissionData = { ...formData };

    // Add special fields based on modal type
    switch (modalType) {
      case "standard":
        // Standard form already captured in formData
        break;
      case "verification":
        submissionData = { ...submissionData, details };
        break;
      case "email":
        submissionData = {
          email,
          subject,
          message,
          customerUuid: customer.uuid || initialData.uuid,
          user_id: customer.id || initialData.id,
        };
        break;
      case "pin":
        if (pin !== confirmPin) {
          alert("PINs do not match");
          return;
        }
        submissionData = {
          pin,
          confirmPin,
          customerUuid: customer.uuid || initialData.uuid,
          user_id: customer.id || initialData.id,
        };
        break;
      case "password":
        if (password !== confirmPassword) {
          alert("Passwords do not match");
          return;
        }
        submissionData = {
          password,
          confirmPassword,
          customerUuid: customer.uuid || initialData.uuid,
          user_id: customer.id || initialData.id,
        };
        break;
      case "manageDeposit":
        submissionData = {
          amount: depositAmount,
          details: walletDetails,
          action: selectedAction,
          customerUuid: customer.uuid || initialData.uuid,
          user_id: customer.id || initialData.id,
        };
        break;
      default:
        break;
    }

    onSubmit(submissionData);

    // Close modal if needed
    if (onClose) {
      onClose();
    }
  };

  if (!open) return null;

  // Helper function to render different modal content based on type
  const renderModalContent = () => {
    switch (modalType) {
      case "standard":
        return (
          <form onSubmit={handleSubmit} className="space-y-4">
            {fields?.map((field) => (
              <div key={field.name} className="mb-4">
                <label
                  htmlFor={field.name}
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  {field.label}
                </label>

                {field.type === "select" || field.options ? (
                  <select
                    id={field.name}
                    name={field.name}
                    value={formData[field.name] || ""}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="">Select {field.label}</option>
                    {field.options?.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                ) : field.type === "checkbox" ? (
                  <div className="flex items-center">
                    <input
                      id={field.name}
                      name={field.name}
                      type="checkbox"
                      checked={formData[field.name] || false}
                      onChange={handleInputChange}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    />
                    <label
                      htmlFor={field.name}
                      className="ml-2 text-sm text-gray-700"
                    >
                      {field.checkboxLabel || field.label}
                    </label>
                  </div>
                ) : field.type === "textarea" ? (
                  <textarea
                    id={field.name}
                    name={field.name}
                    value={formData[field.name] || ""}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    rows={4}
                  ></textarea>
                ) : (
                  <input
                    id={field.name}
                    name={field.name}
                    type={field.type || "text"}
                    value={formData[field.name] || ""}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  />
                )}
              </div>
            ))}

            <div className="flex justify-end pt-4">
              <button
                type="button"
                onClick={onClose}
                className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md mr-2 hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-teal-500 text-white px-4 py-2 rounded-md hover:bg-teal-600"
              >
                {submitButtonText}
              </button>
            </div>
          </form>
        );

      case "verification":
        return (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="mb-4">
              <h3 className="font-medium text-lg">Details</h3>
              <textarea
                className="w-full border rounded-md p-2 mt-2"
                placeholder="Write Details..."
                rows={4}
                value={details}
                onChange={(e) => setDetails(e.target.value)}
              />
            </div>
            <div className="flex justify-center mt-6">
              <button
                type="submit"
                className="bg-teal-500 hover:bg-teal-600 text-white font-medium py-2 px-6 rounded-md"
              >
                Save
              </button>
            </div>
          </form>
        );

      case "loginHistory":
        return (
          <>
            <div className="flex justify-end mb-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search here..."
                  className="border rounded-md pl-8 pr-4 py-1"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              </div>
            </div>
            <div className="overflow-y-auto max-h-96">
              <table className="w-full text-left">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="py-3 px-4 text-sm font-medium text-gray-600">
                      Date & Time
                    </th>
                    <th className="py-3 px-4 text-sm font-medium text-gray-600">
                      Location
                    </th>
                    <th className="py-3 px-4 text-sm font-medium text-gray-600">
                      IP Address
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {loginHistory
                    .filter(
                      (entry) =>
                        entry.date
                          .toLowerCase()
                          .includes(searchTerm.toLowerCase()) ||
                        entry.location
                          .toLowerCase()
                          .includes(searchTerm.toLowerCase()) ||
                        entry.ip
                          .toLowerCase()
                          .includes(searchTerm.toLowerCase()),
                    )
                    .map((entry, index) => (
                      <tr key={index} className="border-t">
                        <td className="py-3 px-4 text-sm text-indigo-700">
                          {entry.date}
                        </td>
                        <td className="py-3 px-4 text-sm">{entry.location}</td>
                        <td className="py-3 px-4 text-sm">{entry.ip}</td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
            <div className="flex justify-end mt-4">
              <button
                type="button"
                onClick={onClose}
                className="bg-teal-500 hover:bg-teal-600 text-white font-medium py-2 px-6 rounded-md"
              >
                Close
              </button>
            </div>
          </>
        );

      case "pin":
        return (
          <form onSubmit={handleSubmit} className="space-y-4">
            <p className="text-center text-sm mb-6">
              This pin will be used for verification with customer service
              replies and also before customer can place an order it requires
              you to enter a pin to prevent scam.
            </p>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <label className="block mb-2 text-sm font-medium text-indigo-700">
                  Enter Pin
                </label>
                <input
                  type="password"
                  className="w-full border rounded-md p-3"
                  placeholder="Enter PIN"
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                />
              </div>
              <div className="flex-1">
                <label className="block mb-2 text-sm font-medium text-indigo-700">
                  Confirm PIN
                </label>
                <input
                  type="password"
                  className="w-full border rounded-md p-3"
                  placeholder="Confirm PIN"
                  value={confirmPin}
                  onChange={(e) => setConfirmPin(e.target.value)}
                />
              </div>
            </div>
            <div className="flex justify-end mt-6">
              <button
                type="button"
                onClick={onClose}
                className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md mr-2 hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-teal-500 hover:bg-teal-600 text-white font-medium py-2 px-6 rounded-md"
              >
                Submit
              </button>
            </div>
          </form>
        );

      case "password":
        return (
          <form onSubmit={handleSubmit} className="space-y-4">
            <p className="text-center text-sm mb-6">
              This password will be used for verification with customer service
              replies and also before customer can place an order it requires
              you to enter a password to prevent scam.
            </p>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <label className="block mb-2 text-sm font-medium text-indigo-700">
                  Enter Password
                </label>
                <input
                  type="password"
                  className="w-full border rounded-md p-3"
                  placeholder="Enter Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div className="flex-1">
                <label className="block mb-2 text-sm font-medium text-indigo-700">
                  Confirm Password
                </label>
                <input
                  type="password"
                  className="w-full border rounded-md p-3"
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
            </div>
            <div className="flex justify-end mt-6">
              <button
                type="button"
                onClick={onClose}
                className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md mr-2 hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-teal-500 hover:bg-teal-600 text-white font-medium py-2 px-6 rounded-md"
              >
                Submit
              </button>
            </div>
          </form>
        );

      case "email":
        return (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <input
                type="email"
                className="w-full border rounded-md p-3"
                placeholder="example@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <input
                type="text"
                className="w-full border rounded-md p-3"
                placeholder="Subject*"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
              />
            </div>
            <div>
              <textarea
                className="w-full border rounded-md p-3"
                placeholder="Your Message*"
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
            </div>
            <div className="flex justify-center mt-6">
              <button
                type="submit"
                className="bg-teelclr hover:bg-teal-600 text-white font-medium py-2 px-6 w-1/2 rounded-xl  "
              >
                Send Email
              </button>
            </div>
          </form>
        );

      case "manageDeposit":
        return (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-pinkclr text-center mb-6">
                Wallet
              </h2>
              <hr className="border-t border-gray-200" />
            </div>

            <div className="grid grid-cols-1 gap-4">
              <div className="col-span-1">
                <h3 className="text-gray-800 font-normal mb-2 text-2xl">
                  Current Balance
                </h3>
                <h2 className="text-2xl font-semibold">
                  $
                  {customer?.wallet?.toLocaleString("en-US", {
                    // minimumFractionDigits: 2,
                    // maximumFractionDigits: 2,
                  })}
                </h2>{" "}
              </div>

              <div className="col-span-1">
                <h3 className="text-gray-800 font-medium mb-2 text-2xl">
                  Add Amount
                </h3>
                <input
                  type="text"
                  className="w-full border rounded-lg p-2"
                  placeholder="Write amount..."
                  value={depositAmount}
                  onChange={(e) => setDepositAmount(e.target.value)}
                />
              </div>
            </div>

            <div className="mt-8  flex justify-end gap-3">
              <button
                type="submit"
                className="bg-teelclr mt-10 hover:bg-teal-600 text-white font-medium py-2 px-6 rounded-lg"
              >
                Submit
              </button>
              <button
                type="button"
                onClick={onClose}
                className="bg-teelclr hover:bg-teal-600 mt-10 text-white font-medium py-2 px-10 rounded-lg"
              >
                Close
              </button>
            </div>
          </form>
        );

      default:
        return <p>Unknown modal type</p>;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center overflow-y-auto px-2 sm:px-4">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-sm sm:max-w-md md:max-w-2xl mx-auto relative">
        {modalType !== "manageDeposit" && (
          <div className="px-4 sm:px-6 py-4 border-b rounded-xl flex justify-between items-center sticky top-0 bg-white z-10">
            <h2 className="text-lg sm:text-xl font-medium text-center text-pink-500 flex-1">
              {title}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 absolute top-2 right-2 sm:static"
            >
              <X size={20} />
            </button>
          </div>
        )}
        <div className="p-4 sm:p-6 max-h-[90vh] overflow-y-auto ">
          {renderModalContent()}
        </div>
      </div>
    </div>
  );
};

export default DynamicCustomersModal;
