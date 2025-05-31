import { useEffect, useState } from "react";
import { getPopularMovies, getPopularSeries } from "../api/tmdb";
import styles from "../styles/home.module.css";

export default function Home() {
  const [movies, setMovies] = useState([]);
  const [series, setSeries] = useState([]);

  useEffect(() => {
    getPopularMovies().then(setMovies);
    getPopularSeries().then(setSeries);
  }, []);

  return (
    <div className={styles.container}>
      <h1 className={styles.sectionTitle}>Filmes em alta</h1>
      <div className={styles.scrollContainer}>
        {movies.map((movie) => (
          <div key={movie.id} className={styles.card}>
            {movie.poster_path && (
              <img
                src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`}
                alt={movie.title}
              />
            )}
          </div>
        ))}
      </div>

      <h1 className={styles.sectionTitle} style={{ marginTop: "2rem" }}>
        Séries em alta
      </h1>
      <div className={styles.scrollContainer}>
        {series.map((serie) => (
          <div key={serie.id} className={styles.card}>
            {serie.poster_path && (
              <img
                src={`https://image.tmdb.org/t/p/w200${serie.poster_path}`}
                alt={serie.name}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
