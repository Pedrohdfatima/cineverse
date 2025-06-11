import { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import styles from "../styles/detalhes.module.css";
import { useAuth } from "../hooks/useAuth";
import { WatchLaterContext } from "../contexts/WatchLaterContext";
import { FavoritesContext } from '../contexts/FavoritesContext';
import { RatingsContext } from '../contexts/RatingsContext';
import HorizontalScroll from "../components/HorizontalScroll"; // <-- IMPORTAR O COMPONENTE

export default function Detalhes() {
  const { tipo, id } = useParams();
  const navigate = useNavigate();
  const [dados, setDados] = useState(null);
  const [providers, setProviders] = useState(null);
  const [recommendations, setRecommendations] = useState([]); // <-- NOVO ESTADO

  const { usuario } = useAuth();
  const { addToWatchLater, removeFromWatchLater, isWatchLater } = useContext(WatchLaterContext);
  const { addToFavorites, removeFromFavorites, isFavorite } = useContext(FavoritesContext);
  const { rateItem, getRating } = useContext(RatingsContext);
  const ehFavorito = isFavorite(dados?.id);
  const avaliacaoUsuario = getRating(dados?.id);

 
  const estaSalvo = isWatchLater(dados?.id);

  // ... (mantenha o resto das suas funções handleWatchLater, handleFavorite, etc.)
  const handleWatchLater = () => {
    if (!dados) return;

    const itemParaSalvar = {
      id: dados.id,
      title: dados.title || dados.name,
      poster_path: dados.poster_path,
      tipo: tipo,
    };

    if (estaSalvo) {
      removeFromWatchLater(dados.id);
    } else {
      addToWatchLater(itemParaSalvar);
    }
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


  useEffect(() => {
    const buscarDetalhes = async () => {
      try {
        const [detalhesRes, providersRes, recommendationsRes] = await Promise.all([ // <-- ADICIONADO recommendationsRes
          axios.get(`https://api.themoviedb.org/3/${tipo}/${id}`, {
            params: {
              api_key: process.env.REACT_APP_TMDB_API_KEY,
              language: "pt-BR",
              append_to_response: "videos,credits",
            },
          }),
          axios.get(
            `https://api.themoviedb.org/3/${tipo}/${id}/watch/providers`,
            {
              params: {
                api_key: process.env.REACT_APP_TMDB_API_KEY,
              },
            }
          ),
          // NOVA CHAMADA DE API PARA RECOMENDAÇÕES
          axios.get(`https://api.themoviedb.org/3/${tipo}/${id}/recommendations`, {
            params: {
              api_key: process.env.REACT_APP_TMDB_API_KEY,
              language: "pt-BR",
            },
          }),
        ]);

        setDados(detalhesRes.data);
        setProviders(providersRes.data.results?.BR || null);
        setRecommendations(recommendationsRes.data.results); // <-- SALVA AS RECOMENDAÇÕES NO ESTADO
      } catch (err) {
        console.error("Erro ao buscar detalhes:", err);
      }
    };

    buscarDetalhes();
  }, [tipo, id]);

  if (!dados) return <div className={styles.container}>Carregando...</div>;

  const trailer = dados.videos?.results?.find(
    (v) => v.type === "Trailer" && v.site === "YouTube"
  );

  return (
    <div className={styles.container}>
      {/* ... (todo o seu JSX existente para a parte de cima da página) ... */}
        <button onClick={() => navigate(-1)} className={styles.backButton}>
        ⬅ Voltar
      </button>

      <div className={styles.header}>
        <img
          src={`https://image.tmdb.org/t/p/w500${dados.poster_path}`}
          alt={dados.title || dados.name}
          className={styles.poster}
        />

      

        <div className={styles.info}>
          <h1 className={styles.title}>{dados.title || dados.name}</h1>

             {usuario && (
              <div className={styles.userActions}>
            <button onClick={handleWatchLater} className={styles.watchLaterButton}>
              {estaSalvo ? 'Remover da Lista' : 'Salvar para Depois'}
            </button>
                <button onClick={handleFavorite} className={styles.actionButton}>
              {ehFavorito ? 'Remover dos Favoritos' : 'Adicionar aos Favoritos'}
            </button>
          </div>
        )}
        
           {usuario && (
          <div className={styles.ratingSection}>
            <h3>Sua Avaliação:</h3>
            <div className={styles.stars}>
              {[1, 2, 3, 4, 5].map((star) => (
                <span 
                  key={star} 
                  className={star <= avaliacaoUsuario ? styles.starFilled : styles.star}
                  onClick={() => handleRating(star)}
                >
                  ★
                </span>
              ))}
            </div>
          </div>
        )}
          <p className={styles.overview}>{dados.overview}</p>

          {dados.genres && (
            <p>
              <strong>Gêneros:</strong>{" "}
              {dados.genres.map((g) => g.name).join(", ")}
            </p>
          )}

          {dados.runtime && (
            <p>
              <strong>Duração:</strong> {dados.runtime} min
            </p>
          )}

          {dados.number_of_seasons && (
            <p>
              <strong>Temporadas:</strong> {dados.number_of_seasons}
            </p>
          )}

          <p>
            <strong>Lançamento:</strong>{" "}
            {dados.release_date || dados.first_air_date}
          </p>

          <p>
            <strong>Popularidade:</strong> {dados.popularity}
          </p>

          <p>
            <strong>Nota:</strong> ⭐ {dados.vote_average} ({dados.vote_count} votos)
          </p>

          {dados.homepage && (
            <p>
              <a
                href={dados.homepage}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.homepageLink}
              >
                Página oficial
              </a>
            </p>
          )}
        </div>
      </div>

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
            {providers.flatrate && (
              <>
                <h3 className={styles.providerSubTitle}>Streaming</h3>
                <div className={styles.providerGrid}>
                  {providers.flatrate.map((p) => (
                    <div
                      key={p.provider_id}
                      title={p.provider_name}
                      className={styles.providerLogo}
                    >
                      <img
                        src={`https://image.tmdb.org/t/p/original${p.logo_path}`}
                        alt={p.provider_name}
                      />
                    </div>
                  ))}
                </div>
              </>
            )}

            {providers.rent && (
              <>
                <h3 className={styles.providerSubTitle}>Aluguel</h3>
                <div className={styles.providerGrid}>
                  {providers.rent.map((p) => (
                    <div
                      key={p.provider_id}
                      title={p.provider_name}
                      className={styles.providerLogo}
                    >
                      <img
                        src={`https://image.tmdb.org/t/p/original${p.logo_path}`}
                        alt={p.provider_name}
                      />
                    </div>
                  ))}
                </div>
              </>
            )}

            {providers.buy && (
              <>
                <h3 className={styles.providerSubTitle}>Compra</h3>
                <div className={styles.providerGrid}>
                  {providers.buy.map((p) => (
                    <div
                      key={p.provider_id}
                      title={p.provider_name}
                      className={styles.providerLogo}
                    >
                      <img
                        src={`https://image.tmdb.org/t/p/original${p.logo_path}`}
                        alt={p.provider_name}
                      />
                    </div>
                  ))}
                </div>
              </>
            )}
          </>
        ) : (
          <p className={styles.noProvider}>
            Nenhuma informação disponível sobre onde assistir.
          </p>
        )}
      </div>


      {/* NOVA SEÇÃO DE RECOMENDAÇÕES */}
      <div style={{marginTop: '3rem'}}>
        <HorizontalScroll
          title="Recomendações"
          initialData={recommendations}
          mediaType={tipo}
        />
      </div>

    </div>
  );
}