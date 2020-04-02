import React, { useState } from "react";
import { IonIcon, IonButton, IonToast } from "@ionic/react";
import { shareSocialOutline } from "ionicons/icons";
import { navigatorShare } from "../utils/utils";

interface ContainerProps {
  title: string;
}

const ShareButton: React.FC<ContainerProps> = ({ title }) => {
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const share = async () => {
    const flag = await navigatorShare(title);
    if (!flag) {
      setShowSuccessToast(true);
    }
  };
  return (
    <span>
      <IonToast
        isOpen={showSuccessToast}
        onDidDismiss={() => setShowSuccessToast(false)}
        message="URLをコピーしました"
        position="top"
        duration={200}
      />
      <IonButton fill="clear" size="small" onClick={() => share()}>
        <IonIcon color="dark" slot="icon-only" icon={shareSocialOutline} />
      </IonButton>
    </span>
  );
};

export default ShareButton;
