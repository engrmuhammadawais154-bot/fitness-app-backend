// src/firebase.ts
import { initializeApp } from "firebase/app";
import type { FirebaseApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import type { Auth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import type { Firestore } from "firebase/firestore";

// Firebase configuration - Android production credentials
const firebaseConfig = {
  apiKey: "AIzaSyAqc0fX5jmMbQMA1YtCuKIlhW9GL2DNWAw",
  authDomain: "myfitnessapp-6b3ef.firebaseapp.com",
  projectId: "myfitnessapp-6b3ef",
  storageBucket: "myfitnessapp-6b3ef.firebasestorage.app",
  messagingSenderId: "257004509164",
  appId: "1:257004509164:android:265e84ef9bcdb89af152c9"
};

console.log("Initializing Firebase with config:", firebaseConfig);

let app: FirebaseApp;
let auth: Auth;
let db: Firestore;

try {
  // Initialize Firebase
  app = initializeApp(firebaseConfig);
  console.log("Firebase app initialized successfully");
  
  // Export the necessary services
  auth = getAuth(app);
  console.log("Firebase auth initialized successfully");
  
  db = getFirestore(app);
  console.log("Firestore initialized successfully");
} catch (error) {
  console.error("Firebase initialization error:", error);
  throw error;
}

export { auth, db };
