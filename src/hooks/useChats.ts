import { useState, useEffect } from "react";
import {
  addChatRooms,
  getChatRoom,
  getTalks,
  getTalksAt,
  addTalk
} from "../services/firebase";
import { convDateFormat } from "../utils/utils";
import { ITalk } from "../interfaces/talk";

export function useChats(channelId: string) {
  let loading = false;
  const [currentChat, setCurrentChat] = useState(null);
  const [currentChatMessages, setCurrentChatMessages] = useState<any>([]);
  const [lastTalk, setLastTalk] = useState<any>(null);

  useEffect(
    () => {
      getChatRoom(channelId).then(doc => {
        if (doc.data()) {
          const data: any = doc.data();
          data.id = doc.id;
          setCurrentChat(data);
        }
      });
      getTalks(channelId).onSnapshot(snapshot => {
        let talks: ITalk[] = [];
        if (snapshot.empty) {
          console.log("No matching documents.");
        } else {
          snapshot.forEach(doc => {
            const data: any = doc.data();
            data.id = doc.id;
            talks.push(data);
            data.displayCreatedAt = convDateFormat(data.createdAt);
          });
        }
        setLastTalk(snapshot.docs[snapshot.docs.length - 1]);
        talks.reverse();
        setCurrentChatMessages(talks);
      });
    },
    [channelId]
  );
  const sendMessage = (ref: any, body: string) => {
    addTalk(channelId, ref, body);
  };
  const editMessage = (ref: any, body: string) => {
    // editTalk(channelId, ref, body);
  };
  const moreReadTalks = (talk: any, resolve: any) => {
    if (loading || !lastTalk) return;
    loading = true;
    getTalksAt(channelId, lastTalk).then(snapshot => {
      let talks: any = [];
      if (snapshot.empty) {
        console.log("No matching documents.");
      } else {
        snapshot.forEach(doc => {
          const data = doc.data();
          data.id = doc.id;
          talks.push(data);
          data.display_created_at = convDateFormat(data.created_at);
        });
      }
      talks.shift();
      setLastTalk(snapshot.docs[snapshot.docs.length - 1]);
      talks.reverse();
      const more = talks.concat(currentChatMessages);
      setCurrentChatMessages(more);
      loading = false;
      resolve();
    });
  };
  const createChat = (chatName: string) => {
    return new Promise(resolve => {
      getChatRoom(chatName).then(async doc => {
        if (doc.exists) {
          const data: any = doc.data();
          data.id = doc.id;
          setCurrentChat(data);
          resolve({ title: data.title, id: data.id });
        } else {
          const id = await addChatRooms(chatName);
          resolve({ title: chatName, id: id });
        }
      });
    });
  };

  return [
    currentChat,
    sendMessage,
    currentChatMessages,
    createChat,
    moreReadTalks
  ];
}
