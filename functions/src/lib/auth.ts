export const createUserTable = async (db: any, user: any) => {
  let key = "";
  try {
    key = await db
      .collection("users")
      .doc(user.uid)
      .set({
        name: user.displayName,
        icon: user.photoURL,
        status: 0,
        created: user.metadata.creationTime
      })
      .then(async (docRef: any) => {
        console.log("Document written with ID: ", docRef.id);
        return docRef.id;
      })
      .catch(async (error: any) => {
        console.error("Error adding document: ", error);
        return "";
      });
  } catch (e) {
    console.error(e);
  }
  return key;
};
export const createDeleteUserTable = async (db: any, user: any) => {
  let key = "";
  try {
    key = await db
      .collection("delete_users")
      .doc(user.uid)
      .set({
        name: user.displayName,
        email: user.email,
        icon: user.photoURL,
        created: user.metadata.creationTime
      })
      .then(async (docRef: any) => {
        console.log("Document written with ID: ", docRef.id);
        return docRef.id;
      })
      .catch(async (error: any) => {
        console.error("Error adding document: ", error);
        return "";
      });
  } catch (e) {
    console.error(e);
  }
  return key;
};
