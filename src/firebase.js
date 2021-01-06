import firebase from "firebase";

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCzjxCSedkL-mkjzq1HDfqz8vJZWArpVEE",
  authDomain: "whatsapp-clone-mern-55a19.firebaseapp.com",
  projectId: "whatsapp-clone-mern-55a19",
  storageBucket: "whatsapp-clone-mern-55a19.appspot.com",
  messagingSenderId: "304102273182",
  appId: "1:304102273182:web:69ccfeafe869cb43e64b8f",
  measurementId: "G-YPL4CZFD2N"
};

const firebaseApp = firebase.initializeApp(firebaseConfig);
const db = firebaseApp.firestore();
const auth = firebase.auth();
const provider = new firebase.auth.GoogleAuthProvider();

export { auth, provider };
export default db;
