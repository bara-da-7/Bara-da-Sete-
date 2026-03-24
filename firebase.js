import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";

import { getFirestore } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-storage.js";

const firebaseConfig = {
  apiKey: "AIzaSyA--Yx-rJnPlRFXzMc0GhDzAqNav5bGOLw",
  authDomain: "bara-da-sete.firebaseapp.com",
  projectId: "bara-da-sete",
  storageBucket: "bara-da-sete.firebasestorage.app",
  messagingSenderId: "162143376770",
  appId: "1:162143376770:web:4e62e135636a477057eb9b"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);
