import React, { useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { usePostMutation } from "@/services/apiService";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import headerImage from "../../assets/images/PRlogo.png"; // Your project logo
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

function ForgetPassword() {
  const [postMutation, { isLoading }] = usePostMutation();
  const { token } = useSelector((store) => store.auth);
  const navigate = useNavigate();

  const validate = (values) => {
    const errors = {};
    if (!values.email) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(values.email)) {
      errors.email = "Invalid email address";
    }
    return errors;
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const response = await postMutation({
        path: "/authentication/forgot-password",
        body: values,
        method: "POST",
      });

      // New response handling
      if (response?.data?.status === 1) {
        // Show success toast
        toast.success(response.data.message);
      } else {
        // Show error toast
        toast.error(
          response?.error?.data?.message || "Failed to send reset link."
        );
      }
    } catch (err) {
      // Show error toast
      toast.error(err?.data?.message || "An error occurred. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (!token) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <div className="w-full max-w-md bg-white shadow-lg rounded-lg overflow-hidden">
          {/* Header Section */}
          <div className="bg-teelclr py-8 px-8 flex flex-col items-center">
            <img src={headerImage} alt="Logo" className="h-24 w-auto mb-2" />
            <h2 className="text-3xl font-semibold text-white mb-2">Forgot Password</h2>
            <p className="text-white text-sm mb-4">Enter your email to receive a password reset link.</p>
          </div>

          {/* Form Section */}
          <Formik
            initialValues={{ email: "" }}
            validate={validate}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting }) => (
              <Form className="px-8 py-6">
                <div className="mb-1 flex flex-col gap-6">
                  <label className="font-medium text-teelclr-600" htmlFor="email">
                    Your Email
                  </label>
                  <Field
                    type="email"
                    name="email"
                    placeholder="name@gmail.com"
                    className="rounded-md border border-teelclr-300 p-2 focus:outline-none focus:ring-2 focus:ring-teelclr-500"
                  />
                  <ErrorMessage
                    name="email"
                    component="div"
                    className="text-sm text-red-600"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting || isLoading}
                  className="mt-6 w-full rounded-md bg-teelclr-500 py-2 text-white hover:bg-teelclr-600"
                >
                  {isLoading ? "Sending..." : "Send Reset Link"}
                </button>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    );
  }
}

export default ForgetPassword;
