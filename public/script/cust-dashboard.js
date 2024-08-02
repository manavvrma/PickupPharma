import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-app.js";
import {
  getAuth,
  onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/10.12.3/firebase-auth.js";
import {
  getFirestore,
  doc,
  getDoc,
} from "https://www.gstatic.com/firebasejs/10.12.3/firebase-firestore.js";

// Add your Firebase configuration here

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

function populateTable() {
  const din = document.getElementById("din").value;
  if (!din) {
    alert("Error: DIN field is empty.");
    return;
  }

  const drugRef = doc(db, "drugs", din);

  getDoc(drugRef)
    .then((docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        document.getElementById("q_med1").innerText =
          data["q_med1"] || "Not available";
        document.getElementById("q_med2").innerText =
          data["q_med2"] || "Not available";
      } else {
        alert("Error: DIN not in the system. Try again.");
      }
    })
    .catch((error) => {
      console.error("Error getting document: ", error);
    });
}

function formAlert() {
  alert("Order submitted. Thank you!");
}

document.addEventListener("DOMContentLoaded", () => {
  onAuthStateChanged(auth, (user) => {
    if (!user) {
      window.location.href = "index.html";
    }
  });

  const form = document.getElementById("form");
  if (form) {
    form.addEventListener("submit", populateTable);
  } else {
    console.error("Form element not found.");
  }
});

window.populateTable = populateTable;
window.formAlert = formAlert;
