// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBHArMhzlMFU9LUblXro2LbJsSxovBqam8",
  authDomain: "flipbundle.firebaseapp.com",
  projectId: "flipbundle",
  storageBucket: "flipbundle.appspot.com",
  messagingSenderId: "409430971185",
  appId: "1:409430971185:web:d35d22b18edf73312e9610",
  measurementId: "G-J970Y1K6G8"
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

export default auth;