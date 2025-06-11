import React, { useEffect, useState } from "react";
import axios from "axios";
import BannerSlider from "../components/BannerSlider";
import HorizontalScroll from "../components/HorizontalScroll";
import styles from "../styles/FilmesSeries.module.css";

// Gêneros de séries (baseado na TMDB)
const GENRES = [
  { id: 10759, name: "Ação & Aventura" },
  { id: 16, name: "Animação" },
  { id: 35, name: "Comédia" },
  { id: 80, name: "Crime" },
  { id: 99, name: "Documentário" },
  { id: 18, name: "Drama" },
  { id: 10751, name: "Família" },
  { id: 10762, name: "Infantil" },
  { id: 9648, name: "Mistério" },
  { id: 10763, name: "Notícias" },
  { id: 10764, name: "Reality" },
  { id: 10765, name: "Sci-Fi & Fantasia" },
  { id: 10766, name: "Soap" }, // Novela
  { id: 10767, name: "Talk Show" },
  { id: 10768, name: "Guerra & Política" },
  { id: 37, name: "Faroeste" }, // Adicionado Faroeste para séries também
];

const API_KEY = process.env.REACT_APP_TMDB_API_KEY;
const LANG = "pt-BR";

export default function Series() {
   const [bannerSeries, setBannerSeries] = useState([]);

  useEffect(() => {
    const fetchBannerSeries = async () => {
      try {
        const response = await axios.get("https://api.themoviedb.org/3/tv/popular", {
          params: { api_key: API_KEY, language: LANG, page: 1 },
        });
        setBannerSeries(response.data.results);
      } catch (error) {
        console.error("Erro ao buscar séries para o banner:", error);
      }
    };
    fetchBannerSeries();
  }, []);

  return (
    
    <div className={styles.container}>
      <div className={styles.sliderWrapper}>
        <BannerSlider dados={bannerSeries.slice(0, 5)} />
      </div>
      
      <HorizontalScroll
        title="Séries Populares"
        fetchUrl="https://api.themoviedb.org/3/tv/popular"
        mediaType="tv"
      />
      <HorizontalScroll
        title="Séries Melhores Avaliadas"
        fetchUrl="https://api.themoviedb.org/3/tv/top_rated"
        mediaType="tv"
      />

      {GENRES.map(({ id, name }) => (
        <HorizontalScroll
          key={`tv-genre-${id}`} // Chave mais específica
          title={`Séries de ${name}`}
          fetchUrl="https://api.themoviedb.org/3/discover/tv"
          params={{ with_genres: id, sort_by: "popularity.desc" }} // Adicionado sort_by
          mediaType="tv"
        />
      ))}
    </div>
  );
}
