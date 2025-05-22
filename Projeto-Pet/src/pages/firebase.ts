import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Substitua pelos valores que você copiou do Console
const firebaseConfig = {
    apiKey: "AIzaSyALi3aD4f5MLqlRbL-sk2s2ReSgoxc6sW8",
  authDomain: "projeto-pet-746d8.firebaseapp.com",
  projectId: "projeto-pet-746d8",
  storageBucket: "projeto-pet-746d8.firebasestorage.app",
  messagingSenderId: "618638980041",
  appId: "1:618638980041:web:9a2db3de29db6619156e18",
  measurementId: "G-2XT8JZCRVS"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
