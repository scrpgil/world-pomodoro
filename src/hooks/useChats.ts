import { useState, useEffect } from "react";
import { getTalks, addTalks } from "../services/firestore";
import { convDateFormat } from "../utils/utils";

export function useChats() {
  const [currentChatId, setCurrentChatId] = useState(null);
  const [currentChatMessages, setCurrentChatMessages] = useState<any>([]);

  useEffect(
    () => {
      getTalks("general").onSnapshot(snapshot => {
        if (snapshot.empty) {
          console.log("No matching documents.");
          return;
        }
        let talks: any = [];
        snapshot.forEach(doc => {
          const data = doc.data();
          data.id = doc.id;
          talks.push(data);
          data.display_created_at = convDateFormat(data.created_at);
        });
        setCurrentChatMessages(talks);
      });
    },
    [currentChatId]
  );
  const sendMessage = (chatName: string, body: string) => {
    addTalks("general", chatName, body);
  };
  const createChat = (recipient: string, chatName: string) => {
    // const fullChatName = `${chatName}--${uuid.v4()}`;
    // saveToDatabase(`/${recipient}/chats/${fullChatName}`, fullChatName);
    // saveToDatabase(`/${userId}/chats/${fullChatName}`, fullChatName);
    // saveToDatabase(`/chats/${fullChatName}/messages`, {});
    // setCurrentChat(fullChatName);
  };

  return [
    sendMessage,
    createChat,
    currentChatId,
    currentChatMessages,
    setCurrentChatId
  ];
}
