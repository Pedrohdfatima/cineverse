import { useEffect, useState } from "react";
import axios from "axios";
import BannerSlider from "../components/BannerSlider";
import { Link } from "react-router-dom";
import styles from "../styles/series.module.css";

const API_KEY = process.env.REACT_APP_TMDB_API_KEY;
const LANG = "pt-BR";

export default function Series() {
  const [seriesPopulares, setSeriesPopulares] = useState([]);
  const [melhoresSeries, setMelhoresSeries] = useState([]);

  useEffect(() => {
    const fetchSeries = async () => {
      try {
        const [resPopulares, resTopRated] = await Promise.all([
          axios.get("https://api.themoviedb.org/3/tv/popular", {
            params: { api_key: API_KEY, language: LANG },
          }),
          axios.get("https://api.themoviedb.org/3/tv/top_rated", {
            params: { api_key: API_KEY, language: LANG },
          }),
        ]);
        setSeriesPopulares(resPopulares.data.results.slice(0, 10));
        setMelhoresSeries(resTopRated.data.results.slice(0, 10));
      } catch (error) {
        console.error("Erro ao buscar séries:", error);
      }
    };

    fetchSeries();
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.sliderWrapper}>
        <BannerSlider dados={seriesPopulares} />
      </div>

      <h2 className={styles.sectionTitle}>Séries Populares</h2>
      <div className={styles.scrollContainer}>
        {seriesPopulares.map((serie) => (
         <Link
      to={`/detalhes/tv/${serie.id}`}
      key={serie.id}
      className={styles.card}
      title={serie.name}
    >
      <img
        src={`https://image.tmdb.org/t/p/w300${serie.poster_path}`}
        alt={serie.name}
      />
      <p className={styles.cardTitle}>{serie.name || "Sem nome"}</p>
    </Link>
        ))}
      </div>

      <h2 className={styles.sectionTitle}>Melhores Avaliadas</h2>
      <div className={styles.scrollContainer}>
        {melhoresSeries.map((serie) => (
          <div key={serie.id} className={styles.card}>
            <img
              src={`https://image.tmdb.org/t/p/w300${serie.poster_path}`}
              alt={serie.name}
            />
            <p className={styles.cardTitle}>{serie.name || "Sem nome"}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
