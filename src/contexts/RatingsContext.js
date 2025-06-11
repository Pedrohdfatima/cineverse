import React, { createContext, useState, useEffect, useContext } from 'react';
import { AuthContext } from './AuthContext';

export const RatingsContext = createContext();

export function RatingsProvider({ children }) {
  const [ratings, setRatings] = useState([]);
  const { usuario } = useContext(AuthContext);

  const getStorageKey = () => {
    if (!usuario) return null;
    return `ratings_${usuario.email}`;
  };

  useEffect(() => {
    if (usuario) {
      const storageKey = getStorageKey();
      const storedRatings = JSON.parse(localStorage.getItem(storageKey)) || [];
      setRatings(storedRatings);
    } else {
      setRatings([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [usuario]);

  const rateItem = (item, rating) => {
    const storageKey = getStorageKey();
    if (!storageKey) return;

    setRatings((prev) => {
      const existingRatingIndex = prev.findIndex((r) => r.id === item.id);
      let newList;
      if (existingRatingIndex > -1) {
        newList = [...prev];
        newList[existingRatingIndex].rating = rating;
      } else {
        newList = [...prev, { ...item, rating }];
      }
      localStorage.setItem(storageKey, JSON.stringify(newList));
      return newList;
    });
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