// For Firebase JS SDK v7.20.0 and later, measurementId is optional
import firebase from "firebase/app";
import "firebase/auth";
import "firebase/database";
import "firebase/storage";
import "firebase/firestore";

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDt5aTXeGD6_LDdwxnEOVeUQCAbfE11uYU",
  authDomain: "devchat-725ee.firebaseapp.com",
  projectId: "devchat-725ee",
  storageBucket: "devchat-725ee.appspot.com",
  messagingSenderId: "260880692879",
  appId: "1:260880692879:web:4a247752330c42e4cc22fa",
  measurementId: "G-YCNPE5J43J",
};
firebase.initializeApp(firebaseConfig);

export default firebase;

export const auth = firebase.auth();
export const database = firebase.database();
export const firestore = firebase.firestore();

export const generateUserDocument = async (user, additionalData) => {
  if (!user) return;
  const userRef = firestore.doc(`users/${user.uid}`);
  const snapshot = await userRef.get();
  if (!snapshot.exists) {
    const { email, displayName, photoURL } = user;

    try {
      await userRef.set({
        displayName,
        email,
        photoURL,
        ...additionalData,
      });
    } catch (error) {
      throw new Error(error);
    }
  }
  return getUserDocument(user.uid);
};
const getUserDocument = async (uid) => {
  if (!uid) return null;
  try {
    const userDocument = await firestore.doc(`users/${uid}`).get();
    return {
      uid,
      ...userDocument.data(),
    };
  } catch (error) {
    console.error("Error fetching user", error);
  }
};
