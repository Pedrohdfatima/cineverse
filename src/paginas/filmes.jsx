import { useEffect, useState } from "react";
import { getPopularMovies } from "../api/tmdb";
import styles from "../styles/filmes.module.css";

export default function Filmes() {
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    getPopularMovies().then(setMovies);
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
    </div>
  );
}
