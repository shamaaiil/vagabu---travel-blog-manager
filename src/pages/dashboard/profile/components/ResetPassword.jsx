import React, { useState } from "react";
import { usePostMutation } from "@/services/apiService"; // آپ کا RTK query سروس
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ResetPassword = () => {
  const [postMutation, { isLoading }] = usePostMutation();
  
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match!");
      return;
    }

    try {
      const response = await postMutation({
        path: "/authentication/forgot-password", 
        body: {
          email: email,
          new_password: newPassword,
          password_confirmation: confirmPassword,
        },
        method: "POST",
      });

      if (response?.data?.message) {
        toast.success("Password reset successfully!");
      } else {
        toast.error(
          response?.error?.data?.message || "Failed to reset password."
        );
      }
    } catch (err) {
      toast.error("An error occurred. Please try again.");
    }
  };

  return (
    <div className="max-w-7xl mx-8 px-8 py-6 bg-white  rounded-lg mt-12 ">
      <ToastContainer />
      <h2 className="text-pink-600 text-lg font-semibold mb-4 border-b pb-2">Reset Password</h2>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email:</label>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">New Password:</label>
          <input
            type="password"
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Re-Type New Password:</label>
          <input
            type="password"
            placeholder="Re-Type New Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="md:col-span-3 flex justify-center mt-4">
          <button
            type="submit"
            disabled={isLoading}
            className="bg-teal-500 hover:bg-teal-600 text-white px-6 py-2 rounded-full shadow-md transition duration-200"
          >
            {isLoading ? "Saving..." : "Save"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ResetPassword;
