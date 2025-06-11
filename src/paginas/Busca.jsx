import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import axios from "axios";
import styles from "../styles/busca.module.css";

export default function Busca() {
  const [resultados, setResultados] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchParams] = useSearchParams();

  const termo = searchParams.get("q");

  useEffect(() => {
    const buscarTudo = async () => {
      if (!termo) {
        setResultados([]);
        return;
      }

      setLoading(true);
      try {
        const res = await axios.get(
          "https://api.themoviedb.org/3/search/multi",
          {
            params: {
              api_key: process.env.REACT_APP_TMDB_API_KEY,
              language: "pt-BR",
              query: termo,
              include_adult: false,
            },
          }
        );
        setResultados(res.data.results);
      } catch (err) {
        console.error("Erro na busca:", err);
        setResultados([]);
      } finally {
        setLoading(false);
      }
    };

    buscarTudo();
  }, [termo]);

  const filmes = resultados.filter((item) => item.media_type === "movie");
  const series = resultados.filter((item) => item.media_type === "tv");

  return (
    <div className={styles.container}>
      <h2 className={styles.sectionTitle}>Resultados para: "{termo}"</h2>

      {loading && <p>Carregando...</p>}

      {!loading && resultados.length === 0 && termo && (
        <p>Nenhum resultado encontrado para "{termo}".</p>
      )}

      {filmes.length > 0 && (
        <>
          <h3 className={styles.subTitle}>Filmes</h3>
          <div className={styles.scrollContainer}>
            {filmes.map((item) => (
              <Link
                to={`/detalhes/${item.media_type}/${item.id}`}
                key={item.id}
                className={styles.card}
                title={item.title}
              >
                <img
                  src={
                    item.poster_path
                      ? `https://image.tmdb.org/t/p/w300${item.poster_path}`
                      : "https://via.placeholder.com/150x220?text=Sem+Imagem"
                  }
                  alt={item.title}
                />
              </Link>
            ))}
          </div>
        </>
      )}

      {series.length > 0 && (
        <>
          <h3 className={styles.subTitle}>Séries</h3>
          <div className={styles.scrollContainer}>
            {series.map((item) => (
              <Link
                to={`/detalhes/${item.media_type}/${item.id}`}
                key={item.id}
                className={styles.card}
                title={item.name}
              >
                <img
                  src={
                    item.poster_path
                      ? `https://image.tmdb.org/t/p/w300${item.poster_path}`
                      : "https://via.placeholder.com/150x220?text=Sem+Imagem"
                  }
                  alt={item.name}
                />
              </Link>
            ))}
          </div>
        </>
      )}
    </div>
  );
}