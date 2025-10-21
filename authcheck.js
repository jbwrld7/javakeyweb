import { auth } from "./firebaseconfig.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.2/firebase-auth.js";

export function checkSession() {
  return new Promise((resolve) => {
    const isAdmin = localStorage.getItem("isAdmin");

    if (isAdmin === "true") {
      console.log("✅ Admin session active");
      resolve("admin");
      return;
    }

    onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log("✅ User session active:", user.email);
        resolve("user");
      } else {
        console.log("No active session. Redirecting...");
        window.location.href = "loginform.html";
      }
    });
  });
}