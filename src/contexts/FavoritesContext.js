import React, { createContext, useState, useEffect, useContext } from 'react';
import { AuthContext } from './AuthContext';
import { db } from '../firebase';
import { collection, doc, getDocs, setDoc, deleteDoc } from 'firebase/firestore';

export const FavoritesContext = createContext();

export function FavoritesProvider({ children }) {
  const [favorites, setFavorites] = useState([]);
  const { usuario } = useContext(AuthContext);

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
      setFavorites([]);
    }
  }, [usuario]);

  const addToFavorites = async (item) => {
    if (!usuario) return;
    
    // Atualização Otimista: Muda a UI primeiro
    setFavorites(prev => [...prev, item]);

    try {
      // Tenta salvar no banco de dados em segundo plano
      await setDoc(doc(db, "users", usuario.uid, "favorites", String(item.id)), item);
    } catch (e) {
      console.error("Erro ao adicionar favorito: ", e);
      // Rollback: Se der erro, remove o item que foi adicionado na UI
      setFavorites(prev => prev.filter(fav => fav.id !== item.id));
      alert("Não foi possível salvar o favorito. Tente novamente.");
    }
  };

  const removeFromFavorites = async (itemId) => {
    if (!usuario) return;

    const originalFavorites = [...favorites]; // Salva o estado original
    // Atualização Otimista: Remove da UI primeiro
    setFavorites(prev => prev.filter(item => item.id !== itemId));
    
    try {
      // Tenta deletar do banco de dados em segundo plano
      await deleteDoc(doc(db, "users", usuario.uid, "favorites", String(itemId)));
    } catch (e) {
      console.error("Erro ao remover favorito: ", e);
      // Rollback: Se der erro, restaura a lista original
      setFavorites(originalFavorites);
      alert("Não foi possível remover o favorito. Tente novamente.");
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