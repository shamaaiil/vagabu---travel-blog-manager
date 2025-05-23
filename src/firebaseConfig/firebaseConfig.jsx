// src/firebaseConfig.jsx
import { initializeApp } from "firebase/app";
import { getMessaging } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyD2gzlhYgpYamfUIpZEznFrTDlQMQDiFvs",
  authDomain: "mecarvirush.firebaseapp.com",
  projectId: "mecarvirush",
  storageBucket: "mecarvirush.firebasestorage.app",
  messagingSenderId: "429796383185",
  appId: "1:429796383185:web:7844f1ba515842951428f0",
  measurementId: "G-YKP6YG61TY",
};

const firebaseApp = initializeApp(firebaseConfig);
const messaging = getMessaging(firebaseApp);

export { firebaseApp, messaging };
