import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAtju-TgrUBs-gCuaQWtQDExJM1gwFqT10",
  authDomain: "ecom-4973c.firebaseapp.com",
  projectId: "ecom-4973c",
  storageBucket: "ecom-4973c.appspot.com",
  messagingSenderId: "988139699392",
  appId: "1:988139699392:web:00c8de7ff7ba0b8602e245"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth }; 