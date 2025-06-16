import { useEffect, useState, useContext } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import styles from "../styles/detalhes.module.css";
import { useAuth } from "../hooks/useAuth";
import { WatchLaterContext } from "../contexts/WatchLaterContext";
import { FavoritesContext } from '../contexts/FavoritesContext';
import { RatingsContext } from '../contexts/RatingsContext';
import HorizontalScroll from "../components/HorizontalScroll";

export default function Detalhes() {
  const { tipo, id } = useParams();
  const navigate = useNavigate();
  const location = useLocation(); // Necessário para passar o estado na navegação

  // Estados do componente
  const [dados, setDados] = useState(null);
  const [providers, setProviders] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [selectedSeason, setSelectedSeason] = useState(null);
  const [episodes, setEpisodes] = useState([]);
  const [loadingEpisodes, setLoadingEpisodes] = useState(false);

  // Contextos
  const { usuario } = useAuth();
  const { addToWatchLater, removeFromWatchLater, isWatchLater } = useContext(WatchLaterContext);
  const { addToFavorites, removeFromFavorites, isFavorite } = useContext(FavoritesContext);
  const { rateItem, getRating } = useContext(RatingsContext);

  // Variáveis derivadas do estado
  const ehFavorito = dados ? isFavorite(dados.id) : false;
  const avaliacaoUsuario = dados ? getRating(dados.id) : 0;
  const estaSalvo = dados ? isWatchLater(dados.id) : false;

  // Funções de manipulação de eventos
  const handleWatchLater = () => {
    if (!dados) return;
    const item = { id: dados.id, title: dados.title || dados.name, poster_path: dados.poster_path, tipo: tipo };
    estaSalvo ? removeFromWatchLater(dados.id) : addToWatchLater(item);
  };

  const handleFavorite = () => {
    if (!dados) return;
    const item = { id: dados.id, title: dados.title || dados.name, poster_path: dados.poster_path, tipo: tipo };
    ehFavorito ? removeFromFavorites(dados.id) : addToFavorites(item);
  };

  const handleRating = (rating) => {
    if (!dados) return;
    const item = { id: dados.id, title: dados.title || dados.name, poster_path: dados.poster_path, tipo: tipo, runtime: dados.runtime, genres: dados.genres };
    rateItem(item, rating);
  };

  // Efeito para buscar os dados principais da página
  useEffect(() => {
    setDados(null);
    setRecommendations([]);
    setEpisodes([]);
    setSelectedSeason(null);
    
    const buscarDetalhes = async () => {
      try {
        const [detalhesRes, providersRes, recommendationsRes] = await Promise.all([
          axios.get(`https://api.themoviedb.org/3/${tipo}/${id}`, { params: { api_key: process.env.REACT_APP_TMDB_API_KEY, language: "pt-BR", append_to_response: "videos,credits" } }),
          axios.get(`https://api.themoviedb.org/3/${tipo}/${id}/watch/providers`, { params: { api_key: process.env.REACT_APP_TMDB_API_KEY } }),
          axios.get(`https://api.themoviedb.org/3/${tipo}/${id}/recommendations`, { params: { api_key: process.env.REACT_APP_TMDB_API_KEY, language: "pt-BR" } }),
        ]);

        setDados(detalhesRes.data);
        setProviders(providersRes.data.results?.BR || null);
        setRecommendations(recommendationsRes.data.results);
        
        if (detalhesRes.data.seasons) {
          const firstSeason = detalhesRes.data.seasons.find(s => s.season_number > 0) || detalhesRes.data.seasons[0];
          if (firstSeason) {
            setSelectedSeason(firstSeason.season_number);
          }
        }
      } catch (err) {
        console.error("Erro ao buscar detalhes:", err);
      }
    };
    buscarDetalhes();
  }, [tipo, id]);

  // Efeito para buscar os episódios de uma temporada específica
  useEffect(() => {
    if (tipo === 'tv' && selectedSeason !== null) {
      setLoadingEpisodes(true);
      const buscarEpisodios = async () => {
        try {
          const res = await axios.get(`https://api.themoviedb.org/3/tv/${id}/season/${selectedSeason}`, {
            params: { api_key: process.env.REACT_APP_TMDB_API_KEY, language: "pt-BR" },
          });
          setEpisodes(res.data.episodes);
        } catch (error) {
          console.error("Erro ao buscar episódios:", error);
          setEpisodes([]);
        } finally {
          setLoadingEpisodes(false);
        }
      };
      buscarEpisodios();
    }
  }, [id, selectedSeason, tipo]);


  if (!dados) {
    return <div className={styles.container}>Carregando...</div>;
  }

  const trailer = dados.videos?.results?.find(v => v.type === "Trailer" && v.site === "YouTube");
  const availableSeasons = dados.seasons?.filter(s => s.season_number > 0);

  return (
    <div className={styles.container}>
      <button onClick={() => navigate(-1)} className={styles.backButton}>⬅ Voltar</button>

      <div className={styles.header}>
        <img
          src={dados.poster_path ? `https://image.tmdb.org/t/p/w500${dados.poster_path}` : 'https://via.placeholder.com/500x750?text=Sem+Imagem'}
          alt={dados.title || dados.name}
          className={styles.poster}
        />
        
        <div className={styles.info}>
          <h1 className={styles.title}>{dados.title || dados.name}</h1>
          
          <div className={styles.userActions}>
            {tipo === 'movie' && (
              <button onClick={() => navigate(`/assistir/${tipo}/${dados.id}`, { state: { item: dados } })} className={styles.watchButton}>
                ▶ Assistir Agora
              </button>
            )}
            {usuario && (
              <>
                <button onClick={handleWatchLater} className={styles.watchLaterButton}>{estaSalvo ? 'Remover da Lista' : 'Salvar para Depois'}</button>
                <button onClick={handleFavorite} className={styles.actionButton}>{ehFavorito ? 'Remover dos Favoritos' : 'Adicionar aos Favoritos'}</button>
              </>
            )}
          </div>
          
          {usuario && (
            <div className={styles.ratingSection}>
              <h3>Sua Avaliação:</h3>
              <div className={styles.stars}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <span key={star} className={star <= avaliacaoUsuario ? styles.starFilled : styles.star} onClick={() => handleRating(star)}>★</span>
                ))}
              </div>
            </div>
          )}

          <p className={styles.overview}>{dados.overview}</p>
          {dados.genres && (<p><strong>Gêneros:</strong> {dados.genres.map((g) => g.name).join(", ")}</p>)}
          {dados.runtime && (<p><strong>Duração:</strong> {dados.runtime} min</p>)}
          {dados.number_of_seasons && (<p><strong>Temporadas:</strong> {dados.number_of_seasons}</p>)}
          <p><strong>Lançamento:</strong> {new Date(dados.release_date || dados.first_air_date).toLocaleDateString("pt-BR", {timeZone: 'UTC'})}</p>
          <p><strong>Nota:</strong> ⭐ {dados.vote_average?.toFixed(1)} ({dados.vote_count} votos)</p>
          {dados.homepage && (<p><a href={dados.homepage} target="_blank" rel="noopener noreferrer" className={styles.homepageLink}>Página oficial</a></p>)}
        </div>
      </div>

      {tipo === 'tv' && availableSeasons && availableSeasons.length > 0 && (
        <div className={styles.seasonsSection}>
          <h2 className={styles.sectionTitle}>Episódios</h2>
          <select 
            className={styles.seasonSelector}
            value={selectedSeason || ''}
            onChange={(e) => setSelectedSeason(Number(e.target.value))}
          >
            {availableSeasons.map(season => (
              <option key={season.id} value={season.season_number}>
                Temporada {season.season_number} ({season.episode_count} episódios)
              </option>
            ))}
          </select>
          
          {loadingEpisodes ? <p>Carregando episódios...</p> : (
            <ul className={styles.episodeList}>
              {episodes.map(ep => (
                <li key={ep.id} className={styles.episodeItem}>
                  <img 
                    src={ep.still_path ? `https://image.tmdb.org/t/p/w300${ep.still_path}` : 'https://via.placeholder.com/300x169?text=Sem+Imagem'} 
                    alt={ep.name} 
                    className={styles.episodeImage}
                  />
                  <div className={styles.episodeInfo}>
                    <div className={styles.episodeHeader}>
                      <h3 className={styles.episodeTitle}>T{selectedSeason}:E{ep.episode_number} - {ep.name}</h3>
                      <button 
                        className={styles.playButton} 
                        onClick={() => navigate(`/assistir/tv/${id}/${selectedSeason}/${ep.episode_number}`, { state: { item: dados } })}
                        aria-label={`Assistir episódio ${ep.episode_number}`}
                      >
                        ▶
                      </button>
                    </div>
                    <p className={styles.episodeOverview}>{ep.overview}</p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {trailer && (
        <div className={styles.trailerContainer}>
          <h2 className={styles.sectionTitle}>Trailer</h2>
          <iframe
            width="100%"
            height="400"
            src={`https://www.youtube.com/embed/${trailer.key}`}
            title="Trailer"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
      )}

      <div>
        <h2 className={styles.sectionTitle}>Onde assistir</h2>
        {providers ? (
          <>
            {providers.flatrate && providers.flatrate.length > 0 && (
              <>
                <h3 className={styles.providerSubTitle}>Streaming</h3>
                <div className={styles.providerGrid}>
                  {providers.flatrate.map((p) => (<div key={p.provider_id} title={p.provider_name} className={styles.providerLogo}><img src={`https://image.tmdb.org/t/p/original${p.logo_path}`} alt={p.provider_name}/></div>))}
                </div>
              </>
            )}
            {providers.rent && providers.rent.length > 0 && (
              <>
                <h3 className={styles.providerSubTitle}>Aluguel</h3>
                <div className={styles.providerGrid}>
                  {providers.rent.map((p) => (<div key={p.provider_id} title={p.provider_name} className={styles.providerLogo}><img src={`https://image.tmdb.org/t/p/original${p.logo_path}`} alt={p.provider_name}/></div>))}
                </div>
              </>
            )}
            {providers.buy && providers.buy.length > 0 && (
              <>
                <h3 className={styles.providerSubTitle}>Compra</h3>
                <div className={styles.providerGrid}>
                  {providers.buy.map((p) => (<div key={p.provider_id} title={p.provider_name} className={styles.providerLogo}><img src={`https://image.tmdb.org/t/p/original${p.logo_path}`} alt={p.provider_name}/></div>))}
                </div>
              </>
            )}
          </>
        ) : (
          <p className={styles.noProvider}>Nenhuma informação de streaming disponível.</p>
        )}
      </div>

      <div style={{marginTop: '3rem'}}>
        <HorizontalScroll title="Recomendações" initialData={recommendations} mediaType={tipo} />
      </div>
    </div>
  );
}