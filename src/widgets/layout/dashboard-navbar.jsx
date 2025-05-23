import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useGetQuery } from "@/services/apiService";
import { useNavigate, useLocation } from "react-router-dom";
import { logout } from "@/features/AuthSlice/authSlice";

import {
  Navbar as MTNavbar,
  Typography,
  IconButton,
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
} from "@material-tailwind/react";
import {
  DocumentTextIcon,
  ChatBubbleLeftEllipsisIcon,
  UserCircleIcon,
  KeyIcon,
  Cog6ToothIcon,
  Bars3Icon,
} from "@heroicons/react/24/outline";
import { useMaterialTailwindController, setOpenSidenav } from "@/context";
import Notifications from "./Notifications";

export function DashboardNavbar() {
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const [userData, setUserData] = useState({
    full_name: "Loading...",
    roles: ["guest"],
    cnic_image: "",
  });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  // Get controller from context for sidenav state
  const [controller, dispatchContext] = useMaterialTailwindController();
  const { openSidenav } = controller;

  // Get user UUID from local storage or Redux store
  const userUuid = localStorage.getItem("userUuid") || (user && user.user_uuid);

  // Use the same API service pattern as in the Customers component
  const { data, isLoading } = useGetQuery({
    path: `/customers/${userUuid}`,
    skip: !isAuthenticated || (user && user.user_uuid === userUuid),
  });

  useEffect(() => {
    // If we already have user data in Redux store
    if (user && user.user_uuid) {
      setUserData(user);
      return;
    }

    // Set user data from API response
    if (data && data.status === 1 && data.data) {
      const fetchedUserData = data.data;
      setUserData(fetchedUserData);

      // Update Redux store with user data
      dispatch({
        type: "SET_USER",
        payload: fetchedUserData,
      });
    }
  }, [data, dispatch, user, isAuthenticated]);

  // Function to get appropriate role display text
  const getRoleDisplay = () => {
    if (!userData?.roles || userData.roles.length === 0) return "Guest";

    const role = userData.roles[0];
    return role.charAt(0).toUpperCase() + role.slice(1);
  };

  // Function to get profile image
  const getProfileImage = () => {
    if (userData?.cnic_image) return userData.cnic_image;
    return "https://randomuser.me/api/portraits/lego/1.jpg"; // Default image
  };

  // Navigation handlers
  const navigateToProfile = () => {
    navigate("/profile");
  };

  const navigateToSettings = () => {
    navigate("/admin-settings");
  };

  const navigateToPassword = () => {
    navigate("/password");
  };

  // Toggle sidenav function
  const handleSidenavToggle = () => {
    setOpenSidenav(dispatchContext, !openSidenav);
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login"); // Redirect to login page after logout
  };

  const toggleNotifications = () => {
    if (isOpen) {
      setIsAnimatingOut(true);
      setTimeout(() => {
        setIsOpen(false);
        setIsAnimatingOut(false);
      }, 300); // Match animation duration
    } else {
      setIsOpen(true);
    }
  };

  return (
    // Removed default container and set max width to none
    <MTNavbar className="p-3 bg-white w-full max-w-none rounded-none shadow-sm">
      <div className="flex flex-wrap items-center justify-between px-2 md:px-6 lg:px-8 w-full">
        {/* Search Bar */}
        <div className="relative w-full md:w-64 lg:w-80 mb-2 md:mb-0">
          {/* Search field removed as in original */}
        </div>

        {/* Icons and Profile */}
        <div className="flex items-center gap-2 sm:gap-3 md:gap-5">
          {/* Sidenav Toggle - Only visible below lg breakpoint */}
          <IconButton
            variant="text"
            className="p-2 lg:hidden"
            onClick={handleSidenavToggle}
          >
            <Bars3Icon className="h-5 w-5 text-gray-600" />
          </IconButton>

          {/* Document Icon */}
          <div className="relative">
            <IconButton
              variant="text"
              className="p-2"
              onClick={() => navigate("/pending-orders")}
            >
              <DocumentTextIcon className="h-5 w-5 text-gray-600" />
            </IconButton>
            <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full"></span>
          </div>

          {/* Notification Bell - Now using the NotificationModal component */}
          <Notifications />

          {/* Message Icon */}
          <div className="relative">
            <IconButton
              variant="text"
              className="p-2"
              onClick={() => navigate("/support")}
            >
              <ChatBubbleLeftEllipsisIcon className="h-5 w-5 text-gray-600" />
            </IconButton>
            <span className="absolute top-0 right-0 h-2 w-2 bg-teal-500 rounded-full"></span>
          </div>

          {/* User Profile */}
          <Menu>
            <MenuHandler>
              <div className="flex items-center gap-2 cursor-pointer border-e-2 pe-6">
                <img
                  src={getProfileImage()}
                  alt="profile"
                  className="w-8 h-8 rounded-full object-cover"
                />
                <div className="hidden sm:block">
                  <Typography
                    variant="small"
                    className="text-gray-800 font-medium"
                  >
                    {isLoading ? "Loading..." : userData.full_name || "User"}
                  </Typography>
                  <Typography variant="small" className="text-gray-500 text-xs">
                    {isLoading ? "" : getRoleDisplay()}
                  </Typography>
                </div>
              </div>
            </MenuHandler>
            <MenuList>
              <MenuItem onClick={navigateToProfile}>
                <div className="flex items-center gap-2">
                  <UserCircleIcon className="h-4 w-4" />
                  Profile
                </div>
              </MenuItem>
              <MenuItem onClick={navigateToPassword}>
                <div className="flex items-center gap-2">
                  <KeyIcon className="h-4 w-4" />
                  Change Password
                </div>
              </MenuItem>
              <hr className="my-2" />
              <MenuItem onClick={handleLogout} className="text-red-500">
                <div className="flex items-center gap-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                    />
                  </svg>
                  <button>Logout</button>
                </div>
              </MenuItem>
            </MenuList>
          </Menu>
          <IconButton
            onClick={() => navigate("/setting/admin-settings")}
            variant="text"
            className="p-2"
          >
            <Cog6ToothIcon className="h-5 w-5 text-gray-600" />
          </IconButton>
        </div>
      </div>
    </MTNavbar>
  );
}

export default DashboardNavbar;
