import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import styles from "../styles/home.module.css";

const API_KEY = process.env.REACT_APP_TMDB_API_KEY;
const LANG = "pt-BR";

export default function Home() {
  const [topGeral, setTopGeral] = useState([]);
  const [filmesPopulares, setFilmesPopulares] = useState([]);
  const [seriesPopulares, setSeriesPopulares] = useState([]);
  const [melhoresFilmes, setMelhoresFilmes] = useState([]);

  useEffect(() => {
    const fetchDados = async () => {
      try {
        const [resGeral, resFilmes, resSeries, resTopRated] = await Promise.all([
          axios.get("https://api.themoviedb.org/3/trending/all/day", {
            params: { api_key: API_KEY, language: LANG },
          }),
          axios.get("https://api.themoviedb.org/3/movie/popular", {
            params: { api_key: API_KEY, language: LANG },
          }),
          axios.get("https://api.themoviedb.org/3/tv/popular", {
            params: { api_key: API_KEY, language: LANG },
          }),
          axios.get("https://api.themoviedb.org/3/movie/top_rated", {
            params: { api_key: API_KEY, language: LANG },
          }),
        ]);

        setTopGeral(resGeral.data.results.slice(0, 10));
        setFilmesPopulares(resFilmes.data.results.slice(0, 10));
        setSeriesPopulares(resSeries.data.results.slice(0, 10));
        setMelhoresFilmes(resTopRated.data.results.slice(0, 10));
      } catch (err) {
        console.error("Erro ao carregar dados:", err);
      }
    };

    fetchDados();
  }, []);

  const renderSecao = (titulo, dados) => (
    <>
      <h2 className={styles.sectionTitle}>{titulo}</h2>
      <div className={styles.scrollContainer}>
        {dados.map((item) => (
          <Link
            to={`/detalhes/${item.media_type || item.title ? "movie" : "tv"}/${item.id}`}
            key={item.id}
            className={styles.card}
            title={item.title || item.name}
          >
            <img
              src={`https://image.tmdb.org/t/p/w300${item.poster_path}`}
              alt={item.title || item.name}
            />
          </Link>
        ))}
      </div>
    </>
  );

  return (
    <div className={styles.container}>
      {renderSecao("Top 10 do Dia", topGeral)}
      {renderSecao("Filmes Populares", filmesPopulares)}
      {renderSecao("Séries Populares", seriesPopulares)}
      {renderSecao("Melhores Avaliados", melhoresFilmes)}
    </div>
  );
}
