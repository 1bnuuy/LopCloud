// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyC0HPBs50SN9w8ks8MCS8lXziUHJvJR-9Q",
  authDomain: "lopcloud.firebaseapp.com",
  projectId: "lopcloud",
  storageBucket: "lopcloud.firebasestorage.app",
  messagingSenderId: "537813002413",
  appId: "1:537813002413:web:c1245ac715793cbe797e24",
  measurementId: "G-F756813310"
};

// 🐰 Initialize Firebase
const app = initializeApp(firebaseConfig);

// 🌸 Initialize Firestore
const db = getFirestore(app);

// 🐇 Export the Firestore instance
export { db };