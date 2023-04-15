import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCxOZzmAoRVCaJtXFjp1gq34fIFC9O6Y0I",
  authDomain: "dynamic-7dd8f.firebaseapp.com",
  projectId: "dynamic-7dd8f",
  storageBucket: "dynamic-7dd8f.appspot.com",
  messagingSenderId: "580383237362",
  appId: "1:580383237362:web:62e7220ebf35f53972dc6b",
  measurementId: "G-TXPQC40Q60"
};

const defaultProject = initializeApp(firebaseConfig);

let db = getFirestore(defaultProject);

export default db