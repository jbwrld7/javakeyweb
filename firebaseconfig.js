import { initializeApp, getApps } from "https://www.gstatic.com/firebasejs/10.7.2/firebase-app.js";
import { getAuth, setPersistence, browserLocalPersistence } from "https://www.gstatic.com/firebasejs/10.7.2/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyCIxAS1HydXA1cpL7aHmJ7fH7PkfUk75Ig",
  authDomain: "javakey-8ffac.firebaseapp.com",
  projectId: "javakey-8ffac",
  storageBucket: "javakey-8ffac.appspot.com",
  messagingSenderId: "949890755618",
  appId: "1:949890755618:web:d8ac15f2a7068004f9ae7b",
  measurementId: "G-YRHF6SVY6K"
};

const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);

const auth = getAuth(app);

setPersistence(auth, browserLocalPersistence)
  .then(() => console.log("✅ Firebase persistence set to LOCAL"))
  .catch((err) => console.error("Persistence error:", err));

export { auth };