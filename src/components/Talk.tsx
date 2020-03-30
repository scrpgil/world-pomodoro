import React from "react";
import { IonIcon, IonButton } from "@ionic/react";
import { ellipsisHorizontal } from "ionicons/icons";
import "./Talk.css";
import { ITalk, StatusList } from "../interfaces/talk";

interface ContainerProps {
  talk: ITalk;
  index: number;
  onShowActionSheet: any;
}

const Talk: React.FC<ContainerProps> = ({ talk, index, onShowActionSheet }) => {
  return (
    <div
      className={`talk-wrapper ${
        talk.status === StatusList.Delete ? "talk-delete-wrapper" : ""
      }`}
      key={index}
    >
      <div className="talk-header">
        <div className="info">
          {talk.num}: {talk.uid} : {talk.displayCreatedAt}
        </div>
        <div className="menu-button-wrapper">
          <IonButton className="menu-button" fill="clear" size="small">
            <IonIcon
              color="medium"
              slot="icon-only"
              icon={ellipsisHorizontal}
            />
          </IonButton>
        </div>
      </div>
      <div className="talk-body">{talk.body}</div>
    </div>
  );
};

export default Talk;
