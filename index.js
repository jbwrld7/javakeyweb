import { auth } from "./firebaseconfig.js";
import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.7.2/firebase-auth.js";
import { getFirestore, doc, updateDoc } from "https://www.gstatic.com/firebasejs/10.7.2/firebase-firestore.js";
document.getElementById("submit").addEventListener("click", async (event) => {
  event.preventDefault();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    console.log("User logged in:", user.email);

    localStorage.setItem("isAdmin", "false");
    window.location.href = "studentdashboard.html";
  } catch (error) {
    console.error("Login error:", error.message);
    alert("Login failed: " + error.message);
  }
});
const adminForm = document.getElementById("adminLoginForm");
const adminError = document.getElementById("adminError");
adminForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const username = document.getElementById("adminUsername").value.trim();
  const password = document.getElementById("adminPassword").value.trim();
  if (username === "admin" && password === "admin") {
    localStorage.setItem("isAdmin", "true");
    alert("Welcome, Admin!");
    window.location.href = "admindashboard.html";
  } else {
    adminError.style.display = "block";
  }
});
const db = getFirestore();
const user = auth.currentUser;
if (user) {
  const userRef = doc(db, "users", user.uid);
  await updateDoc(userRef, {
    isOnline: true
  });
}