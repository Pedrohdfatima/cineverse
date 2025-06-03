import { useEffect, useState } from "react";
import axios from "axios";
import BannerSlider from "../components/BannerSlider";
import styles from "../styles/filmes.module.css";
import { Link } from "react-router-dom";

const API_KEY = process.env.REACT_APP_TMDB_API_KEY;
const LANG = "pt-BR";

export default function Filmes() {
  const [filmesPopulares, setFilmesPopulares] = useState([]);
  const [melhoresFilmes, setMelhoresFilmes] = useState([]);

  useEffect(() => {
    const fetchFilmes = async () => {
      try {
        const [resPopulares, resTopRated] = await Promise.all([
          axios.get("https://api.themoviedb.org/3/movie/popular", {
            params: { api_key: API_KEY, language: LANG },
          }),
          axios.get("https://api.themoviedb.org/3/movie/top_rated", {
            params: { api_key: API_KEY, language: LANG },
          }),
        ]);
        setFilmesPopulares(resPopulares.data.results.slice(0, 10));
        setMelhoresFilmes(resTopRated.data.results.slice(0, 10));
      } catch (error) {
        console.error("Erro ao buscar filmes:", error);
      }
    };

    fetchFilmes();
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.sliderWrapper}>
        <BannerSlider dados={filmesPopulares} />
      </div>

      <h2 className={styles.sectionTitle}>Filmes Populares</h2>
      <div className={styles.scrollContainer}>
        {filmesPopulares.map((filme) => (
          <Link
            to={`/detalhes/movie/${filme.id}`}
            key={filme.id}
            className={styles.card}
            title={filme.title}
          >
            <img
              src={`https://image.tmdb.org/t/p/w300${filme.poster_path}`}
              alt={filme.title}
            />
            <p className={styles.cardTitle}>{filme.title || "Sem título"}</p>
          </Link>
        ))}
      </div>

      <h2 className={styles.sectionTitle}>Melhores Avaliados</h2>
      <div className={styles.scrollContainer}>
        {melhoresFilmes.map((filme) => (
          <Link
            to={`/detalhes/movie/${filme.id}`}
            key={filme.id}
            className={styles.card}
            title={filme.title}
          >
            <img
              src={`https://image.tmdb.org/t/p/w300${filme.poster_path}`}
              alt={filme.title}
            />
            <p className={styles.cardTitle}>{filme.title || "Sem título"}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
