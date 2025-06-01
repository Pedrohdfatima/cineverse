import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import styles from "../styles/home.module.css";

export default function Filmes() {
  const [filmesPopulares, setFilmesPopulares] = useState([]);
  const [filmesTop, setFilmesTop] = useState([]);

  useEffect(() => {
    const fetchFilmesPopulares = async () => {
      const res = await axios.get(
        "https://api.themoviedb.org/3/movie/popular",
        {
          params: {
            api_key: process.env.REACT_APP_TMDB_API_KEY,
            language: "pt-BR",
          },
        }
      );
      setFilmesPopulares(res.data.results.slice(0, 10));
    };

    const fetchFilmesTop = async () => {
      const res = await axios.get(
        "https://api.themoviedb.org/3/movie/top_rated",
        {
          params: {
            api_key: process.env.REACT_APP_TMDB_API_KEY,
            language: "pt-BR",
          },
        }
      );
      setFilmesTop(res.data.results.slice(0, 10));
    };

    fetchFilmesPopulares();
    fetchFilmesTop();
  }, []);

  return (
    <div className={styles.container}>
      <h2 className={styles.sectionTitle}>Filmes Populares</h2>
      <div className={styles.scrollContainer}>
        {filmesPopulares.map((item) => (
          <Link
            to={`/detalhes/movie/${item.id}`}
            key={item.id}
            className={styles.card}
            title={item.title}
          >
            <img
              src={`https://image.tmdb.org/t/p/w300${item.poster_path}`}
              alt={item.title}
            />
          </Link>
        ))}
      </div>

      <h2 className={styles.sectionTitle}>Filmes Mais Bem Avaliados</h2>
      <div className={styles.scrollContainer}>
        {filmesTop.map((item) => (
          <Link
            to={`/detalhes/movie/${item.id}`}
            key={item.id}
            className={styles.card}
            title={item.title}
          >
            <img
              src={`https://image.tmdb.org/t/p/w300${item.poster_path}`}
              alt={item.title}
            />
          </Link>
        ))}
      </div>
    </div>
  );
}
    