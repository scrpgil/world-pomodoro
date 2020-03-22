import {
  IonContent,
  IonHeader,
  IonPage,
  IonButtons,
  IonMenuButton,
  IonTitle,
  IonButton,
  IonIcon,
  IonFooter,
  useIonViewDidEnter,
  IonToolbar
} from "@ionic/react";
import React, { useRef, useState, useContext, useEffect } from "react";
import { RouteComponentProps } from "react-router";
import "./Home.css";
import { send, shareSocialOutline } from "ionicons/icons";
import TextareaAutosize from "react-textarea-autosize";
import { usePomodoroTimer } from "../hooks/usePomodoroTimer";
import { useChats } from "../hooks/useChats";
import PomodoroTimer from "../components/PomodoroTimer";
import { AuthContext } from "../context/Auth";
import { ChannelContext } from "../context/Channel";
import { navigatorShare } from "../utils/utils";

declare module "react-textarea-autosize";
const Home: React.FC<RouteComponentProps<{ id: string }>> = ({ match }) => {
  const { pomodoroTimer } = usePomodoroTimer();
  const content = useRef(null);
  const [text, setText] = useState<string>("");
  const [rendered, setRendered] = useState<boolean>(false);
  const [firstLoading, setFirstLoading] = useState<boolean>(false);
  const { currentUser } = useContext(AuthContext);
  const { currentChannel, setCurrentChannel } = useContext(ChannelContext);

  const [
    currentChat,
    sendMessage,
    currentChatMessages,
    createChat,
    moreReadTalks
  ] = useChats(currentChannel);

  const handleChange = (event: any) => {
    setText(event.target.value);
  };

  const scrollToTheBottom = (delay: number = 0) => {
    if (!content || !content.current) return;

    setTimeout(() => {
      // @ts-ignore
      content.current.scrollToBottom(delay);
    }, 200);
  };
  const sendTalk = () => {
    if (text != "" && currentUser) {
      sendMessage(currentUser.uid, text);
      setText("");
      scrollToTheBottom(400);
    }
  };
  const onEnterPress = (e: any) => {
    if (e.keyCode == 13 && e.shiftKey == true) {
      e.preventDefault();
      sendTalk();
    }
  };
  const share = () => {
    navigatorShare(currentChat.title);
  };
  const handleScroll = (ev: any) => {
    if (!rendered) return;
    if (
      ev.detail.scrollTop == 0 &&
      currentChatMessages &&
      currentChatMessages.length > 0
    ) {
      moreReadTalks(currentChatMessages[0]);
    }
  };

  useEffect(
    () => {
      console.log(firstLoading);
      if (!rendered || firstLoading) return;
      scrollToTheBottom(0);
      setFirstLoading(true);
    },
    [currentChatMessages]
  );
  useIonViewDidEnter(() => {
    setRendered(true);
    if (match.params && match.params.id) {
      setCurrentChannel(match.params.id);
    }
  });
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar className="p-toolbar">
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonTitle>
            <div className="title-wrapper">
              <div className="title-main-wrapper">
                <div>{currentChat ? currentChat.title : ""}</div>
                <div className="title-id">#{currentChannel}</div>
              </div>
              <IonButton fill="clear" size="small" onClick={() => share()}>
                <IonIcon
                  color="dark"
                  slot="icon-only"
                  icon={shareSocialOutline}
                />
              </IonButton>
            </div>
          </IonTitle>
          <IonButtons slot="end">
            <PomodoroTimer
              time={pomodoroTimer.time}
              breakTime={pomodoroTimer.breakTime}
            />
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent
        scrollEvents={true}
        onIonScroll={ev => {
          handleScroll(ev);
        }}
        ref={content}
      >
        <div className="chat-room-wrapper">
          {currentChatMessages &&
            currentChatMessages.map((message: any, index: number) => (
              <div className="talk-wrapper" key={index}>
                <div className="talk-header">
                  id: {message.uid} : {message.display_created_at}
                </div>
                <div className="talk-body">{message.body}</div>
              </div>
            ))}
        </div>
      </IonContent>
      <IonFooter className="ion-no-border">
        <div className={text != "" ? "p-textarea active" : "p-textarea"}>
          <TextareaAutosize
            placeholder="メッセージを書く"
            value={text}
            onChange={handleChange}
            onKeyDown={onEnterPress}
          >
            {""}
          </TextareaAutosize>
          <IonButton
            className="send-button"
            fill="clear"
            onClick={() => sendTalk()}
          >
            <IonIcon slot="icon-only" icon={send} />
          </IonButton>
        </div>
      </IonFooter>
    </IonPage>
  );
};

export default Home;
