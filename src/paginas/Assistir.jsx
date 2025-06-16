import React, { useEffect, useContext } from 'react';
// ADICIONADO useLocation à importação
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import styles from '../styles/assistir.module.css';
import { HistoryContext } from '../contexts/HistoryContext';

export default function Assistir() {
  const { tipo, id, season = '1', episode = '1' } = useParams();
  const navigate = useNavigate();
  const location = useLocation(); // Agora a função está definida e pode ser usada
  const { addToHistory } = useContext(HistoryContext);

  const itemData = location.state?.item;

  useEffect(() => {
    if (itemData) {
      addToHistory(itemData);
    }
  }, [itemData, addToHistory]);

  let src = '';
  if (tipo === 'movie') {
    src = `https://vidsrc.icu/embed/movie/${id}`;
  } else if (tipo === 'tv') {
    src = `https://vidsrc.icu/embed/tv/${id}/${season}/${episode}`;
  } else if (tipo === 'anime') {
    src = `https://vidsrc.icu/embed/anime/${id}/${episode}`;
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <button onClick={() => navigate(-1)} className={styles.backButton}>
          ⬅ Voltar para Detalhes
        </button>
      </div>
      {src ? (
        <div className={styles.playerWrapper}>
          <iframe
            src={src}
            frameBorder="0"
            allowFullScreen
            title="Player de Vídeo"
            className={styles.player}
          ></iframe>
        </div>
      ) : (
        <p>Não foi possível carregar o vídeo.</p>
      )}
       {tipo === 'tv' && (
         <div className={styles.episodeNote}>
            <p>Atualmente exibindo a <strong>Temporada {season}, Episódio {episode}</strong>.</p>
         </div>
       )}
       {tipo === 'anime' && (
         <div className={styles.episodeNote}>
            <p>Atualmente exibindo o <strong>Episódio {episode}</strong>.</p>
         </div>
       )}
    </div>
  );
}