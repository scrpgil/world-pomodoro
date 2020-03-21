import { useState, useEffect } from "react";
import {
  addChatRooms,
  getChatRoom,
  getTalks,
  addTalks
} from "../services/firebase";
import { convDateFormat } from "../utils/utils";

export function useChats(channelId: string) {
  const [currentChat, setCurrentChat] = useState(null);
  const [currentChatMessages, setCurrentChatMessages] = useState<any>([]);

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
        setCurrentChatMessages(talks);
      });
    },
    [channelId]
  );
  const sendMessage = (chatName: string, body: string) => {
    addTalks(channelId, chatName, body);
  };
  const createChat = (chatName: string) => {
    return new Promise(resolve => {
      getChatRoom(chatName).then(doc => {
        if (doc.data()) {
          const data: any = doc.data();
          data.id = doc.id;
          setCurrentChat(data);
          resolve({ title: data.title, id: data.id });
        } else {
          const id = addChatRooms(chatName);
          resolve({ title: chatName, id: id });
        }
      });
    });
  };

  return [currentChat, sendMessage, currentChatMessages, createChat];
}
