import React, { createContext, useState, useEffect, useContext } from 'react';
import { AuthContext } from './AuthContext';
import { db } from '../firebase';
import { collection, doc, setDoc, getDocs, query, orderBy, limit } from 'firebase/firestore';

export const HistoryContext = createContext();

export function HistoryProvider({ children }) {
  const [history, setHistory] = useState([]);
  const { usuario } = useContext(AuthContext);

  // Efeito para carregar o histórico do Firestore quando o usuário loga
  useEffect(() => {
    if (usuario) {
      const fetchHistory = async () => {
        // Cria uma query para buscar os itens, ordenados pelo mais recente
        const historyCol = collection(db, "users", usuario.uid, "history");
        const q = query(historyCol, orderBy("lastWatched", "desc"), limit(50)); // Limita aos últimos 50
        
        const historySnapshot = await getDocs(q);
        const userHistory = historySnapshot.docs.map(doc => doc.data());
        setHistory(userHistory);
      };
      fetchHistory();
    } else {
      setHistory([]);
    }
  }, [usuario]);

  /**
   * Adiciona um item ao histórico ou atualiza seu timestamp se já existir.
   * @param {{id, title, name, poster_path, tipo}} item O item a ser adicionado.
   */
  const addToHistory = async (item) => {
    if (!usuario || !item) return;

    try {
      // Cria um objeto com os dados e a data atual
      const historyItem = {
        ...item,
        lastWatched: new Date() // Timestamp de quando foi assistido
      };

      // Salva o item no Firestore usando o ID do filme/série como ID do documento
      await setDoc(doc(db, "users", usuario.uid, "history", String(item.id)), historyItem);
      
      // Atualiza o estado local para refletir a mudança imediatamente
      setHistory(prev => {
        // Remove o item se ele já existir para colocá-lo no topo
        const filtered = prev.filter(i => i.id !== item.id);
        return [historyItem, ...filtered];
      });

    } catch (e) {
      console.error("Erro ao adicionar ao histórico: ", e);
    }
  };

  return (
    <HistoryContext.Provider value={{ history, addToHistory }}>
      {children}
    </HistoryContext.Provider>
  );
}