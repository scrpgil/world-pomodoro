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
  IonActionSheet
} from "@ionic/react";
import React, { useRef, useState, useContext, useEffect } from "react";
import { RouteComponentProps } from "react-router";
import "./Home.css";
import { send } from "ionicons/icons";
import TextareaAutosize from "react-textarea-autosize";
import { usePomodoroTimer } from "../hooks/usePomodoroTimer";
import { useChats } from "../hooks/useChats";
import PomodoroTimer from "../components/PomodoroTimer";
import Talk from "../components/Talk";
import ShareButton from "../components/ShareButton";
import { AuthContext } from "../context/Auth";
import { ChannelContext } from "../context/Channel";
import { ITalk } from "../interfaces/talk";

declare module "react-textarea-autosize";
const Home: React.FC<RouteComponentProps<{ id: string }>> = ({ match }) => {
  // useState
  const [rendered, setRendered] = useState<boolean>(false);
  const [text, setText] = useState<string>("");
  const [firstLoading, setFirstLoading] = useState<boolean>(false);
  const [showOwnActionSheet, setShowOwnActionSheet] = useState(false);
  const [currentTalk, setCurrentTalk] = useState();
  const [isEdited, setIsEdited] = useState<boolean>(false);

  // useContext
  const { currentUser, currentUserRef } = useContext(AuthContext);
  const { currentChannel, setCurrentChannel } = useContext(ChannelContext);

  // useRef
  const content: any = useRef(null);
  const tinAudio: any = useRef(null);

  // hooks
  const { pomodoroTimer } = usePomodoroTimer();
  const [
    currentChat,
    sendTalk,
    currentChatMessages,
    createChat,
    moreReadTalks,
    deleteMessage,
    editTalk
  ] = useChats(currentChannel);

  // functions
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
  const onSendTalk = () => {
    if (text !== "" && currentUser && !isEdited) {
      // 普通の送信
      sendTalk(currentUserRef, text);
      setText("");
      scrollToTheBottom(400);
    }
  };
  const onEditFix = () => {
    if (text !== "" && currentUser && isEdited) {
      // 編集中
      currentTalk.body = text;
      setIsEdited(false);
      editTalk(currentTalk);
      setText("");
      scrollToTheBottom(400);
    }
  };
  const onEnterPress = (e: any) => {
    if (e.keyCode === 13 && e.shiftKey === true) {
      e.preventDefault();
      if (isEdited) {
        onEditFix();
      } else {
        onSendTalk();
      }
    }
  };
  const onShowActionSheet = (talk: ITalk) => {
    if (
      currentUserRef &&
      talk &&
      talk.user &&
      talk.user.ref.path === currentUserRef.path
    ) {
      setCurrentTalk(talk);
      setShowOwnActionSheet(true);
    } else {
      // setShowOtherActionSheet(true);
    }
  };

  // UseEffect
  useEffect(
    () => {
      if (!rendered || firstLoading) return;
      scrollToTheBottom(0);
      setFirstLoading(true);
    },
    [currentChatMessages, rendered, firstLoading]
  );
  useEffect(
    () => {
      if (pomodoroTimer.isSound) {
        // tinAudio.current.play();
      }
    },
    [pomodoroTimer]
  );

  // Ionic Hooks
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
              <ShareButton title={currentChat ? currentChat.title : ""} />
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
        <IonActionSheet
          isOpen={showOwnActionSheet}
          onDidDismiss={() => setShowOwnActionSheet(false)}
          buttons={[
            {
              text: "編集",
              handler: () => {
                setIsEdited(true);
                setText(currentTalk.body);
                console.log("Edit clicked");
              }
            },
            {
              text: "削除",
              role: "destructive",
              handler: () => {
                deleteMessage(currentTalk);
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
            currentChatMessages.map((talk: any, index: number) => (
              <div key={index} id={"no" + index}>
                <Talk
                  talk={talk}
                  onMenuButtonClick={onShowActionSheet}
                  ownTalk={
                    currentUserRef &&
                    talk.user &&
                    talk.user.ref.path === currentUserRef.path
                  }
                  isEdited={
                    isEdited && currentTalk && currentTalk.id == talk.id
                  }
                />
              </div>
            ))}
        </div>
      </IonContent>
      <IonFooter className="ion-no-border">
        <div className={text !== "" ? "p-textarea active" : "p-textarea"}>
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
            style={{ display: isEdited ? "none" : "" }}
            fill="clear"
            onClick={() => onSendTalk()}
          >
            <IonIcon slot="icon-only" icon={send} />
          </IonButton>
        </div>
        {isEdited && (
          <div className="edit-ctrl-wrapper">
            <IonButton
              className="edit-cancel-button"
              fill="outline"
              color="medium"
              size="small"
              onClick={() => setIsEdited(false)}
            >
              キャンセル
            </IonButton>
            <IonButton
              color="send"
              className="edit-fix-button"
              size="small"
              onClick={() => onEditFix()}
            >
              変更を保存
            </IonButton>
          </div>
        )}
      </IonFooter>
    </IonPage>
  );
};

export default Home;
