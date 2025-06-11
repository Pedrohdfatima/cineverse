import { useEffect, useState } from "react";
import axios from "axios";
import BannerSlider from "../components/BannerSlider";
import HorizontalScroll from "../components/HorizontalScroll"; // <-- IMPORTAÇÃO ADICIONADA
import styles from "../styles/home.module.css";

const API_KEY = process.env.REACT_APP_TMDB_API_KEY;
const LANG = "pt-BR";

const categorias = [
  { id: 28, nome: "Ação" },
  { id: 35, nome: "Comédia" },
  { id: 27, nome: "Terror" },
  { id: 10749, nome: "Romance" },
  { id: 16, nome: "Animação" },
  { id: 99, nome: "Documentário" },
  { id: 18, nome: "Drama" },
  { id: 878, nome: "Ficção Científica" },
];

export default function Home() {
  const [tendencias, setTendencias] = useState([]);

  useEffect(() => {
    const fetchTendencias = async () => {
      try {
        const tendenciasRes = await axios.get(
          "https://api.themoviedb.org/3/trending/all/week",
          {
            params: { api_key: API_KEY, language: LANG },
          }
        );
        setTendencias(tendenciasRes.data.results);
      } catch (error) {
        console.error("Erro ao buscar tendências:", error);
      }
    };

    fetchTendencias();
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.sliderWrapper}>
        {/* O BannerSlider permanece o mesmo */}
        <BannerSlider dados={tendencias.slice(0, 5)} />
      </div>

      {/* Seção de Tendências agora usa HorizontalScroll */}
      <HorizontalScroll
        title="Tendências da Semana"
        fetchUrl="https://api.themoviedb.org/3/trending/all/week"
        mediaType="movie" // ou ajuste conforme necessário
      />

      {/* Seções de Categoria agora usam HorizontalScroll */}
      {categorias.map((cat) => (
        <HorizontalScroll
          key={`movie-genre-${cat.id}`}
          title={cat.nome}
          fetchUrl="https://api.themoviedb.org/3/discover/movie"
          params={{ with_genres: cat.id, sort_by: "popularity.desc" }}
          mediaType="movie"
        />
      ))}
    </div>
  );
}