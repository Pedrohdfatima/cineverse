import React, { createContext, useState, useEffect, useContext } from 'react';
import { AuthContext } from './AuthContext';
import { db } from '../firebase';
import { collection, doc, getDocs, setDoc } from 'firebase/firestore';

export const RatingsContext = createContext();

export function RatingsProvider({ children }) {
  const [ratings, setRatings] = useState([]);
  const { usuario } = useContext(AuthContext);

  // Efeito para carregar as avaliações do Firestore quando o usuário loga
  useEffect(() => {
    if (usuario) {
      const fetchRatings = async () => {
        const ratingsCol = collection(db, "users", usuario.uid, "ratings");
        const ratingsSnapshot = await getDocs(ratingsCol);
        const userRatings = ratingsSnapshot.docs.map(doc => doc.data());
        setRatings(userRatings);
      };
      fetchRatings();
    } else {
      setRatings([]);
    }
  }, [usuario]);

  const rateItem = async (item, rating) => {
    if (!usuario) return;
    try {
      const itemToRate = { ...item, rating };
      await setDoc(doc(db, "users", usuario.uid, "ratings", String(item.id)), itemToRate);

      setRatings((prev) => {
        const existingRatingIndex = prev.findIndex((r) => r.id === item.id);
        let newList;
        if (existingRatingIndex > -1) {
          newList = [...prev];
          newList[existingRatingIndex].rating = rating;
        } else {
          newList = [...prev, itemToRate];
        }
        return newList;
      });
    } catch (e) {
      console.error("Erro ao avaliar item: ", e);
    }
  };

  const getRating = (itemId) => {
    const rating = ratings.find((r) => r.id === itemId);
    return rating ? rating.rating : 0;
  };

  return (
    <RatingsContext.Provider value={{ ratings, rateItem, getRating }}>
      {children}
    </RatingsContext.Provider>
  );
}