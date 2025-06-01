import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import styles from "../styles/home.module.css";

export default function Series() {
  const [seriesPopulares, setSeriesPopulares] = useState([]);
  const [seriesTop, setSeriesTop] = useState([]);

  useEffect(() => {
    const fetchSeriesPopulares = async () => {
      const res = await axios.get(
        "https://api.themoviedb.org/3/tv/popular",
        {
          params: {
            api_key: process.env.REACT_APP_TMDB_API_KEY,
            language: "pt-BR",
          },
        }
      );
      setSeriesPopulares(res.data.results.slice(0, 10));
    };

    const fetchSeriesTop = async () => {
      const res = await axios.get(
        "https://api.themoviedb.org/3/tv/top_rated",
        {
          params: {
            api_key: process.env.REACT_APP_TMDB_API_KEY,
            language: "pt-BR",
          },
        }
      );
      setSeriesTop(res.data.results.slice(0, 10));
    };

    fetchSeriesPopulares();
    fetchSeriesTop();
  }, []);

  return (
    <div className={styles.container}>
      <h2 className={styles.sectionTitle}>Séries Populares</h2>
      <div className={styles.scrollContainer}>
        {seriesPopulares.map((item) => (
          <Link
            to={`/detalhes/tv/${item.id}`}
            key={item.id}
            className={styles.card}
            title={item.name}
          >
            <img
              src={`https://image.tmdb.org/t/p/w300${item.poster_path}`}
              alt={item.name}
            />
          </Link>
        ))}
      </div>

      <h2 className={styles.sectionTitle}>Séries Mais Bem Avaliadas</h2>
      <div className={styles.scrollContainer}>
        {seriesTop.map((item) => (
          <Link
            to={`/detalhes/tv/${item.id}`}
            key={item.id}
            className={styles.card}
            title={item.name}
          >
            <img
              src={`https://image.tmdb.org/t/p/w300${item.poster_path}`}
              alt={item.name}
            />
          </Link>
        ))}
      </div>
    </div>
  );
}
