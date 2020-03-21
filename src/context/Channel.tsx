import React, {
  createContext,
  useReducer,
  Dispatch,
  SetStateAction,
  useState
} from "react";

type ContextValue = {
  currentChannel: string;
  // the type when you hover over setState in AppProvider
  setCurrentChannel: Dispatch<SetStateAction<string>>;
};

const initialState: ContextValue = {
  currentChannel: "",
  setCurrentChannel: () => {}
};
// Contextを宣言。Contextの中身を {currentUser: undefined} と定義
const ChannelContext = createContext(initialState);

const ChannelProvider = (props: any) => {
  // Contextに持たせるcurrentUserは内部的にはuseStateで管理
  const [currentChannel, setCurrentChannel] = useState<string>("general");

  return (
    <ChannelContext.Provider
      value={{
        currentChannel,
        setCurrentChannel
      }}
    >
      {props.children}
    </ChannelContext.Provider>
  );
};

export { ChannelContext, ChannelProvider };
