import firebase from "firebase";



const firebaseApp = firebase.initializeApp({
  apiKey: "AIzaSyBAZ1EYwUFy5uZ0HtjpnvauPesSCR9zmIk",
  authDomain: "target-1dc0b.firebaseapp.com",
  projectId: "target-1dc0b",
  storageBucket: "target-1dc0b.appspot.com",
  messagingSenderId: "569979414355",
  appId: "1:569979414355:web:13683a393681631ef923a6",
});


const db = firebaseApp.firestore();
const firebaseAuth = firebase.auth();


const singInWithGoogle = async () => {
  const provider = new firebase.auth.GoogleAuthProvider()
  return await firebaseAuth.signInWithPopup(provider);
  // window.location.reload();
}

const singInWithEmail = ({ email , password }) => {
  return firebaseAuth.createUserWithEmailAndPassword(email , password)
      .then(res => res)
}

const logInWithEmail = ({ email , password }) => {
  return firebaseAuth.signInWithEmailAndPassword(email , password)
    .then(res => res)
}

const checkAuth = callback => {
  return firebaseAuth.onAuthStateChanged(callback)
}

export const userId = firebaseAuth.currentUser?.uid;

export {
  db , 
  firebaseAuth ,
  singInWithGoogle,
  checkAuth,
  singInWithEmail,
  logInWithEmail
};
