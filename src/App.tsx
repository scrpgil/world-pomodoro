import Menu from "./components/Menu";
import React from "react";
import { Route } from "react-router-dom";
import { IonApp, IonRouterOutlet, IonSplitPane } from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";
import Home from "./pages/Home";
import { AuthProvider } from "./context/Auth";
import { ChannelProvider } from "./context/Channel";

/* Core CSS required for Ionic components to work properly */
import "@ionic/react/css/core.css";

/* Basic CSS for apps built with Ionic */
import "@ionic/react/css/normalize.css";
import "@ionic/react/css/structure.css";
import "@ionic/react/css/typography.css";

/* Optional CSS utils that can be commented out */
import "@ionic/react/css/padding.css";
import "@ionic/react/css/float-elements.css";
import "@ionic/react/css/text-alignment.css";
import "@ionic/react/css/text-transformation.css";
import "@ionic/react/css/flex-utils.css";
import "@ionic/react/css/display.css";

/* Theme variables */
import "./theme/variables.css";

const App: React.FC = () => {
  return (
    <AuthProvider>
      <ChannelProvider>
        <IonApp>
          <IonReactRouter>
            <IonRouterOutlet>
              <IonSplitPane contentId="main">
                <Menu />
                <IonRouterOutlet id="main">
                  <Route path="/" component={Home} exact={true} />
                  <Route
                    path="/:id"
                    exact={true}
                    render={props => {
                      return <Home {...props} />;
                    }}
                  />
                </IonRouterOutlet>
              </IonSplitPane>
            </IonRouterOutlet>
          </IonReactRouter>
        </IonApp>
      </ChannelProvider>
    </AuthProvider>
  );
};

export default App;
