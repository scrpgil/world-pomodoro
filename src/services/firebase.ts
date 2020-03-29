import * as firebase from "firebase/app";
import "firebase/firestore";
import "firebase/auth";
type DocumentReference = firebase.firestore.DocumentReference;

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

export const authenticateAnonymously = () => {
  return firebase.auth().signInAnonymously();
};

export const getUserRef = (userId: string) => {
  return db.collection(`users`).doc(userId);
};

export const getChatRoom = (chatRoomId: string) => {
  return db
    .collection(`chat_rooms`)
    .doc(chatRoomId)
    .get();
};

export const getTalks = (chatRoomId: string) => {
  return db
    .collection(`chat_rooms/${chatRoomId}/talks`)
    .orderBy("created_at", "desc")
    .limit(100);
};

export const getTalksAt = (chatRoomId: string, start: any) => {
  return db
    .collection(`chat_rooms/${chatRoomId}/talks`)
    .orderBy("created_at", "desc")
    .startAt(start)
    .limit(11)
    .get();
};

export const addTalks = (
  chatRoomId: string,
  userRef: DocumentReference,
  body: string
) => {
  console.log(chatRoomId, userRef, body);
  return db.collection(`chat_rooms/${chatRoomId}/talks`).add({
    created_at: firebase.firestore.FieldValue.serverTimestamp(),
    user: { ref: userRef },
    body: body
  });
};

export const addChatRooms = (title: string) => {
  return db
    .collection(`chat_rooms`)
    .add({ title })
    .then(ref => {
      console.log("Added document with ID: ", ref.id);
      return ref.id;
    });
};
