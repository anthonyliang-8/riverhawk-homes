// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// for Firebase Authentication
import { getAuth } from 'firebase/auth';
// for Firestore database
import { getFirestore } from 'firebase/firestore'
import { getStorage } from "firebase/storage";
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBzgXbEuu_VsGfEAKf2tfCxZocdW7Rmoyc",
  authDomain: "riverhawk-homes.firebaseapp.com",
  projectId: "riverhawk-homes",
  storageBucket: "riverhawk-homes.appspot.com",
  messagingSenderId: "915964534091",
  appId: "1:915964534091:web:b8c316ccaf111726b2dcce"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// call app in other files if you want to use Firebase there
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
// Firebase usage exported as "app"
export default app;