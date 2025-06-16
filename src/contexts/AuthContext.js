import React, { createContext, useState, useEffect } from "react";
import { 
  getAuth, 
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../firebase";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUsuario({
          uid: user.uid,
          email: user.email,
          nome: user.displayName,
        });
      } else {
        setUsuario(null);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const register = async (nome, email, password) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    await updateProfile(user, {
      displayName: nome,
    });

    const userDocRef = doc(db, "users", user.uid);
    await setDoc(userDocRef, {
      nome: nome,
      email: email,
      createdAt: new Date(),
    });

    // CORREÇÃO: Atualiza o estado local imediatamente após o registro
    setUsuario({
      uid: user.uid,
      email: user.email,
      nome: nome,
    });
  };

  const login = async (email, password) => {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // CORREÇÃO: Atualiza o estado local imediatamente após o login
    setUsuario({
      uid: user.uid,
      email: user.email,
      nome: user.displayName,
    });
  };

  const logout = () => {
    return signOut(auth);
  };
  
  const value = {
    usuario,
    loading,
    login,
    logout,
    register,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}