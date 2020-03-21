import { useState, useEffect, createContext } from "react";
// 
export function useAuthentication() {
  const [user, setUser] = useState<any>();
  const [userId, setUserId] = useState<string>("");
  useEffect(() => {
//    authenticateAnonymously().then((userCredential: any) => {
//      setUserId(userCredential.user.uid);
//      setUser(userCredential.user);
//    });
  });
  return {
    user,
    setUser
  };
}
