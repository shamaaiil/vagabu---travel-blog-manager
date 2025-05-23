import React, { useEffect } from "react";
import { Form, Input, Button, Checkbox, message } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { usePostMutation } from "@/services/apiService"; // Adjust the path to your apiSlice
import { login } from "@/features/AuthSlice/authSlice";
import headerImage from "../../assets/images/PRlogo.png"; // Your project logo
import { useNavigate, useLocation } from "react-router-dom";

const SignIn = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [loginApi, { isLoading }] = usePostMutation();
  const { isAuthenticated } = useSelector((state) => state.auth);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

 const onFinish = async (values) => {
  try {
    const response = await loginApi({
      path: "/authentication/login",
      body: values,
    }).unwrap();

    const user = response?.data;
    const roles = user?.roles?.[0]; // Get the first role
    const token = response?.meta?.token;
    const firebaseToken = response?.meta?.firebase_token;

    // Check if user exists and has admin role
    if (user && roles === "admin" && token) {
      localStorage.setItem("token", token);

      dispatch(login(response));

      message.success("Login successful!");

      const from = location.state?.from?.pathname || "/";
      navigate(from, { replace: true });
    } else if (!user) {
      message.error("User data not found in response");
    } else if (!roles) {
      message.error("User role not found");
    } else if (roles !== "admin") {
      message.error("Access denied. Only admins can log in.");
    } else {
      message.error("Login failed. Please try again.");
    }
  } catch (error) {
    console.error("Login error:", error);
    const errorMessage =
      error?.data?.message ||
      error?.message ||
      "Login failed. Please try again.";
    message.error(errorMessage);
  }
};


  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900">
      <div className="w-full max-w-md bg-white shadow-lg rounded-lg overflow-hidden">
        {/* Header Section */}
        <div className="bg-teelclr py-8 px-8 flex flex-col items-center">
          <img src={headerImage} alt="Logo" className="h-24 w-auto mb-2" />
          <h2 className="text-3xl font-semibold text-white mb-2">Login Now</h2>
          <p className="text-white text-sm mb-4">
            Welcome back, please sign in below
          </p>
        </div>

        {/* Login Form */}
        <div className="px-8 py-6">
          <Form
            name="loginForm"
            layout="vertical"
            onFinish={onFinish}
            autoComplete="off"
          >
            {/* Email Field */}
            <Form.Item
              label={
                <span className="text-sm text-gray-700">Email Address</span>
              }
              name="email"
              rules={[{ required: true, message: "Please input your email!" }]}
            >
              <Input
                placeholder="Type Email Address"
                className="w-full px-4 py-3 text-sm border rounded-md focus:ring-2 focus:ring-teelclr focus:outline-none"
              />
            </Form.Item>

            {/* Password Field */}
            <Form.Item
              label={<span className="text-sm text-gray-700">Password</span>}
              name="password"
              rules={[
                { required: true, message: "Please input your password!" },
              ]}
            >
              <Input.Password
                placeholder="Type Password"
                className="w-full px-4 py-3 text-sm border rounded-md focus:ring-2 focus:ring-teelclr focus:outline-none"
              />
            </Form.Item>

            {/* Remember Me and Forgot Password */}
            <div className="flex items-center justify-between mb-6">
              <Form.Item name="remember" valuePropName="checked" noStyle>
                <Checkbox className="text-sm text-teelclr">
                  Remember Password
                </Checkbox>
              </Form.Item>
              <Button
                type="link"
                onClick={() => {
                  ("Navigating to Forgot Password");
                  navigate("/auth/forgot-password");
                }}
                className="text-sm text-teelclr hover:underline"
              >
                Forgot Password?
              </Button>
            </div>

            {/* Submit Button */}
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                loading={isLoading} // Show loading spinner during login
                className="w-full px-4 py-5 text-white bg-teelclr rounded-md hover:bg-teelclr"
              >
                Login
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
