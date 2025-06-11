import React, { useEffect, useState } from "react";
import axios from "axios";
import BannerSlider from "../components/BannerSlider";
import HorizontalScroll from "../components/HorizontalScroll";
import styles from "../styles/FilmesSeries.module.css";

const API_KEY = process.env.REACT_APP_TMDB_API_KEY;
const LANG = "pt-BR";


// Gêneros de filmes (pode ser movido para um arquivo de constantes se usado em mais lugares)
const GENRES = [
  { id: 28, name: "Ação" },
  { id: 12, name: "Aventura" },
  { id: 16, name: "Animação" },
  { id: 35, name: "Comédia" },
  { id: 80, name: "Crime" },
  { id: 99, name: "Documentário" },
  { id: 18, name: "Drama" },
  { id: 10751, name: "Família" },
  { id: 14, name: "Fantasia" },
  { id: 36, name: "História" },
  { id: 27, name: "Terror" },
  { id: 10402, name: "Música" },
  { id: 9648, name: "Mistério" },
  { id: 10749, name: "Romance" },
  { id: 878, name: "Ficção Científica" },
  { id: 10770, name: "Cinema TV" },
  { id: 53, name: "Suspense" },
  { id: 10752, name: "Guerra" },
  { id: 37, name: "Faroeste" },
];

// Função para calcular a data de 6 meses atrás no formato YYYY-MM-DD
// function getSixMonthsAgoDate() {
//   const date = new Date();
//   date.setMonth(date.getMonth() - 6);
//   return date.toISOString().slice(0, 10);
// }

export default function Filmes() {
  const [bannerMovies, setBannerMovies] = useState([]);

  useEffect(() => {
    const fetchBannerMovies = async () => {
      try {
        const response = await axios.get("https://api.themoviedb.org/3/movie/popular", {
          params: { api_key: API_KEY, language: LANG, page: 1 },
        });
        setBannerMovies(response.data.results);
      } catch (error) {
        console.error("Erro ao buscar filmes para o banner:", error);
      }
    };
    fetchBannerMovies();
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.sliderWrapper}>
        <BannerSlider dados={bannerMovies.slice(0, 5)} />
      </div>

      <HorizontalScroll
        title="Filmes Populares"
        fetchUrl="https://api.themoviedb.org/3/movie/popular"
        mediaType="movie"
      />
      <HorizontalScroll
        title="Melhores Avaliados"
        fetchUrl="https://api.themoviedb.org/3/movie/top_rated"
        mediaType="movie"
      />

      {GENRES.map(({ id, name }) => (
        <HorizontalScroll
          key={`movie-genre-${id}`} // Chave mais específica
          title={`Filmes de ${name}`}
          fetchUrl="https://api.themoviedb.org/3/discover/movie"
          params={{ with_genres: id, sort_by: "popularity.desc" }} // Adicionado sort_by
          mediaType="movie"
        />
      ))}

      <HorizontalScroll
        title="Filmes para Crianças (Classificação Livre - US)"
        fetchUrl="https://api.themoviedb.org/3/discover/movie"
        params={{
          certification_country: "US",
          certification: "G",
          sort_by: "popularity.desc",
        }}
        mediaType="movie"
      />

      <HorizontalScroll
        title="Filmes com Maior Receita"
        fetchUrl="https://api.themoviedb.org/3/discover/movie"
        params={{ sort_by: "revenue.desc" }}
        mediaType="movie"
      />

      {/*
      <HorizontalScroll
        title="Filmes Recentes (Últimos 6 Meses)"
        fetchUrl="https://api.themoviedb.org/3/discover/movie"
        params={{
          "primary_release_date.gte": getSixMonthsAgoDate(),
          sort_by: "primary_release_date.desc",
        }}
        mediaType="movie"
      />
      */}
    </div>
  );
}
