import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar
} from "@ionic/react";
import React from "react";
import "./Home.css";
import { usePomodoroTimer } from "../hooks/usePomodoroTimer";

const Home: React.FC = () => {
  const { pomodoroTimer, getBreakTimeText } = usePomodoroTimer();
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>みんなでポモドーロ</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">みんなでポモドーロ</IonTitle>
          </IonToolbar>
        </IonHeader>
        <div className="container">
          <div className="timer">
            <h1 className="title">{pomodoroTimer.time}</h1>
          </div>
          <div
            className={pomodoroTimer.breakTime ? "status break-time" : "status"}
          >
            {getBreakTimeText(pomodoroTimer.breakTime)}
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Home;
