import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import {
  getFirestore,
  collection,
  doc,
  addDoc,
  getDoc,
  updateDoc,
  serverTimestamp,
  query,
  onSnapshot,
  orderBy,
  where,
} from "firebase/firestore";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject, 
} from "firebase/storage";

const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_APIKEY,
  authDomain: process.env.EXPO_PUBLIC_AUTHDOMAIN,
  databaseURL: process.env.EXPO_PUBLIC_DATABASEURL,
  projectId: process.env.EXPO_PUBLIC_PROJECTID,
  storageBucket: process.env.EXPO_PUBLIC_STORAGEBUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_MESSAGINGSENDERID,
  appId: process.env.EXPO_PUBLIC_APPID,
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const firestore = getFirestore();
const fbStorage = getStorage();

export {
  auth,
  signInWithEmailAndPassword,
  firestore,
  fbStorage,
  collection,
  doc,
  addDoc,
  getDoc,
  updateDoc,
  serverTimestamp,
  query,
  onSnapshot,
  orderBy,
  where,
  ref,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject
};
