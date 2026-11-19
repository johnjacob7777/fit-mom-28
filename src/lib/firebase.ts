// ---------------------------------------------------------
// Firebase setup — connects your app to Firebase
// ---------------------------------------------------------
import { initializeApp, getApps } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your verified Firebase configuration
const firebaseConfig = {
  apiKey:
    process.env.NEXT_PUBLIC_FIREBASE_API_KEY ||
    "AIzaSyBNfgS3hB5p6C1YBJblILgDTx238ctcEGI",
  authDomain:
    process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ||
    "fit-mom-20.firebaseapp.com",
  projectId:
    process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ||
    "fit-mom-20",
  storageBucket:
    process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ||
    "fit-mom-20.firebasestorage.app",
  messagingSenderId:
    process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID ||
    "1182354984",
  appId:
    process.env.NEXT_PUBLIC_FIREBASE_APP_ID ||
    "1:1182354984:web:0051df7f5b32d198caaf1d",
};

// Only create the app once (prevents errors during hot reload)
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

// Auth lets users sign in
export const auth = getAuth(app);

// Google sign-in provider
export const googleProvider = new GoogleAuthProvider();

// Firestore is the database that stores user data
export const db = getFirestore(app);
