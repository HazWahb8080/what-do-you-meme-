import { initializeApp, getApp, getApps } from "firebase/app";
import { getFirestore } from "@firebase/firestore";
import { getStorage } from "@firebase/storage";
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCDa2yGT1VSyVlRlvKVMcLa0oiNDJOUAcU",
  authDomain: "what-do-you-meme-a7d37.firebaseapp.com",
  projectId: "what-do-you-meme-a7d37",
  storageBucket: "what-do-you-meme-a7d37.appspot.com",
  messagingSenderId: "583585874879",
  appId: "1:583585874879:web:e7bc9fba26976d6e8c970a",
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore();
const storage = getStorage();
// const analytics = !getApps().length ? getAnalytics(app) : getApp();

export default app;
export { db, storage };
