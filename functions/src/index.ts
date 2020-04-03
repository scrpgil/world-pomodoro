import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import { createUserTable } from "./lib/auth";
import { createCounter, incrementCounter } from "./lib/shard-counter";

admin.initializeApp();
const db = admin.firestore();
const SHARD_NUM = 3;

exports.createUserTable = functions.auth.user().onCreate(async (user: any) => {
  await createUserTable(db, user);
  return 0;
});

exports.createShardsCounter = functions.firestore
  .document("chat_rooms/{chatRoomId}")
  .onCreate(async (snap, context) => {
    await createCounter(db, snap.ref, SHARD_NUM);
    return 0;
  });

exports.incrementCounter = functions.firestore
  .document("chat_rooms/{chatRoomId}/talks/{talkId}")
  .onCreate(async (snap, context) => {
    await incrementCounter(snap.ref.parent.parent, SHARD_NUM);
    return 0;
  });
