// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getStorage, ref, getDownloadURL} from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDYJ8XEv7tmLIouXDZoFZfGirUjTHkaprQ",
  authDomain: "skk-blog-6eedd.firebaseapp.com",
  projectId: "skk-blog-6eedd",
  storageBucket: "skk-blog-6eedd.appspot.com",
  messagingSenderId: "116387220875",
  appId: "1:116387220875:web:beb2c85a4d00923356738e",
  measurementId: "G-SFBHLD5JKM"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);

export const db = getFirestore(app);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
provider.setCustomParameters({
  prompt: 'select_account'
});
export const storage = getStorage(app);
export { ref, getDownloadURL };



