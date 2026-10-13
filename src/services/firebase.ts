import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const config = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyAwRS3tvn1Uo_oLdeZSA8fO9MT2GafDST8",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "biblia-365-cb8e7.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "biblia-365-cb8e7",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:649535024064:web:25599d8429eea6cca57625",
};

export const firebaseConfigurado = Object.values(config).every((valor) => typeof valor === "string" && valor.trim().length > 0);
const app = firebaseConfigurado ? initializeApp(config) : null;
export const auth = app ? getAuth(app) : null;
export const db = app ? getFirestore(app) : null;
if (auth) auth.languageCode = "pt-BR";
