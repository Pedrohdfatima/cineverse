import React, { createContext, useState, useEffect, useContext } from "react";
import { AuthContext } from "./AuthContext";
import { db } from '../firebase';
import { collection, doc, getDocs, setDoc, deleteDoc } from 'firebase/firestore';

export const WatchLaterContext = createContext();

export function WatchLaterProvider({ children }) {
  const [list, setList] = useState([]);
  const { usuario } = useContext(AuthContext);

  useEffect(() => {
    if (usuario) {
      const fetchWatchLater = async () => {
        const watchLaterCol = collection(db, "users", usuario.uid, "watchLater");
        const watchLaterSnapshot = await getDocs(watchLaterCol);
        const userList = watchLaterSnapshot.docs.map(doc => doc.data());
        setList(userList);
      };
      fetchWatchLater();
    } else {
      setList([]);
    }
  }, [usuario]);

  const addToWatchLater = async (item) => {
    if (!usuario) return;
    setList((prev) => [...prev, item]); // Otimista

    try {
      await setDoc(doc(db, "users", usuario.uid, "watchLater", String(item.id)), item);
    } catch (e) {
      console.error("Erro ao adicionar à lista: ", e);
      setList((prev) => prev.filter((i) => i.id !== item.id)); // Rollback
      alert("Não foi possível adicionar à lista. Tente novamente.");
    }
  };

  const removeFromWatchLater = async (itemId) => {
    if (!usuario) return;
    const originalList = [...list];
    setList((prev) => prev.filter((item) => item.id !== itemId)); // Otimista

    try {
      await deleteDoc(doc(db, "users", usuario.uid, "watchLater", String(itemId)));
    } catch (e) {
      console.error("Erro ao remover da lista: ", e);
      setList(originalList); // Rollback
      alert("Não foi possível remover da lista. Tente novamente.");
    }
  };

  const isWatchLater = (itemId) => {
    return list.some((item) => item.id === itemId);
  };

  return (
    <WatchLaterContext.Provider value={{ list, addToWatchLater, removeFromWatchLater, isWatchLater }}>
      {children}
    </WatchLaterContext.Provider>
  );
}