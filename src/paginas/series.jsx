import React from "react"; // Adicionado React para JSX funcionar corretamente
import HorizontalScroll from "../components/HorizontalScroll";
import styles from "../styles/series.module.css";

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

export default function Series() {
  return (
    <div className={styles.container}>
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
      <HorizontalScroll
        title="Séries No Ar Agora"
        fetchUrl="https://api.themoviedb.org/3/tv/on_the_air"
        mediaType="tv"
      />
      <HorizontalScroll
        title="Séries Estreando Hoje"
        fetchUrl="https://api.themoviedb.org/3/tv/airing_today"
        mediaType="tv"
      />
       <HorizontalScroll
        title="Tendências da Semana (Séries)"
        fetchUrl="https://api.themoviedb.org/3/trending/tv/week"
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
