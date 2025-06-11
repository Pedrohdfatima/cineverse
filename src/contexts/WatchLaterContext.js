import React, { createContext, useState, useEffect, useContext } from "react";
import { AuthContext } from "./AuthContext";

export const WatchLaterContext = createContext();

export function WatchLaterProvider({ children }) {
  const [list, setList] = useState([]);
  const { usuario } = useContext(AuthContext);

  const getStorageKey = () => {
    if (!usuario) return null;
    return `watchLater_${usuario.email}`;
  };

  useEffect(() => {
    if (usuario) {
      const storageKey = getStorageKey();
      try {
        const storedList = JSON.parse(localStorage.getItem(storageKey)) || [];
        setList(storedList);
      } catch (error) {
        console.error("Erro ao ler a lista 'Assistir Depois':", error);
        setList([]);
      }
    } else {
      setList([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [usuario]);

  const addToWatchLater = (item) => {
    const storageKey = getStorageKey();
    if (!storageKey || !item) return;

    setList((prevList) => {
      const newList = [...prevList, item];
      localStorage.setItem(storageKey, JSON.stringify(newList));
      return newList;
    });
  };

  const removeFromWatchLater = (itemId) => {
    const storageKey = getStorageKey();
    if (!storageKey) return;

    setList((prevList) => {
      const newList = prevList.filter((item) => item.id !== itemId);
      localStorage.setItem(storageKey, JSON.stringify(newList));
      return newList;
    });
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