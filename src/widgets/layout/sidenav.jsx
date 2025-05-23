import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Link, NavLink, useLocation } from "react-router-dom";
import {
  ChevronDownIcon,
  ChevronUpIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import headerImage from "../../assets/images/PRlogo.png";
import { LuDiamond } from "react-icons/lu";

import { IconButton, Typography } from "@material-tailwind/react";
import { useMaterialTailwindController, setOpenSidenav } from "@/context";

export function Sidenav({ brandImg, brandName, routes }) {
  const [controller, dispatch] = useMaterialTailwindController();
  const { sidenavColor, sidenavType, openSidenav } = controller;
  const [openDropdowns, setOpenDropdowns] = useState({});
  const location = useLocation();

  const sidenavTypes = {
    teelclr: "bg-teal-500",
    white: "bg-white",
    transparent: "bg-transparent",
  };

  // Set sidenav to closed by default on screens smaller than lg
  useEffect(() => {
    const handleResize = () => {
      // Close sidenav by default on smaller screens
      if (window.innerWidth < 1024 && openSidenav) {
        setOpenSidenav(dispatch, false);
      }
    };

    // Initial check
    handleResize();

    // Add event listener
    window.addEventListener("resize", handleResize);

    // Cleanup
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [dispatch]);

  // Toggle dropdown visibility
  const toggleDropdown = (name) => {
    setOpenDropdowns((prev) => ({
      ...prev,
      [name]: !prev[name],
    }));
  };

  return (
    <aside
      className={`${sidenavTypes[sidenavType]} ${
        openSidenav ? "translate-x-0" : "-translate-x-80"
      } fixed inset-0 z-50 h-screen w-64 bg-white transition-transform duration-300 xl:translate-x-0 
      border-r border-gray-200 shadow-sm overflow-y-auto`}
    >
      <div className="sticky top-0 bg-white z-10 p-4 text-center border-b border-gray-100">
        <Link to="/" className="text-center block">
          <div className="text-center w-full">
            <img src={headerImage} alt="Logo" className="h-10 mx-auto" />
          </div>
        </Link>
        <IconButton
          variant="text"
          color="teal"
          size="sm"
          ripple={false}
          className="absolute right-2 top-2 lg:hidden"
          onClick={() => setOpenSidenav(dispatch, false)}
        >
          <XMarkIcon strokeWidth={2.5} className="h-5 w-5 text-black" />
        </IconButton>
      </div>

      <div className="px-3 py-2">
        {routes.map(({ layout, pages }, key) => (
          <ul key={key} className="flex flex-col gap-1">
            {pages
              .filter(
                (page) =>
                  layout === "dashboard" && page.showInSidenav !== false,
              )
              .map(({ icon, name, path, dropdown, children }) => (
                <li key={name}>
                  {dropdown ? (
                    <>
                      {/* Main Dropdown Toggle */}
                      <button
                        className={`flex justify-between items-center w-full px-4 py-3 rounded hover:bg-gray-100 text-left ${
                          location.pathname.includes(path)
                            ? "text-teal-500"
                            : "text-gray-700"
                        }`}
                        onClick={() => toggleDropdown(name)}
                      >
                        <div className="flex items-center gap-3">
                          {icon}
                          <Typography
                            className={`font-medium text-sm capitalize`}
                          >
                            {name}
                          </Typography>
                        </div>
                        {openDropdowns[name] ? (
                          <ChevronUpIcon className="w-5 h-5" />
                        ) : (
                          <ChevronDownIcon className="w-5 h-5" />
                        )}
                      </button>

                      {/* Dropdown Items */}
                      {openDropdowns[name] && (
                        <ul className="ml-4 mt-1">
                          {children.map((child, index) => (
                            <li key={index} className="mb-1">
                              {child.dropdown ? (
                                <>
                                  <button
                                    className={`flex justify-between items-center w-full px-4 py-2 rounded hover:bg-gray-100 text-left ${
                                      location.pathname.includes(child.path)
                                        ? "text-teal-500"
                                        : "text-gray-600"
                                    }`}
                                    onClick={() => toggleDropdown(child.name)}
                                  >
                                    <div className="flex items-center gap-3">
                                      <LuDiamond className="h-4 w-4 text-gray-500" />
                                      <Typography className="font-normal text-sm">
                                        {child.name}
                                      </Typography>
                                    </div>
                                    {openDropdowns[child.name] ? (
                                      <ChevronUpIcon className="w-4 h-4" />
                                    ) : (
                                      <ChevronDownIcon className="w-4 h-4" />
                                    )}
                                  </button>

                                  {/* Sub Dropdown Items */}
                                  {openDropdowns[child.name] && (
                                    <ul className="ml-6 mt-1">
                                      {child.children.map(
                                        (subChild, subIndex) => (
                                          <li key={subIndex} className="mb-1">
                                            <NavLink
                                              to={`/${layout}${subChild.path}`}
                                              className={({ isActive }) =>
                                                `block px-4 py-2 text-sm rounded flex items-center gap-3 ${
                                                  isActive
                                                    ? "text-teal-500 font-medium bg-teal-50"
                                                    : "text-gray-600 hover:bg-gray-100"
                                                }`
                                              }
                                              onClick={() =>
                                                window.innerWidth < 1024 &&
                                                setOpenSidenav(dispatch, false)
                                              }
                                            >
                                              <LuDiamond className="h-3 w-3" />
                                              {subChild.name}
                                            </NavLink>
                                          </li>
                                        ),
                                      )}
                                    </ul>
                                  )}
                                </>
                              ) : (
                                <NavLink
                                  to={child.path}
                                  className={({ isActive }) =>
                                    `block px-4 py-2 rounded flex items-center gap-3 ${
                                      isActive
                                        ? "text-teal-500 font-medium bg-teal-50"
                                        : "text-gray-600 hover:bg-gray-100"
                                    }`
                                  }
                                  onClick={() =>
                                    window.innerWidth < 1024 &&
                                    setOpenSidenav(dispatch, false)
                                  }
                                >
                                  <LuDiamond className="h-4 w-4" />
                                  <span className="text-sm">{child.name}</span>
                                </NavLink>
                              )}
                            </li>
                          ))}
                        </ul>
                      )}
                    </>
                  ) : (
                    <NavLink
                      to={path}
                      className={({ isActive }) =>
                        `block px-4 py-3 rounded flex items-center gap-3 ${
                          isActive
                            ? "bg-teal-50 text-teal-500 font-medium"
                            : "text-gray-700 hover:bg-gray-100"
                        }`
                      }
                      onClick={() =>
                        window.innerWidth < 1024 &&
                        setOpenSidenav(dispatch, false)
                      }
                    >
                      {icon}
                      <Typography className="font-medium text-sm">
                        {name}
                      </Typography>
                    </NavLink>
                  )}
                </li>
              ))}
          </ul>
        ))}
      </div>
    </aside>
  );
}

Sidenav.defaultProps = {
  brandImg: "/img/logo-ct.png",
  brandName: "Material Tailwind React",
};

Sidenav.propTypes = {
  brandImg: PropTypes.string,
  brandName: PropTypes.string,
  routes: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default Sidenav;
