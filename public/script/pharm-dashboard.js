import {
  getFirestore,
  collection,
  getDocs,
} from "https://www.gstatic.com/firebasejs/10.12.3/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-auth.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-app.js";

// Add your Firebase configuration here

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

function renderTable() {
  const body = document.querySelector("tbody");
  if (!body) {
    console.error("No <tbody> found in the document.");
    return;
  }

  while (body.firstChild) {
    body.removeChild(body.firstChild);
  }

  const drugsCollection = collection(db, "drugs");
  getDocs(drugsCollection)
    .then((querySnapshot) => {
      if (querySnapshot.empty) {
        console.log("No matching documents.");
        return;
      }

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        const row = body.insertRow();
        const cells = [];
        for (let i = 0; i < 9; i++) {
          cells[i] = row.insertCell();
        }

        const keys = [
          "id",
          "trade_name",
          "generic_name",
          "type",
          "variant",
          "amount",
          "q_med1",
          "q_med2",
          "price",
        ];
        cells[0].textContent = doc.id;
        keys.slice(1).forEach((key, index) => {
          cells[index + 1].textContent = data[key] || "";
        });

        const med1Value = parseInt(cells[6].textContent, 10);
        const med2Value = parseInt(cells[7].textContent, 10);

        if (med1Value < 15) {
          cells[6].classList.add("red-background");
        }
        if (med2Value < 15) {
          cells[7].classList.add("red-background");
        }
      });

      console.log("Table rendering complete.");
    })
    .catch((error) => {
      console.error("Error fetching documents: ", error);
    });
}

document.addEventListener("DOMContentLoaded", () => {
  auth.onAuthStateChanged((user) => {
    if (user) {
      renderTable();
    } else {
      window.location.href = "index.html";
    }
  });
});
