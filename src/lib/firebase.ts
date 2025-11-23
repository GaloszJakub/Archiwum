import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBNMAggMPpnf738WRpp564Q0D9aH6TeW_g",
  authDomain: "archive-52697.firebaseapp.com",
  projectId: "archive-52697",
  storageBucket: "archive-52697.firebasestorage.app",
  messagingSenderId: "57803144743",
  appId: "1:57803144743:web:fe60fbaf4f40c97c849802",
  measurementId: "G-86K881WRD5"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);
