import { FIREBASE_CONFIG } from "env";
import { initializeApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
} from "firebase/auth";

export const useAuth = () => {
  const firebaseConfig = FIREBASE_CONFIG;
  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
  const googleProvider = new GoogleAuthProvider();

  return {
    auth,
    googleProvider,
    signInWithPopup,
    signOut,
    isEnable: !!firebaseConfig.appId,
  };
};
