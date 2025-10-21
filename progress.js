import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.2/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.7.2/firebase-auth.js";
import { getFirestore, collection, getDocs, doc } from "https://www.gstatic.com/firebasejs/10.7.2/firebase-firestore.js";

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
const db = getFirestore(app);

const sidebar = document.getElementById("sidebar");
const menuToggle = document.getElementById("menuToggle");
const closeBtn = document.getElementById("closeBtn");

menuToggle.addEventListener("click", () => sidebar.classList.add("active"));
closeBtn.addEventListener("click", () => sidebar.classList.remove("active"));

document.getElementById("logout").addEventListener("click", (e) => {
  e.preventDefault();
  signOut(auth).then(() => {
    alert("Logged out successfully!");
    window.location.href = "index.html";
  });
});

const tableContainer = document.createElement("div");
tableContainer.innerHTML = `
  <table class="progress-table">
    <thead>
      <tr>
        <th>Stage</th>
        <th>Best Time (s)</th>
        <th>Completed At</th>
      </tr>
    </thead>
    <tbody id="progressTableBody">
      <tr><td colspan="3">Loading...</td></tr>
    </tbody>
  </table>
`;
document.querySelector(".progress-container").appendChild(tableContainer);

onAuthStateChanged(auth, async (user) => {
  if (!user) {
    window.location.href = "index.html";
    return;
  }

  const tableBody = document.getElementById("progressTableBody");
  tableBody.innerHTML = `<tr><td colspan="3">Loading your progress...</td></tr>`;

  try {

    const stageTimesRef = collection(db, "users", user.uid, "stageTimes");
    const stageSnapshot = await getDocs(stageTimesRef);

    if (stageSnapshot.empty) {
      tableBody.innerHTML = `<tr><td colspan="3">No progress found.</td></tr>`;
      return;
    }

    let rows = "";
    stageSnapshot.forEach((doc) => {
      const data = doc.data();
      const seconds = data.bestTime || 0;
      const minutes = Math.floor(seconds / 60);
      const remainingSeconds = Math.floor(seconds % 60);
      const formattedTime = `${minutes}:${remainingSeconds
        .toString()
        .padStart(2, "0")}`;
      rows += `
        <tr>
          <td>${data.stage || "Unknown"}</td>
          <td>${formattedTime || "N/A"}</td>
          <td>${data.completedAt || "N/A"}</td>
        </tr>
      `;
    });

    tableBody.innerHTML = rows;
  } catch (error) {
    console.error("Error loading progress:", error);
    tableBody.innerHTML = `<tr><td colspan="3">Error loading data.</td></tr>`;
  }
});