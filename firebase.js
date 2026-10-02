// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-analytics.js";
import { collection, addDoc, getFirestore, serverTimestamp, doc, getDoc } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAMzN7uKF4VEH5VEb-8t92N-AuNhtQhCpc",
  authDomain: "ecommerce-ae4aa.firebaseapp.com",
  projectId: "ecommerce-ae4aa",
  storageBucket: "ecommerce-ae4aa.firebasestorage.app",
  messagingSenderId: "284081024713",
  appId: "1:284081024713:web:fd266ccca923eea9742718",
  measurementId: "G-G22K9R4RGG"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);

export { app, analytics, collection, addDoc, db, serverTimestamp, doc, getDoc };