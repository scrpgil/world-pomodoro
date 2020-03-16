import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar
} from "@ionic/react";
import React from "react";
import ExploreContainer from "../components/ExploreContainer";
import "./Home.css";
import { PomodoroTimer, usePomodoroTimer } from "../hooks/usePomodoroTimer";

const Home: React.FC = () => {
  const { pomodoroTimer } = usePomodoroTimer();
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
            <IonTitle size="large">Blank</IonTitle>
          </IonToolbar>
        </IonHeader>
        {pomodoroTimer.time}
        <ExploreContainer />
      </IonContent>
    </IonPage>
  );
};

export default Home;
