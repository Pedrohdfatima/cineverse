import React, { createContext, useState, useEffect, useContext } from 'react';
import { AuthContext } from './AuthContext';

export const FavoritesContext = createContext();

export function FavoritesProvider({ children }) {
  const [favorites, setFavorites] = useState([]);
  const { usuario } = useContext(AuthContext);

  const getStorageKey = () => {
    if (!usuario) return null;
    return `favorites_${usuario.email}`;
  };

  useEffect(() => {
    if (usuario) {
      const storageKey = getStorageKey();
      const storedFavorites = JSON.parse(localStorage.getItem(storageKey)) || [];
      setFavorites(storedFavorites);
    } else {
      setFavorites([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [usuario]);

  const addToFavorites = (item) => {
    const storageKey = getStorageKey();
    if (!storageKey) return;

    setFavorites((prev) => {
      const newList = [...prev, item];
      localStorage.setItem(storageKey, JSON.stringify(newList));
      return newList;
    });
  };

  const removeFromFavorites = (itemId) => {
    const storageKey = getStorageKey();
    if (!storageKey) return;

    setFavorites((prev) => {
      const newList = prev.filter((item) => item.id !== itemId);
      localStorage.setItem(storageKey, JSON.stringify(newList));
      return newList;
    });
  };

  const isFavorite = (itemId) => {
    return favorites.some((item) => item.id === itemId);
  };

  return (
    <FavoritesContext.Provider value={{ favorites, addToFavorites, removeFromFavorites, isFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
}