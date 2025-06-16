import React, { createContext, useState, useEffect, useContext } from 'react';
import { AuthContext } from './AuthContext';
import { db } from '../firebase'; // Importa a instância do Firestore
import { collection, doc, getDocs, setDoc, deleteDoc } from 'firebase/firestore';

export const FavoritesContext = createContext();

export function FavoritesProvider({ children }) {
  const [favorites, setFavorites] = useState([]);
  const { usuario } = useContext(AuthContext);

  // Efeito para carregar os favoritos do Firestore quando o usuário loga
  useEffect(() => {
    if (usuario) {
      const fetchFavorites = async () => {
        const favoritesCol = collection(db, "users", usuario.uid, "favorites");
        const favoriteSnapshot = await getDocs(favoritesCol);
        const userFavorites = favoriteSnapshot.docs.map(doc => doc.data());
        setFavorites(userFavorites);
      };
      fetchFavorites();
    } else {
      // Limpa os favoritos se o usuário deslogar
      setFavorites([]);
    }
  }, [usuario]);

  const addToFavorites = async (item) => {
    if (!usuario) return;
    try {
      // Define um documento com o ID do filme/série
      await setDoc(doc(db, "users", usuario.uid, "favorites", String(item.id)), item);
      setFavorites(prev => [...prev, item]);
    } catch (e) {
      console.error("Erro ao adicionar favorito: ", e);
    }
  };

  const removeFromFavorites = async (itemId) => {
    if (!usuario) return;
    try {
      await deleteDoc(doc(db, "users", usuario.uid, "favorites", String(itemId)));
      setFavorites(prev => prev.filter(item => item.id !== itemId));
    } catch (e) {
      console.error("Erro ao remover favorito: ", e);
    }
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