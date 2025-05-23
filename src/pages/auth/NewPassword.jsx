import React, { useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { usePostMutation } from "@/services/apiService";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import headerImage from "../../assets/images/header-image2.jpg";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";

function NewPassword() {
  const [postMutation, { isLoading }] = usePostMutation();
  const { token } = useSelector((store) => store.auth);
  const navigate = useNavigate();
  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);
  const urlToken = queryParams.get("token");

  const validate = (values) => {
    const errors = {};

    if (!values.email) {
      errors.email = "Email is required";
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)) {
      errors.email = "Invalid email address";
    }

    if (!values.newPassword) {
      errors.newPassword = "New password is required";
    } else if (values.newPassword.length < 8) {
      errors.newPassword = "Password must be at least 8 characters";
    }

    if (!values.confirmPassword) {
      errors.confirmPassword = "Confirm password is required";
    } else if (values.confirmPassword !== values.newPassword) {
      errors.confirmPassword = "Passwords do not match";
    }

    return errors;
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const response = await postMutation({
        path: "/auth/reset-password",
        body: {
          email: values.email,
          password: values.newPassword,
          password_confirmation: values.confirmPassword,
          token: urlToken,
        },
        method: "POST",
      });

      if (response?.data?.message) {
        await toast.success("Password reset successful!");
        navigate("/auth/sign-in");
      } else {
        toast.error(
          response?.error?.data?.message || "Failed to reset password.",
        );
      }
    } catch (err) {
      toast.error(err?.data?.message || "An error occurred. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };
  useEffect(() => {
    if (!urlToken) {
      navigate("/auth/sign-in");
    }
  }, []);

  // Redirect if already logged in
  useEffect(() => {
    if (token) {
      navigate("/");
    }
  }, [token, navigate]);

  if (!token && urlToken) {
    return (
      <section className=" flex flex-col-reverse lg:flex-row p-8 items-center  w-[85%] mx-auto">
        <ToastContainer />
        {/* Left Section: Image */}
        <div className="w-2/5 hidden lg:block">
          <div
            className="w-full h-[90dvh] bg-cover bg-center rounded-2xl"
            style={{ backgroundImage: `url(${headerImage})` }}
          ></div>
        </div>

        {/* Right Section: Form */}
        <div className="w-auto lg:w-3/5">
          <div className="text-center">
            <h2 className="font-bold mb-4 text-2xl">Set New Password</h2>
            <p className="text-lg text-teelclr-600">
              Enter your email, new password, and confirm it to reset your
              password.
            </p>
          </div>

          <Formik
            initialValues={{
              email: "",
              newPassword: "",
              confirmPassword: "",
            }}
            validate={validate}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting }) => (
              <Form className="mt-8 mb-2 mx-auto w-80 max-w-screen-lg lg:w-1/2">
                {/* Email Field */}
                <div className="mb-1 flex flex-col gap-6">
                  <label
                    className="font-medium  mb-0 text-teelclr-600"
                    htmlFor="email"
                  >
                    Email
                  </label>
                  <Field
                    type="email"
                    name="email"
                    placeholder="Enter your email"
                    className="rounded-md border border-teelclr-300 p-2 focus:outline-none focus:ring-2 focus:ring-teelclr-500"
                  />
                  <ErrorMessage
                    name="email"
                    component="div"
                    className="text-sm text-red-600"
                  />
                </div>

                {/* New Password Field */}
                <div className="mb-1 flex flex-col gap-6">
                  <label
                    className="font-medium  text-teelclr-600"
                    htmlFor="newPassword"
                  >
                    New Password
                  </label>
                  <Field
                    type="password"
                    name="newPassword"
                    placeholder="Enter your new password"
                    className="rounded-md border border-teelclr-300 p-2 focus:outline-none focus:ring-2 focus:ring-teelclr-500"
                  />
                  <ErrorMessage
                    name="newPassword"
                    component="div"
                    className="text-sm text-red-600"
                  />
                </div>

                {/* Confirm Password Field */}
                <div className="mb-1 flex flex-col gap-6">
                  <label
                    className="font-medium text-teelclr-600"
                    htmlFor="confirmPassword"
                  >
                    Confirm Password
                  </label>
                  <Field
                    type="password"
                    name="confirmPassword"
                    placeholder="Re-enter your new password"
                    className="rounded-md border border-teelclr-300 p-2 focus:outline-none focus:ring-2 focus:ring-teelclr-500"
                  />
                  <ErrorMessage
                    name="confirmPassword"
                    component="div"
                    className="text-sm text-red-600"
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting || isLoading}
                  className="mt-6 w-full rounded-md bg-teelclr-500 py-2 text-white hover:bg-teelclr-600"
                >
                  {isLoading ? "Submitting..." : "Reset Password"}
                </button>
              </Form>
            )}
          </Formik>
        </div>
      </section>
    );
  }
}

export default NewPassword;
