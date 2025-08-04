// src/firebase.ts

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// TODO: Reemplaza esto con la configuración de TU proyecto de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyBOYAmDJ0NIWtUU7lV7_fmFlqNxjZWvInQ",
  authDomain: "singlespa-a95cd.firebaseapp.com",
  projectId: "singlespa-a95cd",
  storageBucket: "singlespa-a95cd.firebasestorage.app",
  messagingSenderId: "760070798289",
  appId: "1:760070798289:web:5c03c0ef500fab5fc43ef0"
};

// Inicializa Firebase
const app = initializeApp(firebaseConfig);

// Exporta los servicios que usarás
export const auth = getAuth(app);
export const db = getFirestore(app);