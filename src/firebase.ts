import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyClT-TynWczSD0wQw4BdQgEkOiedZS-QPY",
  authDomain: "app-web-19a5a.firebaseapp.com",
  databaseURL: "https://app-web-19a5a-default-rtdb.firebaseio.com",
  projectId: "app-web-19a5a",
  storageBucket: "app-web-19a5a.appspot.com",
  messagingSenderId: "94528633071",
  appId: "1:94528633071:web:8d7998b2eb1333d6c0031a",
  measurementId: "G-6BN49KLZQQ"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
