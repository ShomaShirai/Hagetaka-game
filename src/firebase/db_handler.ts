// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDcASrcVKgu8gkCF2IIGlXejGq-aW-Z_jo",
  authDomain: "hagetaka-game.firebaseapp.com",
  projectId: "hagetaka-game",
  storageBucket: "hagetaka-game.firebasestorage.app",
  messagingSenderId: "912631818840",
  appId: "1:912631818840:web:1f8a98d51919960535f82d",
  measurementId: "G-TDP9S13PZQ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);