import React from "react"; // Adicionado React para JSX funcionar corretamente
import HorizontalScroll from "../components/HorizontalScroll";
import styles from "../styles/filmes.module.css";

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
  return (
    <div className={styles.container}>
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
      <HorizontalScroll
        title="Em Cartaz"
        fetchUrl="https://api.themoviedb.org/3/movie/now_playing"
        mediaType="movie"
      />
      <HorizontalScroll
        title="Próximos Lançamentos"
        fetchUrl="https://api.themoviedb.org/3/movie/upcoming"
        mediaType="movie"
      />
      <HorizontalScroll
        title="Tendências da Semana (Filmes)"
        fetchUrl="https://api.themoviedb.org/3/trending/movie/week"
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
