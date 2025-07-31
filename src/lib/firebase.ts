// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";


// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  "projectId": "briefing-cp-marketing-digital",
  "appId": "1:851027099229:web:2f031738e999647286d7b4",
  "storageBucket": "briefing-cp-marketing-digital.appspot.com",
  "apiKey": "AIzaSyANGNMKPzcwkMUT5_m1fDmeJPHdPq9rvbA",
  "authDomain": "briefing-cp-marketing-digital.firebaseapp.com",
  "measurementId": "",
  "messagingSenderId": "851027099229"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);

export { app, db, auth, storage };
