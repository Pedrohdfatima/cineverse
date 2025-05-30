import { useEffect, useState } from "react";
import { getPopularMovies } from "../api/tmdb"; // sua função para filmes populares
import axios from "axios";
import styles from "../styles/home.module.css";

export default function Home() {
  const [movies, setMovies] = useState([]);
  const [series, setSeries] = useState([]);

  useEffect(() => {
    // Pega os filmes populares com sua função já criada
    getPopularMovies().then(setMovies);

    // Busca séries populares direto pela API TMDB
    const fetchSeries = async () => {
      try {
        const res = await axios.get("https://api.themoviedb.org/3/tv/popular", {
          params: {
            api_key: process.env.REACT_APP_TMDB_API_KEY,
            language: "pt-BR",
          },
        });
        setSeries(res.data.results);
      } catch (error) {
        console.error("Erro ao buscar séries:", error);
      }
    };

    fetchSeries();
  }, []);

  return (
    <div className={styles.container}>
      {/* Seção Filmes */}
      <section>
        <h1 className="text-2xl font-bold mb-4 gold-text">Filmes em alta</h1>
        <div className={styles.cardList}>
          {movies.map((movie) => (
            <div key={movie.id} className={styles.card}>
              {movie.poster_path && (
                <img
                  src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`}
                  alt={movie.title}
                  className="w-full h-full object-cover rounded"
                />
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Seção Séries */}
      <section style={{ marginTop: "48px" }}>
        <h1 className="text-2xl font-bold mb-4 gold-text">Séries em alta</h1>
        <div className={styles.cardList}>
          {series.map((serie) => (
            <div key={serie.id} className={styles.card}>
              {serie.poster_path && (
                <img
                  src={`https://image.tmdb.org/t/p/w200${serie.poster_path}`}
                  alt={serie.name}
                  className="w-full h-full object-cover rounded"
                />
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
