import React from "react";
import { IonIcon, IonButton } from "@ionic/react";
import { ellipsisHorizontal } from "ionicons/icons";
import "./Talk.css";
import { ITalk, StatusList } from "../interfaces/talk";
import { autoLinker, replaceAnchor } from "../utils/utils";

interface ContainerProps {
  talk: ITalk;
  onMenuButtonClick?: any;
  ownTalk: boolean;
  isEdited: boolean;
}

const Talk: React.FC<ContainerProps> = ({
  talk,
  onMenuButtonClick = () => {},
  ownTalk,
  isEdited
}) => {
  return (
    <div
      className={`talk-wrapper ${ownTalk ? "own-talk" : "other-talk"} ${
        talk.status === StatusList.Delete ? "talk-delete-wrapper" : ""
      } ${isEdited ? "is-edited" : ""}`}
    >
      <div className="talk-header">
        <div className="info">
          {talk.num}: {talk.uid} : {talk.displayCreatedAt}
          <span
            style={{ display: talk.status === StatusList.Edited ? "" : "none" }}
          >
            (編集済)
          </span>
        </div>
        <div className="menu-button-wrapper">
          <IonButton
            className="menu-button"
            fill="clear"
            size="small"
            onClick={() => onMenuButtonClick(talk)}
          >
            <IonIcon
              color="medium"
              slot="icon-only"
              icon={ellipsisHorizontal}
            />
          </IonButton>
        </div>
      </div>
      <div
        className="talk-body"
        dangerouslySetInnerHTML={{ __html: autoLinker(replaceAnchor(talk.body)) }}
      />
    </div>
  );
};

export default Talk;
