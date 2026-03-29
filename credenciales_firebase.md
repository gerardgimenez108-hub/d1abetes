"// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAN4CstRvttBEwEaK4a8LmjjQkB4LPH9BQ",
  authDomain: "d1abetes.firebaseapp.com",
  projectId: "d1abetes",
  storageBucket: "d1abetes.firebasestorage.app",
  messagingSenderId: "245429834379",
  appId: "1:245429834379:web:14dc41c2cf51e961a7fa8e",
  measurementId: "G-HKQM9153D0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);"