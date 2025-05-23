import { useEffect } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { Dashboard, Auth } from "@/layouts";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useFCMRegistration } from "./fcmService";
import { onMessage } from "firebase/messaging";
import { messaging } from "./firebaseConfig/firebaseConfig";
import "./index.css";

function App() {
  const { requestFCMPermission } = useFCMRegistration();
  const navigate = useNavigate();

  useEffect(() => {
    requestFCMPermission();
  }, []);

  useEffect(() => {
    const unsubscribe = onMessage(messaging, (payload) => {
      const notification = payload.notification;
      const data = payload.data || {};
      const tag = data?.tag;
      const uuid = data?.uuid || data?.quote_uuid || data?.quote_request_uuid;

      // ✅ Navigation logic
      let targetUrl = "/dashboard";

      switch (tag) {
        case "new_order":
          if (uuid) {
            targetUrl = `/dashboard/orders/${uuid}`;
          }
          break;
        case "new_customer":
          targetUrl = "/dashboard/Customers";
          break;
        case "new_ticket":
          targetUrl = "/dashboard/support";
          break;
        default:
          if (uuid) {
            targetUrl = `/notification?uuid=${uuid}`;
          }
          break;
      }

      // ✅ Show clickable toast
      if (notification?.title && notification?.body) {
        toast.info(
          <div
            onClick={() => navigate(targetUrl)}
            style={{ cursor: "pointer" }}
          >
            📢 <strong>{notification.title}</strong>
            <br />
            {notification.body}
          </div>,
          {
            autoClose: 8000,
            closeOnClick: false,
          },
        );
      }
    });

    return () => unsubscribe(); // Cleanup on unmount
  }, [navigate]);

  return (
    <>
      <ToastContainer />
      <Routes>
        <Route path="/*" element={<Dashboard />} />
        <Route path="/auth/*" element={<Auth />} />
        <Route path="*" element={<Navigate to="/" replace />} />{" "}
        {/* ✅ Change to /dashboard */}
      </Routes>
    </>
  );
}

export default App;
