// firebase.ts
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAZZudsxkB5wUrM-GbSTMuiXVvyJAZZFL0",
  authDomain: "voz-uleam-4a411.firebaseapp.com",
  projectId: "voz-uleam-4a411",
  storageBucket: "voz-uleam-4a411.firebasestorage.app",
  messagingSenderId: "920319643035",
  appId: "1:920319643035:web:0d95ab7784f006fdc0a53e"
};
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);