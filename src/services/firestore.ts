import * as firebase from "firebase/app";
import "firebase/firestore";
import "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCgxbo1RIsD4G99GuuPxcfilOQu37n3amQ",
  authDomain: "world-pomodoro.firebaseapp.com",
  databaseURL: "https://world-pomodoro.firebaseio.com",
  projectId: "world-pomodoro",
  storageBucket: "world-pomodoro.appspot.com",
  messagingSenderId: "578882952478",
  appId: "1:578882952478:web:f6692cf4a46ed23db53d0f",
  measurementId: "G-QWS8FZBS4L"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

export const authenticateAnonymously = () => {
  return firebase.auth().signInAnonymously();
};

