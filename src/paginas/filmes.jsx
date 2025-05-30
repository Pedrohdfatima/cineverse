import { useEffect, useState } from "react";
import axios from "axios";
import styles from "../styles/filmes.module.css";

export default function Filmes() {
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    const fetchMovies = async () => {
      const res = await axios.get("https://api.themoviedb.org/3/movie/popular", {
        params: {
          api_key: process.env.REACT_APP_TMDB_API_KEY,
          language: "pt-BR",
        },
      });
      setMovies(res.data.results);
    };

    fetchMovies();
  }, []);

  return (
    <div className={styles.container}>
      <h1 className="text-2xl font-bold mb-4">Filmes em alta</h1>
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
    </div>
  );
}
