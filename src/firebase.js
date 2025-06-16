// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics"; // <-- LINHA ADICIONADA
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDO-tBEECM4cdDQbHNpYtulRIt4wb6kFKo",
  authDomain: "cineverse-fe255.firebaseapp.com",
  databaseURL: "https://cineverse-fe255-default-rtdb.firebaseio.com",
  projectId: "cineverse-fe255",
  storageBucket: "cineverse-fe255.firebasestorage.app",
  messagingSenderId: "306842534372",
  appId: "1:306842534372:web:3625a47afa027367cbc7f1",
  measurementId: "G-9N2393X50W"
};

// Initialize Firebase
// Inicializa o Firebase
const app = initializeApp(firebaseConfig);

// Exporta os serviços que você vai usar na aplicação
export const auth = getAuth(app);
export const db = getFirestore(app);
export const analytics = getAnalytics(app); // A função agora está definida