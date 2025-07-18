import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDvtmin3K9r_cZNk5EFkVbqqBPVk55YQNE",
  authDomain: "arcadia-a6127.firebaseapp.com",
  projectId: "arcadia-a6127",
  storageBucket: "arcadia-a6127.appspot.com",
  messagingSenderId: "1083551279704",
  appId: "1:1083551279704:web:67ec81650a282094bdf82d",
  measurementId: "G-2VTJ3L330L",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

