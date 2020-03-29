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
  IonToolbar,
  IonActionSheet,
  IonToast
} from "@ionic/react";
import React, { useRef, useState, useContext, useEffect } from "react";
import { RouteComponentProps } from "react-router";
import "./Home.css";
import { send, shareSocialOutline, ellipsisHorizontal } from "ionicons/icons";
import TextareaAutosize from "react-textarea-autosize";
import { usePomodoroTimer } from "../hooks/usePomodoroTimer";
import { useChats } from "../hooks/useChats";
import PomodoroTimer from "../components/PomodoroTimer";
import { AuthContext } from "../context/Auth";
import { ChannelContext } from "../context/Channel";
import { navigatorShare } from "../utils/utils";

declare module "react-textarea-autosize";
const Home: React.FC<RouteComponentProps<{ id: string }>> = ({ match }) => {
  // useState
  const [rendered, setRendered] = useState<boolean>(false);
  const [text, setText] = useState<string>("");
  const [firstLoading, setFirstLoading] = useState<boolean>(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [showActionSheet, setShowActionSheet] = useState(false);

  // useContext
  const { currentUser, currentUserRef } = useContext(AuthContext);
  const { currentChannel, setCurrentChannel } = useContext(ChannelContext);

  // useRef
  const content: any = useRef(null);
  const tinAudio: any = useRef(null);

  // hooks
  const { pomodoroTimer } = usePomodoroTimer();
  const [currentChat, sendMessage, currentChatMessages] = useChats(
    currentChannel
  );

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
      sendMessage(currentUserRef, text);
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
  const share = async () => {
    const flag = await navigatorShare(currentChat.title);
    if (!flag) {
      setShowSuccessToast(true);
    }
  };
  const handleScroll = async (ev: any) => {
    // FIXME: 無限スクロールがくるまで待ち
    // if (!rendered) return;
    // if (
    //   ev.detail.scrollTop == 0 &&
    //   currentChatMessages &&
    //   currentChatMessages.length > 0
    // ) {
    //   const pr = new Promise(resolve => {
    //     moreReadTalks(currentChatMessages[0], resolve);
    //   });
    //   pr.then(async () => {
    //     let scrollEl = await content.current.getScrollElement();
    //     let isBusy = true;
    //     const prev = scrollEl.scrollHeight - scrollEl.scrollTop;
    //     requestAnimationFrame(() => {
    //       const scrollHeight = scrollEl.scrollHeight;
    //       const newScrollTop = scrollHeight - prev;
    //       console.log(newScrollTop);
    //       requestAnimationFrame(() => {
    //         console.log(newScrollTop);
    //         isBusy = false;
    //       });
    //     });
    //   });
    // }
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
  useEffect(
    () => {
      if (pomodoroTimer.isSound) {
        // tinAudio.current.play();
      }
    },
    [pomodoroTimer]
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
        <audio preload="auto" ref={tinAudio}>
          <source src="assets/audio/tin.ogg" type="audio/ogg" />
        </audio>
        <IonToast
          isOpen={showSuccessToast}
          onDidDismiss={() => setShowSuccessToast(false)}
          message="URLをコピーしました"
          position="top"
          duration={200}
        />
        <IonActionSheet
          isOpen={showActionSheet}
          onDidDismiss={() => setShowActionSheet(false)}
          buttons={[
            {
              text: "編集",
              handler: () => {
                console.log("Edit clicked");
              }
            },
            {
              text: "削除",
              role: "destructive",
              handler: () => {
                console.log("Delete clicked");
              }
            },
            {
              text: "キャンセル",
              role: "cancel",
              handler: () => {
                console.log("Cancel clicked");
              }
            }
          ]}
        />
        <div className="chat-room-wrapper">
          {currentChatMessages &&
            currentChatMessages.map((message: any, index: number) => (
              <div className="talk-wrapper" key={index}>
                <div className="talk-header">
                  <div className="info">
                    id: {message.uid} : {message.displayCreatedAt}
                  </div>
                  <div className="menu-button-wrapper">
                    <IonButton
                      className="menu-button"
                      fill="clear"
                      size="small"
                      onClick={() => setShowActionSheet(true)}
                    >
                      <IonIcon
                        color="medium"
                        slot="icon-only"
                        icon={ellipsisHorizontal}
                      />
                    </IonButton>
                  </div>
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
