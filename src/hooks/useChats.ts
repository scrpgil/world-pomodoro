import { useState, useEffect } from "react";
import {
  addChatRooms,
  getChatRoom,
  getTalks,
  getTalksAt,
  addTalk,
  putTalk
} from "../services/firebase";
import { convDateFormat } from "../utils/utils";
import { ITalk, StatusList } from "../interfaces/talk";
import { IChatRoom } from "../interfaces/chat-room";

export function useChats(channelId: string) {
  let loading = false;
  const [currentChat, setCurrentChat] = useState<any>(null);
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
        console.log(talks);
        setCurrentChatMessages(talks);
      });
    },
    [channelId]
  );
  const sendMessage = (userRef: any, body: string) => {
    if (currentChat) {
      addTalk(currentChat.id, userRef, body);
    }
  };
  const editMessage = (ref: any, body: string) => {
    // editTalk(channelId, ref, body);
  };
  const deleteMessage = (talk: ITalk) => {
    if (talk) {
      talk.status = StatusList.Delete;
      talk.body = "メッセージを削除";
      putTalk(channelId, talk);
    }
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
          data.displayCreatedAt = convDateFormat(data.createdAt);
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
  const createChat = (chatName: string): Promise<IChatRoom> => {
    return new Promise(resolve => {
      getChatRoom(chatName).then(async doc => {
        if (doc.exists) {
          const data: any = doc.data();
          data.id = doc.id;
          setCurrentChat(data);
          const chatRoom: IChatRoom = { title: data.title, id: data.id };
          resolve(chatRoom);
        } else {
          const id = await addChatRooms(chatName);
          const chatRoom: IChatRoom = { title: chatName, id: id };
          resolve(chatRoom);
        }
      });
    });
  };

  return [
    currentChat,
    sendMessage,
    currentChatMessages,
    createChat,
    moreReadTalks,
    deleteMessage
  ];
}
