import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCy0SgrG8zcXKHia9HYztjcDtLUhHL-JgQ",
  authDomain: "uni-proj-2db65.firebaseapp.com",
  projectId: "uni-proj-2db65",
  storageBucket: "uni-proj-2db65.firebasestorage.app",
  messagingSenderId: "139822869391",
  appId: "1:139822869391:web:61f7b9013b1b616f70b9fa",
  measurementId: "G-K7Y7CM5Y55",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
