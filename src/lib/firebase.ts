
// IMPORTANT: Replace the placeholder values below with the actual
// configuration object from your Firebase project settings.
// src/lib/firebase.ts
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getFunctions } from 'firebase/functions';

const firebaseConfig = {
  apiKey: "AIzaSyCrDYGcCebYM5pUWnd1aetWTc0gvw8ScW0",
  authDomain: "backend-mindwell.firebaseapp.com",
  projectId: "backend-mindwell",
  storageBucket: "backend-mindwell.appspot.com",
  messagingSenderId: "197618321719",
  appId: "1:197618321719:web:f7af769e09534b8cd9f2b2",
  measurementId: "G-8WM3HNQRP6"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app);
export const db = getFirestore(app);
export const functions = getFunctions(app);
