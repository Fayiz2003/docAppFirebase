// firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB4zmN5OOMBeWAFSIIKkhRnp7eUuz10I6w",
  authDomain: "docapp-8480b.firebaseapp.com",
  projectId: "docapp-8480b",
  storageBucket: "docapp-8480b.firebasestorage.app",
  messagingSenderId: "182940507550",
  appId: "1:182940507550:web:d3ebceb1fadf87b80c0a8f"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
