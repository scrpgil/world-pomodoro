import {
  IonContent,
  IonItem,
  IonLabel,
  IonList,
  IonListHeader,
  IonMenu,
  IonMenuToggle,
  IonNote
} from "@ionic/react";
import React, { useContext } from "react";
import { RouteComponentProps, withRouter } from "react-router-dom";
import "./Menu.css";
import { AuthContext } from "../context/auth";

interface MenuProps extends RouteComponentProps {
  selectedPage: string;
}

interface AppPage {
  url: string;
  title: string;
}

const appPages: AppPage[] = [
  {
    title: "#general",
    url: "/home"
  },
  {
    title: "#random",
    url: "/home"
  }
];

const Menu: React.FunctionComponent<MenuProps> = ({ selectedPage }) => {
  const { currentUser } = useContext(AuthContext);

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
                  className={selectedPage === appPage.title ? "selected" : ""}
                  routerLink={appPage.url}
                  routerDirection="none"
                  lines="none"
                  detail={false}
                >
                  <IonLabel>{appPage.title}</IonLabel>
                </IonItem>
              </IonMenuToggle>
            );
          })}
        </IonList>
      </IonContent>
    </IonMenu>
  );
};

export default withRouter(Menu);
