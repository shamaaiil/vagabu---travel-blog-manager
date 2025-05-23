importScripts(
  "https://www.gstatic.com/firebasejs/10.1.0/firebase-app-compat.js",
);
importScripts(
  "https://www.gstatic.com/firebasejs/10.1.0/firebase-messaging-compat.js",
);

firebase.initializeApp({
  apiKey: "AIzaSyD2gzlhYgpYamfUIpZEznFrTDlQMQDiFvs",
  authDomain: "mecarvirush.firebaseapp.com",
  projectId: "mecarvirush",
  storageBucket: "mecarvirush.firebasestorage.app",
  messagingSenderId: "429796383185",
  appId: "1:429796383185:web:7844f1ba515842951428f0",
  measurementId: "G-YKP6YG61TY",
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage(function (payload) {
  console.log(
    "[firebase-messaging-sw.js] Background Message received:",
    payload,
  );

  const { title, body } = payload.notification;

  self.registration.showNotification(title, {
    body,
    data: payload.data, // contains `tag`, `uuid`, etc.
  });
});

self.addEventListener("notificationclick", function (event) {
  const tag = event.notification.data?.tag;
  const uuid = event.notification.data?.uuid;

  let targetUrl = "/dashboard"; // default fallback

  switch (tag) {
    case "new_order":
      // ✅ requires a uuid to show order details
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
      // If nothing matches but uuid exists, go to generic notification handler
      if (uuid) {
        targetUrl = `/notification?uuid=${uuid}`;
      }
      break;
  }

  event.notification.close();
  event.waitUntil(clients.openWindow(targetUrl));
});
