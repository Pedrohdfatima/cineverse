import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styles from '../styles/assistir.module.css';

export default function Assistir() {
  // Pega os parâmetros da URL, com valores padrão para temporada e episódio
  const { tipo, id, season = '1', episode = '1' } = useParams();
  const navigate = useNavigate();

  let src = '';
  if (tipo === 'movie') {
    // Constrói a URL para filmes
    src = `https://vidsrc.icu/embed/movie/${id}`;
  } else if (tipo === 'tv') {
    // Constrói a URL para séries, usando S1E1 como padrão
    src = `https://vidsrc.icu/embed/tv/${id}/${season}/${episode}`;
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
        // Mensagem de erro caso o tipo seja inválido
        <p>Não foi possível carregar o vídeo.</p>
      )}
       {tipo === 'tv' && (
         <div className={styles.episodeNote}>
            <p>Atualmente exibindo a <strong>Temporada {season}, Episódio {episode}</strong>.</p>
            <p>A funcionalidade de seleção de episódios poderá ser adicionada no futuro.</p>
         </div>
       )}
    </div>
  );
}