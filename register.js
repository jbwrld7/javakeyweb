import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.2/firebase-app.js";
import { 
  getAuth, 
  createUserWithEmailAndPassword, 
  sendEmailVerification 
} from "https://www.gstatic.com/firebasejs/10.7.2/firebase-auth.js";
import { 
  getFirestore, 
  doc, 
  setDoc 
} from "https://www.gstatic.com/firebasejs/10.7.2/firebase-firestore.js";

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

// Modal + password validation setup
const modal = document.getElementById('termsModal');
const openModalLink = document.getElementById('openModal');
const closeModalBtn = document.getElementById('closeModal');
const acceptBtn = document.getElementById('acceptTerms');
const checkbox = document.getElementById('terms');
const password = document.getElementById('password');
const confirmPassword = document.getElementById('confirmpassword');
const errorText = document.getElementById('passwordError');
const submitBtn = document.getElementById('submit');

// Modal handling
openModalLink.addEventListener('click', e => {
  e.preventDefault();
  modal.classList.add('active');
  modal.setAttribute('aria-hidden','false');
});
closeModalBtn.addEventListener('click', () => {
  modal.classList.remove('active');
  modal.setAttribute('aria-hidden','true');
});
acceptBtn.addEventListener('click', () => {
  checkbox.checked = true;
  modal.classList.remove('active');
  modal.setAttribute('aria-hidden','true');
});
window.addEventListener('click', e => { if (e.target === modal) modal.classList.remove('active'); });
window.addEventListener('keydown', e => { if (e.key === 'Escape') modal.classList.remove('active'); });

// Password validation
function validatePasswords() {
  if (password.value !== confirmPassword.value) {
    errorText.textContent = 'Passwords do not match.';
    password.style.border = '2px solid red';
    confirmPassword.style.border = '2px solid red';
    return false;
  } else {
    errorText.textContent = '';
    password.style.border = '2px solid green';
    confirmPassword.style.border = '2px solid green';
    return true;
  }
}
password.addEventListener('input', validatePasswords);
confirmPassword.addEventListener('input', validatePasswords);

// Submit handler
submitBtn.addEventListener("click", async (event) => {
  event.preventDefault();

  const fullname = document.getElementById("name").value.trim();
  const section = document.getElementById("section").value.trim();
  const email = document.getElementById("email").value.trim();
  const pass = password.value.trim();

  if (!validatePasswords()) {
    alert("Passwords do not match!");
    return;
  }

  const emailPattern = /^[a-zA-Z0-9._%+-]+@(spcc\.edu\.ph|gmail\.com)$/;
  if (!emailPattern.test(email)) {
    alert("Please use your official SPCC email address (example@spcc.edu.ph).");
    return;
  }

  const passwordPattern =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  if (!passwordPattern.test(pass)) {
    alert(
      "Password must be at least 8 characters long and include:\n- 1 uppercase letter\n- 1 lowercase letter\n- 1 number\n- 1 special character."
    );
    return;
  }

  if (!checkbox.checked) {
    alert("You must agree to the Terms & Conditions before registering.");
    return;
  }

  try {
    // Attempt to create user — Firebase automatically blocks duplicate emails
    const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
    const user = userCredential.user;

    await sendEmailVerification(user);
    await setDoc(doc(db, "users", user.uid), {
      fullname: fullname,
      email: email,
      section: section,
      createdAt: new Date(),
    });

    alert("Registration successful! A verification link has been sent to your email.");
    console.log("User saved to Firestore:", user.uid);

    window.location.href = "index.html";

  } catch (error) {
    console.error("Error during registration:", error.code, error.message);

    // Custom error handling
    if (error.code === "auth/email-already-in-use") {
      alert("An account with this email already exists. Please log in instead.");
    } else if (error.code === "auth/invalid-email") {
      alert("Please enter a valid email address.");
    } else if (error.code === "auth/weak-password") {
      alert("Password is too weak. Use a stronger password.");
    } else {
      alert("Registration failed: " + error.message);
    }
  }
});
