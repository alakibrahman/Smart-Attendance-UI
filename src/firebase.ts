import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDsDbLCdPWLCoY4ajQ5f-uwmyoEm7YFN5A",
  authDomain: "smart-attendance-4a1d6.firebaseapp.com",
  projectId: "smart-attendance-4a1d6",
  storageBucket: "smart-attendance-4a1d6.firebasestorage.app",
  messagingSenderId: "281790524397",
  appId: "1:281790524397:web:093c4d8650d0bfb41d95e4",
  measurementId: "G-WT38NGRLWN"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();