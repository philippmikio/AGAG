import firebase from 'firebase/compat/app';
import 'firebase/compat/database';

const firebaseConfig = {
  apiKey: "AIzaSyBNLl3xsCJKf2OzUZ_AWB89HxA43InNyj8",
  authDomain: "submission-form-aaaa3.firebaseapp.com",
  databaseURL: "https://submission-form-aaaa3-default-rtdb.firebaseio.com",
  projectId: "submission-form-aaaa3",
  storageBucket: "submission-form-aaaa3.appspot.com",
  messagingSenderId: "531287583933",
  appId: "1:531287583933:web:7be8eda1555537bc5a5bd4",
  measurementId: "G-X5E9FXP68T"
};

try {
  if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
  }
} catch (error) {
  console.error('Error initializing firebase:', error);
}

const db = firebase.database();

export { db };
