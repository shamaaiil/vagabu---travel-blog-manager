import { useState } from "react";
import { usePostMutation } from "@/services/apiService";
import { toast } from "react-toastify";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const Sms = () => {
  const [userType, setUserType] = useState("");
  const [smsSubject, setSmsSubject] = useState("");
  const [smsBody, setSmsBody] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });

  // Use the same postMutation hook as in Email and Customers components
  const [sendSms, { isLoading: isSending }] = usePostMutation();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form fields
    if (!userType || !smsSubject || !smsBody) {
      setMessage({
        text: "Please fill all required fields",
        type: "error",
      });
      return;
    }

    // Prepare data for API
    const smsData = {
      marketingType: "sms",
      userType: userType,
      subject: smsSubject,
      body: smsBody,
    };

    setIsLoading(true);
    setMessage({ text: "", type: "" });

    try {
      // Send request using the usePostMutation hook
      const res = await sendSms({
        path: "admin/marketing/send",
        method: "POST",
        body: smsData,
      });

      if (!res.error) {
        // Handle successful response
        toast.success("SMS sent successfully!", { theme: "colored" });
        setMessage({
          text: "SMS sent successfully!",
          type: "success",
        });

        // Reset form fields after successful submission
        setUserType("");
        setSmsSubject("");
        setSmsBody("");
      } else {
        // Handle error from API
        const errorMessage =
          res.error?.data?.message || "Failed to send SMS. Please try again.";
        toast.error(errorMessage, { theme: "colored" });
        setMessage({
          text: errorMessage,
          type: "error",
        });
      }
    } catch (error) {
      // Handle unexpected errors
      const errorMessage = "An unexpected error occurred while sending SMS";
      toast.error(errorMessage, { theme: "colored" });
      setMessage({
        text: errorMessage,
        type: "error",
      });
      console.error("Error sending SMS:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuillChange = (value) => {
    setEmailForm((prev) => ({
      ...prev,
      message: value, // Update the message field with Quill's value
    }));
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 w-[95%] mx-auto mt-6 min-h-[500px]">
      <h1 className="text-pinkclr text-xl font-bold mb-6">Group SMS</h1>
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-gray-700 mb-2">
              Select User Type <span className="text-red-500">*</span>
            </label>
            <select
              id="userType"
              value={userType}
              onChange={(e) => setUserType(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-3 focus:outline-none focus:ring-2 focus:ring-teal-500"
              required
            >
              <option value="">Select User Type</option>
              <option value="admin">Admin</option>
              <option value="customer">Customer</option>
              <option value="vendor">Vendor</option>
            </select>
          </div>

          <div>
            <label htmlFor="smsSubject" className="block text-gray-700 mb-2">
              SMS Subject <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="smsSubject"
              value={smsSubject}
              onChange={(e) => setSmsSubject(e.target.value)}
              placeholder="SMS Subject"
              className="w-full border border-gray-300 rounded-md px-3 py-3 focus:outline-none focus:ring-2 focus:ring-teal-500"
              required
            />
          </div>
        </div>

        <div className="w-full px-4">
          <ReactQuill
            value={smsBody}
            onChange={handleQuillChange}
            placeholder="Enter your message"
            className="w-full mt-1  border rounded-md text-sm sm:text-base"
            modules={{
              toolbar: [
                [{ header: "1" }, { header: "2" }, { font: [] }],
                [{ list: "ordered" }, { list: "bullet" }],
                ["bold", "italic", "underline"],
                [{ align: [] }],
                ["link"],
              ],
            }}
          />
        </div>

        <div className="flex justify-center mt-4 py-10">
          <button
            type="submit"
            className="bg-teelclr text-white font-medium px-6 py-2 rounded-md transition-colors"
            disabled={isLoading}
          >
            {isLoading ? "Sending..." : "Send SMS"}
          </button>
        </div>

        {message.text && (
          <div
            className={`mt-4 text-center ${message.type === "error" ? "text-red-500" : "text-green-500"}`}
          >
            {message.text}
          </div>
        )}
      </form>
    </div>
  );
};

export default Sms;
