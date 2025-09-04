import { initializeApp } from "firebase/app";
import { initializeFirestore, persistentLocalCache, persistentMultipleTabManager } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyC0HPBs50SN9w8ks8MCS8lXziUHJvJR-9Q",
  authDomain: "lopcloud.firebaseapp.com",
  projectId: "lopcloud",
  storageBucket: "lopcloud.firebasestorage.app",
  messagingSenderId: "537813002413",
  appId: "1:537813002413:web:c1245ac715793cbe797e24",
  measurementId: "G-F756813310"
};

const app = initializeApp(firebaseConfig);

export const db = initializeFirestore(app, {
  localCache: persistentLocalCache({
    tabManager: persistentMultipleTabManager()
  })
});