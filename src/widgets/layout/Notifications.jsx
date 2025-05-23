import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { XMarkIcon, UserIcon } from "@heroicons/react/24/outline";
import { useGetQuery } from "@/services/apiService";

const Notification = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isAnimatingOut, setIsAnimatingOut] = useState(false);
  const modalRef = useRef(null);

  const { data, isLoading, isError } = useGetQuery({ path: "/notifications" });
  const notifications = data?.data || [];

  const toggleNotifications = () => {
    if (isOpen) {
      setIsAnimatingOut(true);
      setTimeout(() => {
        setIsOpen(false);
        setIsAnimatingOut(false);
      }, 300);
    } else {
      setIsOpen(true);
    }
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target) &&
        !event.target.closest("[data-notification-toggle]")
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [modalRef]);

  const renderIcon = (tag) => {
    switch (tag) {
      case "new_customer":
        return <UserIcon className="h-5 w-5" />;
      case "new_order":
        return (
          <svg
            className="h-5 w-5 text-blue-500"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3 3h18v4H3z M3 7v13h18V7z M16 10l-4 4-4-4"
            />
          </svg>
        );
      default:
        return <UserIcon className="h-5 w-5" />;
    }
  };

  const modalContent = (
    <div
      ref={modalRef}
      className={`fixed z-[9999] top-16 right-0 w-80 bg-white shadow-lg rounded-md border border-gray-100 overflow-hidden h-full ${
        isAnimatingOut ? "animate-slide-out-right" : "animate-slide-in-right"
      }`}
      style={{ maxWidth: "calc(100% - 2rem)" }}
    >
      <div className="flex items-center justify-between p-3 border-b border-gray-100">
        <h3 className="font-medium text-gray-800">Notifications</h3>
        <button
          onClick={() => setIsOpen(false)}
          className="text-gray-500 hover:text-gray-700"
        >
          <XMarkIcon className="h-5 w-5" />
        </button>
      </div>
      <div className="divide-y divide-gray-100 max-h-96 overflow-y-auto">
        {isLoading ? (
          <div className="p-4 text-center text-gray-500">Loading...</div>
        ) : isError ? (
          <div className="p-4 text-center text-red-500">
            Failed to load notifications
          </div>
        ) : notifications.length > 0 ? (
          notifications.map((item) => (
            <div key={item.id} className="p-3 hover:bg-gray-50">
              <div className="flex items-start">
                <div className="flex-shrink-0 mr-3">
                  {renderIcon(item.data.tag)}
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-800">{item.data.message}</p>
                  <p className="text-xs text-gray-500 mt-1">Just now</p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="p-4 text-center text-gray-500">
            No notifications to display
          </div>
        )}
      </div>
    </div>
  );

  return (
    <>
      <button
        data-notification-toggle="true"
        onClick={toggleNotifications}
        className="relative p-2 rounded-full text-gray-600 hover:bg-gray-100 focus:outline-none"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
          />
        </svg>
        {notifications.length > 0 && (
          <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full"></span>
        )}
      </button>
      {isOpen && createPortal(modalContent, document.body)}
    </>
  );
};

export default Notification;
