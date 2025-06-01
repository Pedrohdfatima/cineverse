import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import styles from "../styles/detalhes.module.css";

export default function Detalhes() {
  const { tipo, id } = useParams();
  const navigate = useNavigate();
  const [dados, setDados] = useState(null);
  const [providers, setProviders] = useState(null);

  useEffect(() => {
    const buscarDetalhes = async () => {
      try {
        const [detalhesRes, providersRes] = await Promise.all([
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
        ]);

        setDados(detalhesRes.data);
        setProviders(providersRes.data.results?.BR || null);
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
    </div>
  );
}
