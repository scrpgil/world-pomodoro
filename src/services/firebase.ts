import * as firebase from "firebase/app";
import "firebase/firestore";
import "firebase/auth";
import { DocumentReference } from "../interfaces/firebase";
import { ITalk, StatusList } from "../interfaces/talk";

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

export const getChatRoomRef = (chatRoomId: string) => {
  return db.collection(`chat_rooms`).doc(chatRoomId);
};

export const getChatRoom = (chatRoomId: string) => {
  return getChatRoomRef(chatRoomId).get();
};

export const getTalks = (chatRoomId: string) => {
  const ref = getChatRoomRef(chatRoomId);
  return ref
    .collection("talks")
    .orderBy("createdAt", "desc")
    .limit(100);
};

export const getTalksAt = (chatRoomId: string, start: any) => {
  return db
    .collection(`chat_rooms/${chatRoomId}/talks`)
    .orderBy("createdAt", "desc")
    .startAt(start)
    .limit(11)
    .get();
};

export const getTalkRef = (chatRoomId: string, talkId: string) => {
  const ref = getChatRoomRef(chatRoomId);
  return ref.collection("talks").doc(talkId);
};

export const addTalk = async (
  chatRoomId: string,
  userRef: DocumentReference,
  body: string
) => {
  const ref = getChatRoomRef(chatRoomId);
  const totalCount = await getCount(ref);
  console.log(ref);
  return ref.collection("talks").add({
    createdAt: firebase.firestore.FieldValue.serverTimestamp(),
    uid: userRef.id,
    num: totalCount + 1,
    status: StatusList.Normal,
    user: { ref: userRef },
    body: body
  });
};

export const putTalk = (chatRoomId: string, talk: ITalk) => {
  console.log(talk);
  if (talk && talk.id) {
    const ref = getTalkRef(chatRoomId, talk.id);
    return ref.update(talk);
  }
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

export const getCount = async (ref: DocumentReference): Promise<number> => {
  // Sum the count of each shard in the subcollection
  return ref
    .collection("shards")
    .get()
    .then((snapshot: any) => {
      let total_count = 0;
      snapshot.forEach((doc: any) => {
        total_count += doc.data().count;
      });

      return total_count;
    });
};
