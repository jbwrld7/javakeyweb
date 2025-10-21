import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.2/firebase-app.js";
import { getAuth, sendPasswordResetEmail } from "https://www.gstatic.com/firebasejs/10.7.2/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyCIxAS1HydXA1cpL7aHmJ7fH7PkfUk75Ig",
  authDomain: "javakey-8ffac.firebaseapp.com",
  projectId: "javakey-8ffac",
  storageBucket: "javakey-8ffac.appspot.com",
  messagingSenderId: "949890755618",
  appId: "1:949890755618:web:d8ac15f2a7068004f9ae7b",
  measurementId: "G-YRHF6SVY6K"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

document.getElementById("resetBtn").addEventListener("click", () => {
  const email = document.getElementById("email").value.trim();

  if (!email) {
    alert("Please enter your email address.");
    return;
  }

  sendPasswordResetEmail(auth, email)
    .then(() => {
      alert("Password reset link sent! Please check your email inbox.");
      window.location.href = "loginform.html";
    })
    .catch((error) => {
      console.error(error);
      if (error.code === "auth/user-not-found") {
        alert("No account found with this email.");
      } else if (error.code === "auth/invalid-email") {
        alert("Please enter a valid email address.");
      } else {
        alert("Error sending reset link: " + error.message);
      }
    });
});