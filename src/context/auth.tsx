import { User } from "firebase";
import React, { createContext, useEffect, useState } from "react";
import auth, {
  authenticateAnonymously,
  getUserRef
} from "../services/firebase";
import { DocumentReference } from "../interfaces/firebase";

// Contextの型を用意
interface IAuthContext {
  currentUser: User | null | undefined;
  currentUserRef: DocumentReference | null | undefined;
}

// Contextを宣言。Contextの中身を {currentUser: undefined} と定義
const AuthContext = createContext<IAuthContext>({
  currentUser: undefined,
  currentUserRef: undefined
});

authenticateAnonymously();
const AuthProvider = (props: any) => {
  // Contextに持たせるcurrentUserは内部的にはuseStateで管理
  const [currentUser, setCurrentUser] = useState<User | null | undefined>(
    undefined
  );
  const [currentUserRef, setCurrentUserRef] = useState<
    DocumentReference | null | undefined
  >(undefined);

  useEffect(() => {
    // Firebase Authのメソッド。ログイン状態が変化すると呼び出される
    auth.onAuthStateChanged(async (user: any) => {
      setCurrentUser(user);
      if (user && user.uid) {
        const userRef: any = await getUserRef(user.uid);
        setCurrentUserRef(userRef);
      }
    });
  }, []);

  return (
    <AuthContext.Provider
      value={{
        currentUser: currentUser,
        currentUserRef: currentUserRef
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
