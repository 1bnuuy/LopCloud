import { createContext, useContext, useState, useEffect } from "react";
import {
  signInWithEmailAndPassword,
  signInAnonymously,
  onAuthStateChanged,
} from "firebase/auth";
import { auth } from "../../firebase";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const ownerEmail = "kiddolol39@gmail.com"; // <-- Your email
    const ownerPassword = "StrikerGlobal"; // <-- Your password

    signInWithEmailAndPassword(auth, ownerEmail, ownerPassword)
      .then((userCredential) => {
        setUser(userCredential.user);
        console.log("Logged in as owner! UID:", userCredential.user.uid);
      })
      .catch(() => {
        signInAnonymously(auth)
          .then((userCredential) => {
            setUser(userCredential.user);
            console.log("Signed in anonymously! UID:", userCredential.user.uid);
          })
          .catch(console.error);
      });

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user }}>{children}</AuthContext.Provider>
  );
}
