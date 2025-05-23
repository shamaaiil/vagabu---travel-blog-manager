import { usePostMutation } from "@/services/apiService";
import { messaging } from "./firebaseConfig/firebaseConfig";
import { getToken, onMessage } from "firebase/messaging";
import { useEffect } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const VAPID_KEY =
  "BICY1tx9ukExp1q9TgWyeMgDaOTpN8_HtMLM1E4Z5JbBmqFcmMIa3elmZi6KiysgRspSO4X90gLx49Ax8wB70UU";

const FCM_TOKEN_STORAGE_KEY = "fcm_token";

export const useFCMRegistration = () => {
  const [postToBackend] = usePostMutation();
  const navigate = useNavigate();

  const requestFCMPermission = async () => {
    try {
      const permission = await Notification.requestPermission();
      if (permission !== "granted") {
        console.warn("Notification permission not granted");
        return null;
      }

      const currentToken = await getToken(messaging, { vapidKey: VAPID_KEY });

      const storedToken = localStorage.getItem(FCM_TOKEN_STORAGE_KEY);
      if (storedToken === currentToken) {
        return currentToken;
      }

      // 🔁 Send token to backend
      const response = await postToBackend({
        path: "devices/register",
        body: { device_token: currentToken },
      }).unwrap();

      localStorage.setItem(FCM_TOKEN_STORAGE_KEY, currentToken);

      return currentToken;
    } catch (err) {
      console.error("❌ Error getting or sending FCM token", err);
      return null;
    }
  };

  // ✅ Foreground notification listener
  useEffect(() => {
    const unsubscribe = onMessage(messaging, (payload) => {
      const { title, body } = payload.notification || {};
      const { tag, uuid } = payload.data || {};

      if (title && body) {
        toast.info(`${title}: ${body}`);
      }

      let targetUrl = "/dashboard";

      switch (tag) {
        case "new_order":
          if (uuid) targetUrl = `/dashboard/orders/${uuid}`;
          break;
        case "new_customer":
          targetUrl = "/dashboard/Customers";
          break;
        case "new_ticket":
          targetUrl = "/dashboard/support";
          break;
        default:
          if (uuid) targetUrl = `/notification?uuid=${uuid}`;
          break;
      }

      if (targetUrl) {
        navigate(targetUrl);
      }
    });

    return () => unsubscribe(); // Cleanup on unmount
  }, [navigate]);

  return { requestFCMPermission };
};
