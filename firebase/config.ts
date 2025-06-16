// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDZhHeQhjfDQraQAG0jfeHtMqY3gGfiEmo",
  authDomain: "tandem-45d5c.firebaseapp.com",
  projectId: "tandem-45d5c",
  storageBucket: "tandem-45d5c.firebasestorage.app",
  messagingSenderId: "112993592515",
  appId: "1:112993592515:web:44582a137c6fcf42682e76",
  measurementId: "G-LGCY52VN6J"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);


export { auth, db };