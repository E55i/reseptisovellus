import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyDIsbSss0td8yHf_-JiKBf75--RQFwI-pM",
  authDomain: "reseptisovellustwitter.firebaseapp.com",
  databaseURL: "https://reseptisovellustwitter-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "reseptisovellustwitter",
  storageBucket: "reseptisovellustwitter.appspot.com",
  messagingSenderId: "773290742758",
  appId: "1:773290742758:web:156b14135fcdcfc9f73c27"
};

const app = initializeApp(firebaseConfig);


const auth = getAuth(app);

export { auth, signInWithEmailAndPassword };
