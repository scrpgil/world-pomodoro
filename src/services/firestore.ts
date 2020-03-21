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
const auth = firebase.auth();
export default auth;

export const getTalks = (chatRoomId: string) => {
  return db.collection(`chat_rooms/${chatRoomId}/talks`).orderBy('created_at');
};

export const addTalks = (chatRoomId: string, userId: string, body: string) => {
  return db.collection(`chat_rooms/${chatRoomId}/talks`).add({
    created_at: firebase.firestore.FieldValue.serverTimestamp(),
    uid: userId,
    body: body
  });
};

export const addChatRooms = () => {
  return db.collection(`chat_rooms`).add({ name: "" });
};
