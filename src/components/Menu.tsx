import {
  IonContent,
  IonItem,
  IonLabel,
  IonList,
  IonListHeader,
  IonMenu,
  IonAlert,
  IonMenuToggle,
  IonNote
} from "@ionic/react";
import React, { useState, useContext } from "react";
import { withRouter } from "react-router-dom";
import "./Menu.css";
import { AuthContext } from "../context/Auth";
import { ChannelContext } from "../context/Channel";
import { useChats } from "../hooks/useChats";
import { IChatRoom } from "../interfaces/chat-room";

interface AppPage {
  url: string;
  id: string;
  title: string;
}

const appPages: AppPage[] = [
  {
    title: "general",
    id: "general",
    url: "/general"
  },
  {
    title: "random",
    id: "random",
    url: "/random"
  }
];

const Menu: React.FunctionComponent = () => {
  const { currentUser } = useContext(AuthContext);
  const { currentChannel, setCurrentChannel } = useContext(ChannelContext);

  const [showAddChatRoomAlert, setShowAddChatRoomAlert] = useState(false);
  const [currentChat, sendTalk, currentChatTallks, createChat] = useChats(
    currentChannel
  );
  const changeChannel = (channel: string) => {
    setCurrentChannel(channel);
  };
  const addChannelAlert = () => {
    setShowAddChatRoomAlert(true);
  };
  const addChannel = (title: string) => {
    createChat(title).then((doc: IChatRoom) => {
      if (doc) {
        changeChannel(doc.id);
      }
    });
  };
  const addAppPage = (chat: any) => {
    if (!chat) {
      return;
    }
    let flag = false;
    for (let page of appPages) {
      if (page.id === chat.id) {
        flag = true;
      }
    }
    if (!flag) {
      appPages.push({
        title: chat.title,
        id: chat.id,
        url: "/home"
      });
    }
  };
  addAppPage(currentChat);

  return (
    <IonMenu contentId="main" type="overlay">
      <IonContent>
        <h1 className="p-title">みんなでポモドーロ</h1>
        <IonList id="inbox-list">
          <IonListHeader>uid</IonListHeader>
          <IonNote>{currentUser ? currentUser.uid : ""}</IonNote>
          <IonListHeader>channel</IonListHeader>
          {appPages.map((appPage, index) => {
            return (
              <IonMenuToggle key={index} autoHide={false}>
                <IonItem
                  button
                  className={
                    currentChannel === appPage.id
                      ? "p-menu-item selected"
                      : "p-menu-item"
                  }
                  onClick={() => changeChannel(appPage.id)}
                  lines="none"
                  detail={false}
                >
                  <IonLabel>#{appPage.title}</IonLabel>
                </IonItem>
              </IonMenuToggle>
            );
          })}
          <IonItem
            button
            className="p-menu-add-chat"
            onClick={() => addChannelAlert()}
            lines="none"
            detail={false}
          >
            <IonLabel>+ add channel</IonLabel>
          </IonItem>
        </IonList>
        <IonAlert
          isOpen={showAddChatRoomAlert}
          onDidDismiss={() => setShowAddChatRoomAlert(false)}
          header={"チャットルーム新規作成"}
          inputs={[
            {
              name: "title",
              type: "text",
              placeholder: "ルーム名を入力"
            }
          ]}
          buttons={[
            {
              text: "Cancel",
              role: "cancel",
              cssClass: "secondary",
              handler: () => {
                console.log("Confirm Cancel");
              }
            },
            {
              text: "Ok",
              handler: data => {
                addChannel(data.title);
              }
            }
          ]}
        />
      </IonContent>
    </IonMenu>
  );
};

export default withRouter(Menu);
