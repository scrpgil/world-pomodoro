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
  IonToolbar
} from "@ionic/react";
import React, { useState } from "react";
import "./Home.css";
import { send } from "ionicons/icons";
import TextareaAutosize from "react-textarea-autosize";
import { usePomodoroTimer } from "../hooks/usePomodoroTimer";
import PomodoroTimer from "../components/PomodoroTimer";

declare module "react-textarea-autosize";
const Home: React.FC = () => {
  const { pomodoroTimer } = usePomodoroTimer();

  const [text, setText] = useState<string>("");

  const handleChange = (event: any) => {
    setText(event.target.value);
  };
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar className="p-toolbar">
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonTitle>#general</IonTitle>
          <IonButtons slot="end">
            <PomodoroTimer
              time={pomodoroTimer.time}
              breakTime={pomodoroTimer.breakTime}
            />
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent />
      <IonFooter className="ion-no-border">
        <div className={text != "" ? "p-textarea active" : "p-textarea"}>
          <TextareaAutosize
            placeholder="メッセージを書く"
            value={text}
            onChange={handleChange}
          >
            {""}
          </TextareaAutosize>
          <IonButton className="send-button" fill="clear">
            <IonIcon slot="icon-only" icon={send} />
          </IonButton>
        </div>
      </IonFooter>
    </IonPage>
  );
};

export default Home;
