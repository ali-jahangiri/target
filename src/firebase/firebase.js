import firebase from "firebase";

const firebaseApp = firebase.initializeApp({
  apiKey: "AIzaSyBAZ1EYwUFy5uZ0HtjpnvauPesSCR9zmIk",
  authDomain: "target-1dc0b.firebaseapp.com",
  projectId: "target-1dc0b",
  storageBucket: "target-1dc0b.appspot.com",
  messagingSenderId: "569979414355",
  appId: "1:569979414355:web:13683a393681631ef923a6",
});


const serverTimestamp = firebase.firestore.FieldValue.serverTimestamp

const db = firebaseApp.firestore();


export default db;
